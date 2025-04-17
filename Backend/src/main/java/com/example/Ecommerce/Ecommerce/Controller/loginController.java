package com.example.Ecommerce.Ecommerce.Controller;

import com.example.Ecommerce.Ecommerce.Model.LoginData;
import com.example.Ecommerce.Ecommerce.repo.EcommerceRepoMongoDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController

@CrossOrigin(origins="http://localhost:5173")
public class loginController {

    @Autowired
    private EcommerceRepoMongoDB mongoDB;

    @PostMapping("/signup")
    public LoginData Signup(@RequestBody LoginData loginData) {
        return mongoDB.save(loginData);
    }

    @PostMapping("/login")
    public boolean login(@RequestBody LoginData loginData) {
        LoginData user = mongoDB.findByUsernameAndPassword(loginData.getUsername(),loginData.getPassword());
        return user != null;
    }

}
