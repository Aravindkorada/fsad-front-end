package com.scholarship.backend.repository;

import com.scholarship.backend.model.FinancialAid;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinancialAidRepository extends JpaRepository<FinancialAid, Long> {
}
