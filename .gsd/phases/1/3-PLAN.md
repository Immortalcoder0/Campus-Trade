---
phase: 1
plan: 3
wave: 2
---

# Plan 1.3: User Profile & Item CRUD APIs

## Objective
Implement Express REST API endpoints to read/update User profiles and manage Item listings, completing Phase 1 foundation.

## Context
- .gsd/SPEC.md
- TRD Section 5.2: Endpoint Reference
- Mongoose Models from Plan 1.1 + Auth JWT from Plan 1.2

## Tasks

<task type="auto">
  <name>User Profile API Endpoints</name>
  <files>backend/controllers/userController.js, backend/routes/userRoutes.js</files>
  <action>
    - Create `GET /api/v1/users/me`: Return the authenticated user's profile (trust_score, name) using `req.user` from the JWT middleware.
    - Create `PUT /api/v1/users/me`: Update name, avatar.
    - Ensure all user routes use the `authMiddleware` to enforce Bearer token verification.
  </action>
  <verify>Test the endpoint using a valid Bearer Token for a verified user and check if the profile returns accurately.</verify>
  <done>User endpoints correctly handle read and update operations securely.</done>
</task>

<task type="auto">
  <name>Basic Item CRUD Endpoints</name>
  <files>backend/controllers/itemController.js, backend/routes/itemRoutes.js</files>
  <action>
    - Create `POST /api/v1/items`: Create an item linked to `req.user.id` (Auth required).
    - Create `GET /api/v1/items`: List all items where `is_available = TRUE`. Support basic query params like `?category=`. (Auth optional).
    - Create `GET /api/v1/items/:id`: Return single item details.
    - Create `PUT /api/v1/items/:id`: Update item details (Ensure `req.user.id` matches `item.owner_id`).
    - Create `DELETE /api/v1/items/:id`: Soft-delete the item (set `is_available = FALSE`).
  </action>
  <verify>Test creating an item using a Bearer token, then try to update it using a different user's token (should fail ownership check 403).</verify>
  <done>Full item CRUD cycle operates smoothly with strict owner-authorization where required.</done>
</task>

## Success Criteria
- [ ] User profiles can be securely retrieved and updated.
- [ ] Items can be created, edited, and soft-deleted by their respective owners.
