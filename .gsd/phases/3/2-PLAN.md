---
phase: 3
plan: 2
wave: 2
---

# Plan 3.2: Real-time Barter Negotiation Events

## Objective
Implement the core WebSocket event handlers for joining rooms, sending messages, and accepting/rejecting trades within the `/barter` namespace.

## Context
- .gsd/SPEC.md
- TRD Section 7.2 (Events Reference)
- `backend/sockets/barterNamespace.js` from Plan 3.1
- `backend/models/Booking.js`

## Tasks

<task type="auto">
  <name>Implement Join and Message Handlers</name>
  <files>backend/sockets/barterNamespace.js, backend/models/BarterMessage.js</files>
  <action>
    - On `connection`, register a `join_room` listener. Verify the user (from token) is either the borrower or lender of the `booking_id`. If valid, `socket.join(booking_id)`.
    - Fetch and emit the last 50 messages to the socket via `room_joined` event.
    - Register a `send_message` listener. Save the message to MongoDB using `BarterMessage.create()`.
    - Broadcast the saved message to the room via `barterIo.to(booking_id).emit('new_message', msg)`.
  </action>
  <verify>Code inspection to ensure messages are saved to DB *before* broadcast to guarantee persistence.</verify>
  <done>Room joining is restricted to involved parties and messages broadcast successfully with DB persistence.</done>
</task>

<task type="auto">
  <name>Implement Trade Status Modifiers</name>
  <files>backend/sockets/barterNamespace.js, backend/models/Booking.js</files>
  <action>
    - Register `accept_trade` listener (Lender only). Verify socket matches item owner. Update `Booking` status to 'Active', `payment_type` to 'Barter'. Broadcast `trade_accepted` + insert an `is_system=true` message.
    - Register `reject_trade` listener (Either party). Update Booking to 'Cancelled'. Broadcast `trade_rejected` + insert system message.
  </action>
  <verify>Review the access control logic ensuring only the lender can trigger `accept_trade`.</verify>
  <done>Real-time booking status mutations correctly sync with MongoDB.</done>
</task>

## Success Criteria
- [ ] Clients can join discrete rooms tied to specific bookings.
- [ ] Messages persist to the database and broadcast instantly.
- [ ] Trade accept/reject events update the Booking state machine correctly.
