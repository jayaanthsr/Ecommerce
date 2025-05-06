package com.example.ecommerce.controller;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:5173")
public class StatsController {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @GetMapping("/sales")
    public Map<String, Object> getSalesStats() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Order> orders = orderRepository.findAll();
        
        BigDecimal totalSales = orders.stream()
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalSales", totalSales);
        stats.put("totalOrders", orders.size());
        stats.put("totalProducts", productRepository.count());
        stats.put("recentOrders", orderRepository.findByOrderByOrderDateDesc().stream()
                .limit(5)
                .collect(Collectors.toList()));
        
        return stats;
    }
}