package com.example.ecommerce.controller;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findByOrderByOrderDateDesc();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{email}")
    public List<Order> getUserOrders(@PathVariable String email) {
        return orderRepository.findByCustomerEmail(email);
    }
    
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        order.setOrderDate(LocalDateTime.now());
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setStatus("Pending");
        order.setEstimatedDelivery(LocalDateTime.now().plusDays(7));
        return orderRepository.save(order);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable String id,
            @RequestBody OrderStatusUpdate statusUpdate) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(statusUpdate.getStatus());
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    private static class OrderStatusUpdate {
        private String status;
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
}