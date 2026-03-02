---
phase: 1
plan: 3
wave: 2
---

# Plan 1.3: Basic CRUD Models (Users and Items)

## Objective
Implement frontend API calls and state management to read/write User profiles and Item listings directly against Supabase.

## Context
- .gsd/SPEC.md
- TRD Core Business Logic (basic item CRUD requirements before calendar logic).

## Tasks

<task type="auto">
  <name>Implement User Profile Fetch/Update</name>
  <files>frontend/src/lib/api/users.js</files>
  <action>
    - Create functions to fetch current user profile (`supabase.from('users').select()`).
    - Create function to update user name/avatar.
    - Ensure RLS (Row Level Security) is assumed (user functions only fetch/update where `id = auth.uid()`).
  </action>
  <verify>Check for proper Supabase query syntax and error handling.</verify>
  <done>User profile can be retrieved and updated via the functions.</done>
</task>

<task type="auto">
  <name>Implement Item Listing CRUD</name>
  <files>frontend/src/lib/api/items.js</files>
  <action>
    - Create `createItem`, `fetchItems`, `fetchItemById`, `updateItem`, and `deleteItem` functions utilizing Supabase `from('items')`.
    - `fetchItems` should support basic querying (all available items).
    - Hardcode empty image arrays for now (Deferred S3/Cloudinary upload to Phase 4).
  </action>
  <verify>Check that CRUD operations correctly interface with the `items` table.</verify>
  <done>Basic item listings can be created and retrieved from the database.</done>
</task>

## Success Criteria
- [ ] Profile reading/writing functionality is complete.
- [ ] Item creation and reading functionality is complete without breaking.
