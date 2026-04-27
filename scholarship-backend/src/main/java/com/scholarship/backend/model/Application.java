package com.scholarship.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scholarship_id", nullable = false)
    private Scholarship scholarship;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(name = "gpa_at_time")
    private Double gpaAtTime;

    @Column(name = "essay_topic", columnDefinition = "TEXT")
    private String essayTopic;

    @Column(name = "documents_url", columnDefinition = "TEXT")
    private String documentsUrl;

    @Column(name = "agree_to_terms")
    private Boolean agreeToTerms = true;

    @Column(name = "applied_date")
    private LocalDate appliedDate = LocalDate.now();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
