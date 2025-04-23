package com.example.Ecommerce.Ecommerce.Controller;

import com.example.Ecommerce.Ecommerce.Model.ProductData;
import com.example.Ecommerce.Ecommerce.repo.EcommerceProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private EcommerceProductRepo mongoDB;

    @PostMapping("/admin/add")
    public void addProduct(@RequestBody ProductData productData) {
        mongoDB.save(productData);
    }
    @DeleteMapping("/admin/delete/{id}")
    public void deleteProduct(@PathVariable String id) {
        mongoDB.deleteById(id);
    }
    @GetMapping("/admin/display")
    public List<ProductData> displayProduct() {
        return mongoDB.findAll();
    }
}
