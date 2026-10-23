package com.rasegapriya.placementsystem.dto;

import com.rasegapriya.placementsystem.model.JobApplication;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record JobApplicationRequest(
        @NotBlank @Size(max = 255) String companyName,
        @NotBlank @Size(max = 255) String jobRole,
        LocalDate applicationDate,
        @NotNull JobApplication.Status status,
        String notes) {

    public void applyTo(JobApplication application) {
        application.setCompanyName(companyName);
        application.setJobRole(jobRole);
        application.setApplicationDate(applicationDate);
        application.setStatus(status);
        application.setNotes(notes);
    }
}
