package com.rasegapriya.placementsystem.repository;

import com.rasegapriya.placementsystem.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findAllByOwner_IdOrderByApplicationDateDescIdDesc(Long ownerId);

    Optional<JobApplication> findByIdAndOwner_Id(Long id, Long ownerId);
}
