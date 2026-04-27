package com.scholarship.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

@Data
public class ApplicationRequest {
    @NotNull
    private Long scholarshipId;

    @NotBlank
    private String statementOfPurpose;
}
