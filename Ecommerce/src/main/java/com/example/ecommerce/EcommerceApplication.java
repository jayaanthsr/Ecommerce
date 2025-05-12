package com.example.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@EnableMongoAuditing
public class EcommerceApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(EcommerceApplication.class);

        // Render assigns a port via the PORT environment variable
        Map<String, Object> props = new HashMap<>();
        String port = System.getenv("PORT");
        props.put("server.port", port != null ? port : "8080"); // Default to 8080 for local testing

        app.setDefaultProperties(props);
        app.run(args);
    }
}
