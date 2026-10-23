package com.rasegapriya.placementsystem.controller;

import com.rasegapriya.placementsystem.dto.JobApplicationRequest;
import com.rasegapriya.placementsystem.dto.JobApplicationResponse;
import com.rasegapriya.placementsystem.model.JobApplication;
import com.rasegapriya.placementsystem.repository.JobApplicationRepository;
import com.rasegapriya.placementsystem.repository.UserRepository;
import com.rasegapriya.placementsystem.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationRepository repository;
    private final UserRepository userRepository;

    public JobApplicationController(JobApplicationRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<JobApplicationResponse> getAllApplications(@AuthenticationPrincipal AuthenticatedUser user) {
        return repository.findAllByOwner_IdOrderByApplicationDateDescIdDesc(user.id())
                .stream()
                .map(JobApplicationResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public JobApplicationResponse getApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal AuthenticatedUser user) {
        return JobApplicationResponse.from(findApplication(id, user.id()));
    }

    @PostMapping
    public ResponseEntity<JobApplicationResponse> createApplication(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody JobApplicationRequest request) {
        JobApplication application = new JobApplication();
        request.applyTo(application);
        application.setOwner(userRepository.getReferenceById(user.id()));
        JobApplication created = repository.save(application);
        return ResponseEntity.created(URI.create("/api/applications/" + created.getId()))
                .body(JobApplicationResponse.from(created));
    }

    @PutMapping("/{id}")
    public JobApplicationResponse updateApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody JobApplicationRequest updatedApplication) {
        JobApplication application = findApplication(id, user.id());
        updatedApplication.applyTo(application);
        return JobApplicationResponse.from(repository.save(application));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal AuthenticatedUser user) {
        JobApplication application = findApplication(id, user.id());
        repository.delete(application);
        return ResponseEntity.noContent().build();
    }

    private JobApplication findApplication(Long id, Long ownerId) {
        return repository.findByIdAndOwner_Id(id, ownerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Job application not found"));
    }
}
