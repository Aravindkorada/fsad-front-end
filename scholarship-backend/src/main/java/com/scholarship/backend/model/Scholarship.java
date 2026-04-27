package com.scholarship.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "scholarships")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Scholarship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String provider;

    private String category;

    @Column(nullable = false)
    private Double amount;

    @Column(length = 2000)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String fullDescription;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String eligibility;

    private LocalDate deadline;
    
    @Column(name = "status")
    private String status = "ACTIVE";
    
    @Column(name = "created_by")
    private Long createdBy;
}
