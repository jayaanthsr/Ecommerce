package com.example.ecommerce.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String orderNumber;
    private Customer customer;
    private List<OrderItem> items;
    private BigDecimal subtotal;
    private BigDecimal shipping;
    private BigDecimal tax;
    private BigDecimal total;
    private String status;
    private LocalDateTime orderDate;
    private LocalDateTime estimatedDelivery;
    private Payment payment;
    private String PaymentStatus;
    private String PaymentMethod;
    private String PaymentId;

    @Data
    public static class Customer {
        private String firstName;
        private String lastName;
        private String email;
        private String address;
        private String city;
        private String zipCode;
        private String country;
    }

    @Data
    public static class OrderItem {
        private String productId;
        private String name;
        private BigDecimal price;
        private Integer quantity;
    }

    @Data
    public static class Payment {
        private String method;
        private String cardLastFour;
        private BigDecimal amount;
    }
}