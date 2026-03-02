---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Supabase Initialization & Database Schema

## Objective
Set up the fundamental database tables in Supabase according to the TRD, adjusted for Supabase Auth. We will create the `users` and `items` tables first.

## Context
- .gsd/SPEC.md
- .gsd/DECISIONS.md (Supabase chosen over custom Postgres)
- TRD Database Design (Section 3)

## Tasks

<task type="auto">
  <name>Initialize frontend and install supabase-js</name>
  <files>frontend/package.json</files>
  <action>
    - Ensure a basic Vite/React or Next.js frontend is initialized in a `frontend/` directory.
    - Install `@supabase/supabase-js`.
    - Create a `.env.local` file placeholder for Supabase URL and Anon Key.
  </action>
  <verify>Check that `package.json` contains `@supabase/supabase-js` and `.env.local` exists.</verify>
  <done>Frontend skeleton exists with Supabase client installed.</done>
</task>

<task type="auto">
  <name>Create Supabase DB Migration: Users and Items</name>
  <files>supabase/migrations/00001_foundation.sql</files>
  <action>
    - Create a SQL migration file to define the `users` and `items` tables.
    - For `users`: do not map passwords or emails directly, as Supabase Auth handles that in `auth.users`. Link the `user_id` to `auth.users(id)`.
    - Include columns: `name`, `trust_score` (default 50), `penalty_points` (default 0).
    - For `items`: include `title`, `description`, `category`, `daily_price`, `accepts_barter`, `image_urls` (text array), `is_available`.
  </action>
  <verify>Review the SQL file for correct Supabase Auth linking and Postgres data types.</verify>
  <done>Migration file includes valid schema for users and items.</done>
</task>

## Success Criteria
- [ ] Frontend directory is initialized with Supabase SDK.
- [ ] SQL migration file accurately reflects the TRD requirements modified for Supabase Auth.
