package com.example.Ecommerce.Ecommerce.repo;

import com.example.Ecommerce.Ecommerce.Model.ProductData;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EcommerceProductRepo extends MongoRepository<ProductData,String> {
}
