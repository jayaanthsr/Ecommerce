package com.example.Ecommerce.Ecommerce.Controller;

import com.example.Ecommerce.Ecommerce.Model.LoginData;
import com.example.Ecommerce.Ecommerce.Model.ProductData;
import com.example.Ecommerce.Ecommerce.repo.EcommerceProductRepo;
import com.example.Ecommerce.Ecommerce.repo.EcommerceRepoMongoDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    @Autowired
    private EcommerceProductRepo productRepo; //product
    @Autowired
    private EcommerceRepoMongoDB repo; //userinfo


    @PostMapping("/user/addToCart")
    public void addToCart(@RequestBody Map<String,String> body) {
        String productId = body.get("productId");
        String username = body.get("username");
        System.out.println(productId+" "+username);
        LoginData user = repo.findByUsername(username);
        ArrayList<String> productIds = user.getCart();
        if(productIds == null){
            productIds = new ArrayList<>();
        }
        if(!productIds.contains(productId)){
            productIds.add(productId);
        }
        user.setCart(productIds);
        repo.save(user);
    }



    @PostMapping("/cart/{username}")
    public ArrayList<ProductData> getCart(@PathVariable String username) {
        ArrayList<ProductData> products = new ArrayList<>();
        LoginData user = repo.findByUsername(username);

        if (user == null) {
            System.out.println("User not found: " + username);
            return products; // return empty list if user not found
        }

        ArrayList<String> productIds = user.getCart();
        if (productIds == null) {
            return products; // cart is empty
        }

        for (String productId : productIds) {
            productRepo.findById(productId).ifPresent(products::add);
        }

        return products;
    }



}
