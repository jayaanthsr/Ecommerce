package com.example.Ecommerce.Ecommerce.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "productData")
public class ProductData {
    @Id
    String id;

    String ProductName;
    double ProductPrice;
    String ProductDescription;
}
