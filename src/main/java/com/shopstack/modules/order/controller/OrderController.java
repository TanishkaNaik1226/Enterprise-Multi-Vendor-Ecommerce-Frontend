package com.shopstack.modules.order.controller;

import com.shopstack.modules.order.entity.Order;
import com.shopstack.modules.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(@RequestParam UUID userId) {
        return ResponseEntity.ok(orderService.getOrders(userId));
    }
}