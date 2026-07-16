package com.shopstack.modules.payment.entity;

import com.shopstack.common.audit.BaseEntity;
import com.shopstack.modules.order.entity.Order;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
public class Invoice extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "invoice_number", nullable = false, unique = true)
    private String invoiceNumber;

    @Column(nullable = false)
    private Double gstAmount;

    @Column(nullable = false)
    private Double totalAmount;
    
    @Column(name = "pdf_url")
    private String pdfUrl;
}
