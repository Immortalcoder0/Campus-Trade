---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Review Mongoose Model & Trust Score Utility

## Objective
Implement the Review schema to capture post-transaction ratings, and build the Trust Score recalculation algorithm to enforce the platform's reliability metric.

## Context
- .gsd/SPEC.md
- TRD Section 3.2.4 (reviews)
- TRD Section 6.3 (Trust Score Algorithm)
- `backend/models/User.js`

## Tasks

<task type="auto">
  <name>Create Review Mongoose Model</name>
  <files>backend/models/Review.js</files>
  <action>
    - Create a Mongoose schema matching TRD: `booking_id` (ObjectId, unique), `reviewer_id` (ObjectId), `reviewee_id` (ObjectId), `rating` (Number, min 1, max 5), `comment` (String).
    - Add timestamps.
  </action>
  <verify>Check `Review.js` schema definitions and validation bounds.</verify>
  <done>Model successfully exported.</done>
</task>

<task type="auto">
  <name>Implement Trust Score Algorithm Utility</name>
  <files>backend/utils/trustScore.js, backend/models/Review.js, backend/models/Booking.js, backend/models/User.js</files>
  <action>
    - Export a function `calculateTrustScore(userId)`.
    - Fetch all Reviews where `reviewee_id = userId`. Calculate `R_completed` (reviews with rating >= 4) and `R_total`.
    - Fetch all Bookings where `item_id.owner_id = userId`. Calculate `L_completed` (status = 'Completed') and `L_total`.
    - Apply TRD formula: `T_score = (40 * R_completed/R_total) + (60 * L_completed/L_total) - P_penalties`.
    - Clamp score between 0 and 100. (Base score for new users with <= 3 transactions is 50).
    - Update `User.trust_score`.
  </action>
  <verify>Review the math logic in `trustScore.js` ensuring fallback ratios don't output NaN.</verify>
  <done>Utility function accurately reflects the TRD weighted algorithm.</done>
</task>

## Success Criteria
- [ ] Users can be rated 1-5 stars.
- [ ] The Trust Score formula is encapsulated in an isolated, pure-ish function ready to be called post-booking.
