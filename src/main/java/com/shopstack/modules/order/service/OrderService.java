package com.shopstack.modules.order.service;

import com.shopstack.modules.order.entity.Order;
import com.shopstack.modules.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public List<Order> getOrders(UUID userId) {
        return orderRepository.findByUserId(userId);
    }
}