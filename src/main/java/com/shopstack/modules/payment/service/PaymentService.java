package com.shopstack.modules.payment.service;

import com.shopstack.modules.payment.entity.Payment;
import com.shopstack.modules.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
}