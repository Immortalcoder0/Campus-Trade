# DECISIONS.md

> **Purpose**: Architecture Decision Record (ADR) log.

## Global Decisions
**Date:** March 2026
- **Payment Strategy**: Integrate real payment gateway (Stripe) but provide a dummy button for simulation/testing.
- **WebSocket Architecture**: Stick to a single Node.js process for the MVP (no horizontal scaling/Redis adapter required yet).
- **Frontend Design**: Use Stitch MCP for UI generation as no pre-existing wireframes/Figma exist.

## Phase 1 Decisions
**Date:** March 2026
- **Scope**: Email restriction narrowed to `@adityauniversity.in` for MVP. File uploads deferred to Phase 4 (placeholder URLs used).
- **Approach**: Utilize Supabase Auth and Database instead of custom JWT/Postgres setup. This saves boilerplate and relies on robust infrastructure.
- **Constraints**: Supabase project details (URL/anon key) will be required in the environment variables.
