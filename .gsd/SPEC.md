# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
A localized, peer-to-peer micro-rental marketplace restricted to the campus ecosystem, allowing university students to rent items for short timeframes or bypass currency entirely by trading skills/services via a structured barter system.

## Goals
1. Provide campus-restricted authentication (verified .edu emails).
2. Facilitate dual-mode lending (fiat rental pricing and structured service bartering).
3. Ensure temporal booking with robust overlap prevention.
4. Enable real-time barter negotiation via Socket.io chat rooms.

## Non-Goals (Out of Scope)
- Global/unrestricted users (non-university students).
- Complex shipping or delivery solutions (all peer-to-peer hyper-local).
- Non-MERN technology stack integrations (strict adherence to specified tech).

## Users
- The Resource Seeker (Borrower)
- The Campus Hustler (Lender)

## Constraints
- **Technical**: React.js UI, Node/Express/MongoDB backend (MERN stack).
- **Implementation**: Mongoose schemas requiring strict custom overlap exclusion logic for temporal bookings.
- **Operational**: Image uploads to Cloudinary (MVP), custom JWT generation and validation.

## Success Criteria
- [ ] Students can sign up and verify via .edu OTP.
- [ ] Users can list items for rent or barter.
- [ ] Borrowers can book available dates without race conditions.
- [ ] Real-time trading operates seamlessly over WebSockets.
- [ ] Trust scores update automatically and accurately post-transaction.
