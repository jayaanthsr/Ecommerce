package com.example.ecommerce.repository;

import com.example.ecommerce.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory(String category);
    
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<Product> searchByName(String query);
    
    List<Product> findByOnSaleTrue();
}