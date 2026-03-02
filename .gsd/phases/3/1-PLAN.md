---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Barter Messages Mongoose Model & Socket.io Init

## Objective
Define the MongoDB schema for persistent barter chat messages and initialize the Socket.io server integrated with the existing Express instance for the `/barter` namespace.

## Context
- .gsd/SPEC.md
- TRD Section 3.2.5 (barter_messages)
- TRD Section 7.1 (Socket.io Configuration)
- `backend/server.js`

## Tasks

<task type="auto">
  <name>Create BarterMessage Mongoose Model</name>
  <files>backend/models/BarterMessage.js</files>
  <action>
    - Create a schema with: `booking_id` (ObjectId, ref Booking), `sender_id` (ObjectId, ref User), `content` (String), `is_system` (Boolean, default false).
    - Add timestamps.
  </action>
  <verify>Review the model for correct ObjectId references linking messages directly to Bookings.</verify>
  <done>Model successfully exported matching TRD requirements.</done>
</task>

<task type="auto">
  <name>Initialize Socket.io Server</name>
  <files>backend/package.json, backend/server.js, backend/sockets/barterNamespace.js</files>
  <action>
    - Install `socket.io`.
    - In `server.js`, wrap the Express `app` in an HTTP server (`http.createServer(app)`) to attach Socket.io.
    - Create `backend/sockets/barterNamespace.js` exporting a function that takes the `io` instance.
    - Attach the `/barter` namespace: `const barterIo = io.of('/barter');`.
    - Add basic JWT auth middleware to the namespace (`barterIo.use(...)`) decoding the token from `socket.handshake.auth.token` before allowing connection.
  </action>
  <verify>Check package.json for `socket.io` and ensure `server.js` starts cleanly with the HTTP server wrapper.</verify>
  <done>Socket.io is listening on the same port as Express and the `/barter` namespace requires valid JWTs.</done>
</task>

## Success Criteria
- [ ] Database schema established for chat persistence.
- [ ] `socket.io` server attached to Express ensuring one Node.js process.
- [ ] WebSocket connections enforce JWT authentication.
