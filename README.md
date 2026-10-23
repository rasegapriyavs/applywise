# Applywise — Job Application & Placement Tracker

Applywise is a full-stack web application that helps students organize their job applications, track application statuses, manage interview opportunities, and maintain their profiles in one place.

The project is designed to make placement preparation easier by providing a centralized dashboard for managing job-search activities.

## Features

- **User Authentication:** Register, log in, and log out securely.
- **Application Tracking:** Add, view, edit, and delete job applications.
- **Status Management:** Track application progress through different stages.
- **Dashboard:** View application statistics and monitor progress.
- **Interview Management:** Organize interview-related information.
- **Profile Management:** Update personal profile information and manage account settings.
- **User Data Isolation:** Ensure authenticated users can access only their own job applications.
- **Persistent Storage:** Store user and application data in MySQL.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Java 17, Spring Boot |
| Security | Spring Security, JWT, BCrypt |
| Database | MySQL 8 |
| Build Tools | Maven, npm |
| Version Control | Git, GitHub |

## Project Structure

```text
placement-system/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Authentication context
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Application pages
│   │   └── services/         # API services
│   ├── package.json
│   └── vite.config.js
├── src/
│   ├── main/
│   │   ├── java/             # Spring Boot application
│   │   └── resources/        # Configuration and migrations
│   └── test/                 # Backend tests
├── .mvn/                     # Maven wrapper configuration
├── mvnw
├── mvnw.cmd
└── pom.xml
```

## Prerequisites

Install the following before running the project:

- Java 17
- MySQL 8
- Node.js and npm
- Git

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/rasegapriyavs/applywise.git
cd applywise
```

### 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE placement_system;
```

Configure your local environment variables for the database username and password. The application expects `DB_PASSWORD`; set any other database settings required by your local MySQL installation.

### 3. Configure the backend

Set the following environment variables in the terminal used to run Spring Boot:

- `DB_PASSWORD` — your MySQL password
- `JWT_SECRET` — a randomly generated, Base64-encoded secret of at least 32 bytes before encoding

Optional settings include `JWT_EXPIRATION_MINUTES` and `AUTH_COOKIE_SECURE`. Review `src/main/resources/application.properties` for the expected defaults and configuration.

**Never commit actual passwords, JWT secrets, or private environment files.**

### 4. Start the backend

From the project root, run:

**Windows PowerShell**

```powershell
.\mvnw.cmd spring-boot:run
```

The backend is configured to run on:

`http://localhost:8081`

### 5. Start the frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

`http://localhost:5173`

Keep both applications running while using Applywise.

## Security

- Passwords are handled using BCrypt.
- JWT-based authentication protects application endpoints.
- Application records are scoped to their owners.
- Sensitive configuration should be supplied through environment variables.
- Local secrets and generated build files should not be committed to Git.

## Future Improvements

- Deployment to a cloud platform
- Automated testing and continuous integration
- Email reminders for upcoming interviews
- Enhanced analytics and placement reports
- Resume management and job recommendations

## Author

**Rasegapriya V S**

GitHub: [@rasegapriyavs](https://github.com/rasegapriyavs)

---

*Applywise — Organize your applications. Track your progress. Prepare for your next opportunity.*
