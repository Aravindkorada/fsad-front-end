package com.scholarship.backend.service;

import com.scholarship.backend.exception.ResourceNotFoundException;
import com.scholarship.backend.model.FinancialAid;
import com.scholarship.backend.repository.FinancialAidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FinancialAidService {

    @Autowired
    private FinancialAidRepository financialAidRepository;

    public FinancialAid createFinancialAid(FinancialAid financialAid) {
        return financialAidRepository.save(financialAid);
    }

    public FinancialAid updateFinancialAid(Long id, FinancialAid aidDetails) {
        FinancialAid aid = getFinancialAidById(id);
        aid.setTitle(aidDetails.getTitle());
        aid.setDescription(aidDetails.getDescription());
        aid.setMaxAmount(aidDetails.getMaxAmount());
        aid.setEligibility(aidDetails.getEligibility());
        return financialAidRepository.save(aid);
    }

    public void deleteFinancialAid(Long id) {
        FinancialAid aid = getFinancialAidById(id);
        financialAidRepository.delete(aid);
    }

    public List<FinancialAid> getAllFinancialAids() {
        return financialAidRepository.findAll();
    }

    public FinancialAid getFinancialAidById(Long id) {
        return financialAidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Financial Aid not found with id " + id));
    }
}
