package com.scholarship.backend.repository;

import com.scholarship.backend.model.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {
    List<Scholarship> findByIsActiveTrue();
    
    @Query("SELECT s FROM Scholarship s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.eligibilityCriteria) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Scholarship> searchScholarships(@Param("keyword") String keyword);
}
