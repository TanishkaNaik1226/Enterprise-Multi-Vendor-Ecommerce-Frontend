package com.shopstack.modules.product.dto.requests;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class CreateProductRequest {

    @NotBlank
    @Size(max = 150)
    private String productName;

    @Size(max = 100)
    private String brand;

    private String description;

    private String imageUrl;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    @NotNull
    @Min(0)
    private Integer stockQuantity;

    // Not required from the client: for a VENDOR caller this is derived from their
    // logged-in vendor profile. ADMIN callers may supply it explicitly.
    private Long vendorId;

    @NotNull
    private UUID categoryId;

    private Boolean featured;
}