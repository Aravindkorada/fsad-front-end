package com.scholarship.backend.controller;

import com.scholarship.backend.dto.ApplicationRequest;
import com.scholarship.backend.model.Application;
import com.scholarship.backend.model.FinancialAid;
import com.scholarship.backend.model.Scholarship;
import com.scholarship.backend.service.ApplicationService;
import com.scholarship.backend.service.FinancialAidService;
import com.scholarship.backend.service.ScholarshipService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private ScholarshipService scholarshipService;

    @Autowired
    private FinancialAidService financialAidService;

    @Autowired
    private ApplicationService applicationService;

    // --- Scholarship Endpoints ---
    @GetMapping("/scholarships")
    public ResponseEntity<List<Scholarship>> getActiveScholarships() {
        return ResponseEntity.ok(scholarshipService.getActiveScholarships());
    }

    @GetMapping("/scholarships/search")
    public ResponseEntity<List<Scholarship>> searchScholarships(@RequestParam String keyword) {
        return ResponseEntity.ok(scholarshipService.searchScholarships(keyword));
    }

    @GetMapping("/scholarships/{id}")
    public ResponseEntity<Scholarship> getScholarshipById(@PathVariable Long id) {
        return ResponseEntity.ok(scholarshipService.getScholarshipById(id));
    }

    // --- Financial Aid Endpoints ---
    @GetMapping("/financial-aid")
    public ResponseEntity<List<FinancialAid>> getAvailableFinancialAids() {
        return ResponseEntity.ok(financialAidService.getAllFinancialAids());
    }

    @GetMapping("/financial-aid/{id}")
    public ResponseEntity<FinancialAid> getFinancialAidById(@PathVariable Long id) {
        return ResponseEntity.ok(financialAidService.getFinancialAidById(id));
    }

    // --- Application Endpoints ---
    @PostMapping("/applications")
    public ResponseEntity<Application> applyForScholarship(
            @Valid @RequestBody ApplicationRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(applicationService.applyForScholarship(email, request));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getMyApplications(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(applicationService.getApplicationsByStudent(email));
    }
}
