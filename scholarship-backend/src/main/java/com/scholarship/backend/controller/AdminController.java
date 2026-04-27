package com.scholarship.backend.controller;

import com.scholarship.backend.model.Application;
import com.scholarship.backend.model.ApplicationStatus;
import com.scholarship.backend.model.FinancialAid;
import com.scholarship.backend.model.Scholarship;
import com.scholarship.backend.service.ApplicationService;
import com.scholarship.backend.service.FinancialAidService;
import com.scholarship.backend.service.ScholarshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ScholarshipService scholarshipService;

    @Autowired
    private FinancialAidService financialAidService;

    @Autowired
    private ApplicationService applicationService;

    // --- Scholarship Endpoints ---
    @PostMapping("/scholarships")
    public ResponseEntity<Scholarship> createScholarship(@RequestBody Scholarship scholarship) {
        return ResponseEntity.ok(scholarshipService.createScholarship(scholarship));
    }

    @PutMapping("/scholarships/{id}")
    public ResponseEntity<Scholarship> updateScholarship(@PathVariable Long id, @RequestBody Scholarship scholarship) {
        return ResponseEntity.ok(scholarshipService.updateScholarship(id, scholarship));
    }

    @DeleteMapping("/scholarships/{id}")
    public ResponseEntity<?> deleteScholarship(@PathVariable Long id) {
        scholarshipService.deleteScholarship(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/scholarships")
    public ResponseEntity<List<Scholarship>> getAllScholarships() {
        return ResponseEntity.ok(scholarshipService.getAllScholarships());
    }

    // --- Financial Aid Endpoints ---
    @PostMapping("/financial-aid")
    public ResponseEntity<FinancialAid> createFinancialAid(@RequestBody FinancialAid financialAid) {
        return ResponseEntity.ok(financialAidService.createFinancialAid(financialAid));
    }

    @PutMapping("/financial-aid/{id}")
    public ResponseEntity<FinancialAid> updateFinancialAid(@PathVariable Long id, @RequestBody FinancialAid financialAid) {
        return ResponseEntity.ok(financialAidService.updateFinancialAid(id, financialAid));
    }

    @DeleteMapping("/financial-aid/{id}")
    public ResponseEntity<?> deleteFinancialAid(@PathVariable Long id) {
        financialAidService.deleteFinancialAid(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/financial-aid")
    public ResponseEntity<List<FinancialAid>> getAllFinancialAids() {
        return ResponseEntity.ok(financialAidService.getAllFinancialAids());
    }

    // --- Application Endpoints ---
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> body) {
        ApplicationStatus status = ApplicationStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }
}
