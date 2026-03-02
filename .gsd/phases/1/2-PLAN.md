---
phase: 1
plan: 2
wave: 1
---

# Plan 1.2: Authentication Flow (Aditya University)

## Objective
Implement UI and logic for strict `.edu` (specifically `@adityauniversity.in`) login and registration using Supabase Auth OTP (magic-link/OTP).

## Context
- .gsd/SPEC.md
- .gsd/DECISIONS.md

## Tasks

<task type="auto">
  <name>Implement Auth UI Component</name>
  <files>frontend/src/components/Auth.jsx</files>
  <action>
    - Build a login/register form ensuring email input.
    - Validate client-side that the email ends in `@adityauniversity.in` before submitting to Supabase.
    - Display clear error messages if a non-university email is attempted.
  </action>
  <verify>Check the file for email regex validation matching `@adityauniversity.in`.</verify>
  <done>Component restricts submission to the correct domain.</done>
</task>

<task type="auto">
  <name>Implement Supabase Auth Logic</name>
  <files>frontend/src/lib/supabase.js, frontend/src/components/Auth.jsx</files>
  <action>
    - Initialize Supabase client.
    - Wire up `supabase.auth.signInWithOtp()` to send verification emails/magic links.
    - Ensure upon successful login, user session state is saved in the app context.
  </action>
  <verify>Check for `signInWithOtp` usage and session handling logic.</verify>
  <done>Auth logic correctly invokes Supabase OTP flow.</done>
</task>

## Success Criteria
- [ ] UI explicitly rejects emails not ending in `@adityauniversity.in`.
- [ ] Supabase OTP is successfully triggered on valid email submission.
