---
phase: 1
plan: 2
wave: 1
---

# Plan 1.2: Custom JWT & OTP Auth (Aditya University)

## Objective
Implement custom backend authentication using bcrypt, JWT, and Node Mailer for `.edu` (specifically `@adityauniversity.in`) OTP verification.

## Context
- .gsd/SPEC.md
- .gsd/DECISIONS.md (Custom Auth)
- TRD Section 4: Authentication & Authorization

## Tasks

<task type="auto">
  <name>Implement Registration & OTP Verification API</name>
  <files>backend/controllers/authController.js, backend/routes/authRoutes.js</files>
  <action>
    - Create `POST /auth/register`: Validate email ends in `@adityauniversity.in`. If valid, generate a 6-digit OTP, hash it, store with 15m expiry in a temporary auth record (or User model), and send via Nodemailer (console.log the OTP for local dev).
    - Create `POST /auth/verify`: Accepts email and OTP, validates against stored hash, sets `email_verified = TRUE`.
  </action>
  <verify>Use Postman/cURL to hit `/register` and verify the OTP generation, then hit `/verify` to authenticate a test user.</verify>
  <done>Registration strictly requires allowed domains and OTP validation sets user to verified.</done>
</task>

<task type="auto">
  <name>Implement JWT Login Flow</name>
  <files>backend/controllers/authController.js, backend/middleware/authMiddleware.js</files>
  <action>
    - Ensure `User` model has a `password_hash` field.
    - Create `POST /auth/login`: verifies password (bcrypt) and returns a signed JWT access token.
    - Implement `authMiddleware.js` to protect future routes by verifying the `Authorization: Bearer <token>` header.
  </action>
  <verify>Test the login endpoint and verify a valid JWT is returned and can be used on a dummy protected route.</verify>
  <done>JWT authentication and protection middleware are functional.</done>
</task>

## Success Criteria
- [ ] `adityauniversity.in` domain restriction is strictly enforced backend-side.
- [ ] OTP verification successfully activates a user.
- [ ] JWT access tokens are correctly issued and validated.
