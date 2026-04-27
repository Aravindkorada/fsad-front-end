package com.scholarship.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "financial_aids")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialAid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private Double maxAmount;
    
    private String eligibility;
}
