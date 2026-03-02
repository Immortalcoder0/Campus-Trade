---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Booking Mongoose Model & Overlap Utility

## Objective
Define the `Booking` schema in MongoDB ensuring proper references to Users and Items, and create a utility function to validate date overlaps natively in Mongoose before any booking is created.

## Context
- .gsd/SPEC.md
- TRD Database Design (Section 3.2.3: Bookings, adapted for Mongoose)
- TRD Core Business Logic (Section 6.1: Temporal Booking)

## Tasks

<task type="auto">
  <name>Create Booking Mongoose Model</name>
  <files>backend/models/Booking.js</files>
  <action>
    - Ensure fields: `item_id` (ObjectId), `borrower_id` (ObjectId), `start_date` (Date), `end_date` (Date), `status` (Enum: 'Pending', 'Active', 'Completed', 'Cancelled'), `payment_type` (Enum: 'Fiat', 'Barter'), `total_amount` (Number), `barter_terms` (String), `payment_intent_id` (String - for stripe).
    - Default status to 'Pending'.
  </action>
  <verify>Check Mongoose schema for all required fields and correct enums.</verify>
  <done>Booking.js exports a valid Mongoose model covering all TRD parameters.</done>
</task>

<task type="auto">
  <name>Implement Overlap Prevention Utility</name>
  <files>backend/utils/bookingUtils.js</files>
  <action>
    - Write an async function `checkAvailability(item_id, start_date, end_date)` that queries the `Booking` collection.
    - Logic: Find any booking for `item_id` where `status` is in `['Pending', 'Active']` AND the date ranges overlap. Mongoose query: `start_date <= requested_end` AND `end_date >= requested_start`.
    - Return a boolean indicating availability.
  </action>
  <verify>Review the Mongoose logic for date condition accuracy (must safely catch all overlapping permutations).</verify>
  <done>Utility function accurately constructs the overlap query.</done>
</task>

## Success Criteria
- [ ] Booking model exists with all properties identified in the spec.
- [ ] Mongoose query utility safely prevents temporal clashes.
