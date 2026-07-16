package com.shopstack.modules.cart.service;

import com.shopstack.modules.cart.entity.Cart;
import com.shopstack.modules.cart.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;

    public Cart getCart(UUID userId) {
        return cartRepository.findByUserId(userId).orElseThrow();
    }
}