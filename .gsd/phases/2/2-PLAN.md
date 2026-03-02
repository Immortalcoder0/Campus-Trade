---
phase: 2
plan: 2
wave: 2
---

# Plan 2.2: Booking API & Calendar Availability

## Objective
Expose Express REST endpoints to fetch an item's unavailable dates for frontend calendars, and to create/manage basic bookings.

## Context
- .gsd/SPEC.md
- TRD 5.2 (Booking Endpoints)
- Mongoose Models & Utils from Plan 2.1

## Tasks

<task type="auto">
  <name>Implement Availability Endpoint</name>
  <files>backend/controllers/itemController.js, backend/routes/itemRoutes.js</files>
  <action>
    - Add `GET /api/v1/items/:id/availability` endpoint.
    - Query all `Booking` documents for the given `item_id` with status `Pending` or `Active`.
    - Return an array of `{ start_date, end_date }` objects so the client calendar can grey them out.
  </action>
  <verify>Test the endpoint; it should return 200 with an array of booked date ranges for an item.</verify>
  <done>Availability endpoint successfully maps to the database.</done>
</task>

<task type="auto">
  <name>Implement Core Booking Flow API</name>
  <files>backend/controllers/bookingController.js, backend/routes/bookingRoutes.js</files>
  <action>
    - Create `POST /api/v1/bookings`: Accepts `item_id`, `start_date`, `end_date`, `payment_type` (default to 'Fiat'). 
    - Within POST: Call `checkAvailability(item_id, start_date, end_date)` from `bookingUtils.js`. If false, return 409 Conflict. Otherwise, calculate `total_amount` based on item's `daily_price` and create the Booking.
    - Create `GET /api/v1/bookings/me`: Return paginated bookings where user is borrower or item owner.
    - Create `PATCH /api/v1/bookings/:id/status`: Allow item owner to confirm/cancel a Pending booking, or mark an Active booking as 'Completed' (Deferred trust score update logic to Phase 4).
  </action>
  <verify>Test overlapping booking creation to ensure the 409 Conflict triggers correctly.</verify>
  <done>Booking CRUD operations handle date logic securely.</done>
</task>

## Success Criteria
- [ ] Front-end can query an item for an array of blocked dates.
- [ ] Creation of overlapping bookings is strictly blocked by the backend API yielding HTTP 409.
