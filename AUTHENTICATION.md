# Applywise authentication

## Local configuration

The API requires a Base64-encoded secret containing at least 32 random bytes.
Set it in the same PowerShell session used to start Spring Boot; do not put it
in source control or send it to the frontend:

```powershell
$env:JWT_SECRET = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
$env:JWT_EXPIRATION_MINUTES = "15"
$env:AUTH_COOKIE_SECURE = "false"
.\mvnw.cmd spring-boot:run
```

For a production HTTPS deployment, set `AUTH_COOKIE_SECURE=true`, configure a
strong persistent secret in the deployment secret manager, and allow only the
deployed frontend origin in `SecurityConfig`.

Start the frontend in a separate terminal:

```powershell
Set-Location .\frontend
npm.cmd run dev
```

The development frontend origin is `http://localhost:5173`.

## Authentication and CSRF flow

The API issues a short-lived HS256 JWT in the `APPLYWISE_AUTH` cookie. The
cookie is HttpOnly, SameSite=Lax, scoped to `/api`, and Secure when
`AUTH_COOKIE_SECURE=true`. The frontend never reads or persists the JWT; browser
requests use `credentials: "include"`. The JWT contains the user ID as `sub`
and expires after `JWT_EXPIRATION_MINUTES` (default 15).

Before a state-changing request, the frontend calls `GET /api/auth/csrf`. The
API returns `{"token":"…"}` and sets the matching `XSRF-TOKEN` cookie. The
frontend retains the CSRF value in memory and sends it in the
`X-XSRF-TOKEN` header on POST and PUT requests. The same check applies to
registration, login, password updates, and logout.

Logout clears the browser's HttpOnly JWT cookie and the React authentication
state. JWTs are stateless and are not placed on a server-side denylist; a
previously copied token remains usable until its short expiry. Use a short
expiry and protect client devices accordingly.

## Endpoints and formats

First obtain a CSRF token as described above.

### Register

`POST /api/auth/register` — `201 Created`; sets the authentication cookie.

```json
{
  "fullName": "Alex Example",
  "email": "alex@example.com",
  "password": "at-least-12-characters"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "fullName": "Alex Example",
    "email": "alex@example.com",
    "createdAt": "2026-10-23T12:00:00Z",
    "updatedAt": "2026-10-23T12:00:00Z"
  }
}
```

Passwords must be at least 12 characters and at most 72 UTF-8 bytes. Duplicate
emails return `409 Conflict`; passwords are BCrypt-hashed and never returned.

### Login

`POST /api/auth/login` — `200 OK`; accepts `{"email":"…","password":"…"}` and
sets the same HttpOnly authentication cookie. Invalid credentials return a
generic `401 Unauthorized`.

### Current user's profile

- `GET /api/users/me` — returns the current user's ID, full name, email, and
  timestamps; requires the authentication cookie.
- `PUT /api/users/me` — accepts `{"fullName":"…","email":"…"}`. Role and
  password-hash fields are not accepted.
- `PUT /api/users/me/password` — accepts
  `{"currentPassword":"…","newPassword":"…"}` and returns `204 No Content`.

Unauthenticated access returns `401`; invalid request bodies return `400`.

### Logout

`POST /api/auth/logout` — requires the authentication cookie and CSRF header;
returns `204 No Content` and expires the authentication cookie.

### Placement applications

`/api/applications` continues to use GET, POST, PUT, and DELETE, but now
requires authentication. The API derives the owner from the validated JWT and
does not accept a user ID from the client. Collection and by-ID queries are
restricted to that owner; another user's ID and an unassigned legacy row both
return `404`.

## Existing database rows and migration

Flyway migration
`src/main/resources/db/migration/V1__add_auth_and_application_ownership.sql`
creates `app_users` and adds nullable `owner_id` with an index and foreign key
to `job_applications`. It does not drop or rewrite existing application rows.
Rows present before migration remain unassigned and are excluded from all
authenticated application queries; no account is selected as their owner.

Flyway baselines the existing schema at version 0, applies the migration, and
Hibernate is configured to validate rather than automatically update the
schema. Decide separately how to handle any legacy rows before assigning them
to an account.
