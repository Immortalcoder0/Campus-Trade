---
phase: 2
plan: 3
wave: 3
---

# Plan 2.3: Payment Gateway (Stripe & Dummy Simulation)

## Objective
Implement Stripe Payment Intents for fiat checkouts, alongside a purely simulated dummy backend route for rapid testing without credit cards, fulfilling the global decisions log.

## Context
- .gsd/DECISIONS.md (Stripe + Dummy Button)
- .gsd/SPEC.md
- `backend/controllers/bookingController.js` from Plan 2.2

## Tasks

<task type="auto">
  <name>Integrate Stripe SDK</name>
  <files>backend/package.json, backend/controllers/paymentController.js, backend/routes/paymentRoutes.js</files>
  <action>
    - Install `stripe` package via npm.
    - Create `POST /api/v1/payments/create-intent`: Accepts a `booking_id`. Fetches the `booking.total_amount`. Uses Stripe SDK to generate a PaymentIntent object. Returns `client_secret` to the frontend.
    - Protect this route with JWT auth middleware.
  </action>
  <verify>Check package.json for stripe and review the controller for correct Intent creation syntax.</verify>
  <done>Stripe payment intents can be generated for valid fiat bookings.</done>
</task>

<task type="auto">
  <name>Create Dummy Simulation Endpoint</name>
  <files>backend/controllers/paymentController.js, backend/routes/paymentRoutes.js</files>
  <action>
    - Create `POST /api/v1/payments/dummy-success`: Accepts a `booking_id`.
    - Directly updates the corresponding Booking's state to reflect a successful fiat transfer (e.g., setting an internal `is_paid` boolean or adding a dummy `payment_intent_id`).
    - Note: This is explicitly for the 'dummy button' specified in the project decisions.
  </action>
  <verify>Hit the dummy-success endpoint and verify the booking DB record is modified properly.</verify>
  <done>Simulated checkout route bypasses Stripe entirely for dev testing.</done>
</task>

<task type="auto">
  <name>Mount payment routes to Express</name>
  <files>backend/server.js</files>
  <action>
    - Mount `/api/v1/payments` via the new `paymentRoutes.js`.
  </action>
  <verify>Review `server.js` structure.</verify>
  <done>Routes are accessible via the main server instance.</done>
</task>

## Success Criteria
- [ ] Standard Stripe `client_secret` endpoints are available.
- [ ] A dedicated bypass endpoint exists to fake standard fiat conversions for testing.
