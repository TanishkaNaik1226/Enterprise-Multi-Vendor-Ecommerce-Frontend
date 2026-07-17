package com.shopstack.modules.product.service;

import com.shopstack.common.enums.ProductApprovalStatus;
import com.shopstack.common.exception.BadRequestException;
import com.shopstack.common.exception.ForbiddenException;
import com.shopstack.common.exception.ResourceNotFoundException;
import com.shopstack.modules.product.dto.requests.CreateProductRequest;
import com.shopstack.modules.product.dto.requests.UpdateProductRequest;
import com.shopstack.modules.product.dto.responses.ProductResponse;
import com.shopstack.modules.product.entity.Category;
import com.shopstack.modules.product.entity.Product;
import com.shopstack.modules.product.mapper.ProductMapper;
import com.shopstack.modules.product.repository.CategoryRepository;
import com.shopstack.modules.product.repository.ProductRepository;
import com.shopstack.modules.user.entity.User;
import com.shopstack.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductResponse createProduct(CreateProductRequest request) {

        if (request.getVendorId() == null) {
            throw new BadRequestException("Vendor could not be determined for this product.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found."));

        Product product = productMapper.toEntity(request);

        product.setCategory(category);
        // Every new product must go through admin review before it is visible to customers.
        product.setApprovalStatus(ProductApprovalStatus.PENDING);
        product.setRejectionReason(null);
        product.setReviewedBy(null);
        product.setReviewedAt(null);

        return productMapper.toResponse(
                productRepository.save(product)
        );
    }

    @Override
    public ProductResponse updateProduct(UUID id, UpdateProductRequest request) {
        return updateProduct(id, request, null);
    }

    @Override
    public ProductResponse updateProduct(UUID id, UpdateProductRequest request, Long actingVendorId) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found."));

        assertOwnership(product, actingVendorId);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found."));

        productMapper.updateEntity(request, product);

        product.setCategory(category);

        // A vendor edit must be re-reviewed by an admin before it goes live again.
        if (actingVendorId != null) {
            product.setApprovalStatus(ProductApprovalStatus.PENDING);
            product.setRejectionReason(null);
            product.setReviewedBy(null);
            product.setReviewedAt(null);
        }

        return productMapper.toResponse(
                productRepository.save(product)
        );
    }

    @Override
    public void deleteProduct(UUID id) {
        deleteProduct(id, null);
    }

    @Override
    public void deleteProduct(UUID id, Long actingVendorId) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found."));

        assertOwnership(product, actingVendorId);

        productRepository.delete(product);
    }

    private void assertOwnership(Product product, Long actingVendorId) {
        if (actingVendorId != null && !actingVendorId.equals(product.getVendorId())) {
            throw new ForbiddenException("You do not have permission to modify this product.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(UUID id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found."));

        return productMapper.toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }
        @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String keyword) {

        return productRepository
                .findByProductNameContainingIgnoreCaseAndActiveTrueAndApprovalStatus(
                        keyword, ProductApprovalStatus.APPROVED)
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByCategory(UUID categoryId) {

        return productRepository
                .findByCategory_IdAndActiveTrueAndApprovalStatus(categoryId, ProductApprovalStatus.APPROVED)
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByBrand(String brand) {

        return productRepository
                .findByBrandAndActiveTrueAndApprovalStatus(brand, ProductApprovalStatus.APPROVED)
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByVendor(Long vendorId) {
        // Unfiltered on purpose: lets a vendor (or admin) see PENDING/REJECTED items too.
        return productRepository.findByVendorId(vendorId)
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByPriceRange(BigDecimal minPrice,
                                                         BigDecimal maxPrice) {

        if (minPrice.compareTo(maxPrice) > 0) {
            throw new BadRequestException(
                    "Minimum price cannot be greater than maximum price.");
        }

        return productRepository
                .findByPriceBetweenAndActiveTrueAndApprovalStatus(minPrice, maxPrice, ProductApprovalStatus.APPROVED)
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getFeaturedProducts() {

        return productRepository
                .findByFeaturedTrueAndActiveTrueAndApprovalStatus(ProductApprovalStatus.APPROVED)
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getActiveProducts() {

        return productRepository
                .findByActiveTrueAndApprovalStatus(ProductApprovalStatus.APPROVED)
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    // ---- Admin approval workflow ----

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getPendingProducts() {
        return productRepository.findByApprovalStatus(ProductApprovalStatus.PENDING)
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    public ProductResponse approveProduct(UUID id, UUID reviewerUserId, String remarks) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found."));

        product.setApprovalStatus(ProductApprovalStatus.APPROVED);
        product.setRejectionReason(null);
        product.setReviewedBy(resolveReviewer(reviewerUserId));
        product.setReviewedAt(LocalDateTime.now());

        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse rejectProduct(UUID id, UUID reviewerUserId, String remarks) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found."));

        product.setApprovalStatus(ProductApprovalStatus.REJECTED);
        product.setRejectionReason(remarks);
        product.setReviewedBy(resolveReviewer(reviewerUserId));
        product.setReviewedAt(LocalDateTime.now());

        return productMapper.toResponse(productRepository.save(product));
    }

    private User resolveReviewer(UUID reviewerUserId) {
        if (reviewerUserId == null) {
            return null;
        }
        return userRepository.findById(reviewerUserId).orElse(null);
    }
}