package com.scholarship.backend.service;

import com.scholarship.backend.exception.ResourceNotFoundException;
import com.scholarship.backend.model.Scholarship;
import com.scholarship.backend.repository.ScholarshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScholarshipService {

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    public Scholarship createScholarship(Scholarship scholarship) {
        return scholarshipRepository.save(scholarship);
    }

    public Scholarship updateScholarship(Long id, Scholarship scholarshipDetails) {
        Scholarship scholarship = getScholarshipById(id);
        scholarship.setTitle(scholarshipDetails.getTitle());
        scholarship.setDescription(scholarshipDetails.getDescription());
        scholarship.setAmount(scholarshipDetails.getAmount());
        scholarship.setEligibilityCriteria(scholarshipDetails.getEligibilityCriteria());
        scholarship.setDeadline(scholarshipDetails.getDeadline());
        scholarship.setIsActive(scholarshipDetails.getIsActive());
        return scholarshipRepository.save(scholarship);
    }

    public void deleteScholarship(Long id) {
        Scholarship scholarship = getScholarshipById(id);
        scholarshipRepository.delete(scholarship);
    }

    public List<Scholarship> getAllScholarships() {
        return scholarshipRepository.findAll();
    }

    public List<Scholarship> getActiveScholarships() {
        return scholarshipRepository.findByIsActiveTrue();
    }

    public Scholarship getScholarshipById(Long id) {
        return scholarshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found with id " + id));
    }

    public List<Scholarship> searchScholarships(String keyword) {
        return scholarshipRepository.searchScholarships(keyword);
    }
}
