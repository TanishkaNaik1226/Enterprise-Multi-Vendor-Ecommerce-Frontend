package com.shopstack.modules.product.dto.requests;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class UpdateProductRequest {

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

    // Ownership cannot be changed via update; ignored server-side if supplied.
    private Long vendorId;

    @NotNull
    private UUID categoryId;

    private Boolean featured;

    private Boolean active;
}