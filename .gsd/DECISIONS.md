# DECISIONS.md

> **Purpose**: Architecture Decision Record (ADR) log.

## Global Decisions
**Date:** March 2026
- **Payment Strategy**: Integrate real payment gateway (Stripe) but provide a dummy button for simulation/testing.
- **WebSocket Architecture**: Stick to a single Node.js process for the MVP (no horizontal scaling/Redis adapter required yet).
- **Frontend Design**: Use Stitch MCP for UI generation as no pre-existing wireframes/Figma exist.
- **Database Architecture**: Use MongoDB (NoSQL) instead of Postgres/Supabase per user request. This necessitates custom Auth and API construction.

## Phase 1 Decisions
**Date:** March 2026
- **Scope**: Email restriction narrowed to `@adityauniversity.in` for MVP. File uploads deferred to Phase 4 (placeholder URLs used).
- **Approach**: MERN stack with custom JWT/OTP auth using Node Mailer and Mongoose models for MongoDB.
- **Constraints**: Requires a MongoDB connection string (local or Atlas) and an SMTP provider for OTP delivery.
