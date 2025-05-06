package com.example.ecommerce.repository;

import com.example.ecommerce.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByOrderByOrderDateDesc();
    List<Order> findByStatus(String status);
    List<Order> findByCustomerEmail(String email);
}