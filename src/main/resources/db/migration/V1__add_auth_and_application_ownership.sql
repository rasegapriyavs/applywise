CREATE TABLE IF NOT EXISTS app_users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(60) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_app_users_email UNIQUE (email)
) ENGINE=InnoDB;

ALTER TABLE job_applications
    ADD COLUMN owner_id BIGINT NULL,
    ADD INDEX idx_job_applications_owner_id (owner_id),
    ADD CONSTRAINT fk_job_applications_owner
        FOREIGN KEY (owner_id) REFERENCES app_users (id);
