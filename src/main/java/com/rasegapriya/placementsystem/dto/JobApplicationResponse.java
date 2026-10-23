package com.rasegapriya.placementsystem.dto;

import com.rasegapriya.placementsystem.model.JobApplication;

import java.time.LocalDate;

public record JobApplicationResponse(
        Long id,
        String companyName,
        String jobRole,
        LocalDate applicationDate,
        JobApplication.Status status,
        String notes) {

    public static JobApplicationResponse from(JobApplication application) {
        return new JobApplicationResponse(
                application.getId(),
                application.getCompanyName(),
                application.getJobRole(),
                application.getApplicationDate(),
                application.getStatus(),
                application.getNotes());
    }
}
