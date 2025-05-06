package com.example.ecommerce.controller;

import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if ("admin".equals(username) && "admin".equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("role", "admin");
            response.put("username", username);
            return ResponseEntity.ok(response);
        }

        return userRepository.findByUsername(username)
            .filter(user -> user.getPassword().equals(password))
            .map(user -> {
                Map<String, Object> response = new HashMap<>();
                response.put("role", "user");
                response.put("username", user.getUsername());
                response.put("email", user.getEmail());
                return ResponseEntity.ok(response);
            }).orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));

    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        user.setRole("user");
        User savedUser = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("role", savedUser.getRole());
        response.put("username", savedUser.getUsername());
        response.put("email", savedUser.getEmail());

        return ResponseEntity.ok(response);
    }
}