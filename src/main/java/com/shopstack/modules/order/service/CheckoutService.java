package com.shopstack.modules.order.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class CheckoutService {

    public Map<String, Object> processCheckout(Map<String, Object> checkoutRequest) {
        // Extract data
        String addressId = (String) checkoutRequest.get("addressId");
        String paymentMethod = (String) checkoutRequest.get("paymentMethod");
        String couponCode = (String) checkoutRequest.get("couponCode");

        // 1. Backend Validations (Simulated here for now since full DB hookup takes more time)
        // - Stock Available
        // - Price Verification
        // - Coupon Validation
        // - Payment Verification
        // - Address Ownership

        // Calculate amount (simulated 1500)
        double amount = 1500.0;
        if ("SAVE10".equalsIgnoreCase(couponCode)) {
            amount = amount * 0.9;
        }

        // Return exact response format required by the frontend contract
        Map<String, Object> response = new HashMap<>();
        response.put("orderId", UUID.randomUUID().toString());
        response.put("paymentId", UUID.randomUUID().toString());
        response.put("amount", amount);
        response.put("currency", "INR");
        
        if ("COD".equalsIgnoreCase(paymentMethod)) {
            response.put("status", "SUCCESS");
        } else {
            response.put("status", "PENDING");
        }

        return response;
    }
}
