package com.scholarship.backend.service;

import com.scholarship.backend.dto.ApplicationRequest;
import com.scholarship.backend.exception.ResourceNotFoundException;
import com.scholarship.backend.model.Application;
import com.scholarship.backend.model.ApplicationStatus;
import com.scholarship.backend.model.Scholarship;
import com.scholarship.backend.model.User;
import com.scholarship.backend.repository.ApplicationRepository;
import com.scholarship.backend.repository.ScholarshipRepository;
import com.scholarship.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    public Application applyForScholarship(String email, ApplicationRequest request) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Scholarship scholarship = scholarshipRepository.findById(request.getScholarshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found"));

        if(applicationRepository.existsByStudentIdAndScholarshipId(student.getId(), scholarship.getId())) {
            throw new RuntimeException("You have already applied for this scholarship");
        }

        Application application = new Application();
        application.setStudent(student);
        application.setScholarship(scholarship);
        application.setGpaAtTime(request.getGpa());
        application.setEssayTopic(request.getEssayTopic());
        application.setDocumentsUrl(request.getDocumentsUrl());
        application.setAgreeToTerms(request.getAgreeToTerms());
        application.setStatus(ApplicationStatus.PENDING);

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByStudent(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return applicationRepository.findByStudentId(student.getId());
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application updateApplicationStatus(Long applicationId, ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        application.setStatus(status);
        return applicationRepository.save(application);
    }
}
