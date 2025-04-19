package com.example.Ecommerce.Ecommerce.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "loginData")
public class LoginData {

    @Id
    private String id;
    private String username;
    private String password;
    private ArrayList<String> cart = new ArrayList<>();
}
