package com.example.Ecommerce.Ecommerce.repo;

import com.example.Ecommerce.Ecommerce.Model.LoginData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EcommerceRepoMongoDB extends MongoRepository< LoginData , String> {
    LoginData findByUsernameAndPassword(String username, String password);
    LoginData findByUsername(String username);
}

