package com.scholarship.backend.repository;

import com.scholarship.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByScholarshipId(Long scholarshipId);
    boolean existsByStudentIdAndScholarshipId(Long studentId, Long scholarshipId);
}
