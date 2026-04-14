# CampusTrade

**CampusTrade** is a PRD-driven peer-to-peer campus marketplace for **micro-rentals, barter deals, and trust-based student exchange**.

Instead of buying everything, students can borrow a calculator for a day, rent a tripod for a weekend, or trade one useful item for another, all inside a campus-verified network.

This repository contains a full-stack prototype with:

- `frontend/`: React + Vite client
- `backend/`: Node.js + Express API
- `Socket.io`: real-time barter negotiation
- `MongoDB`: persistence via Mongoose
- `Cloudinary`: image upload pipeline
- `Stripe`: fiat payment intent support

## Why This Exists

Campus life is full of short-lived needs:

- a textbook before tomorrow's quiz
- a lab coat for one session
- a camera tripod for a club event
- a calculator, extension cord, speaker, or cycle for just a few hours

CampusTrade turns those one-off needs into a trusted exchange system designed for a university community. The product direction comes from the included PRD/TRD, and the codebase implements the MVP foundation for that vision.

## Product Vision

CampusTrade is built around three ideas:

1. **Rent, don't rebuy.** Students should be able to access useful things without paying full retail prices.
2. **Barter when cash is not ideal.** Not every exchange needs money; some can be solved with swaps and negotiation.
3. **Trust must be visible.** Campus-restricted onboarding, reviews, booking states, and trust scores reduce marketplace friction.

## What The App Does Today

The current repo already supports the core MVP flow:

- Campus-restricted signup using `@adityauniversity.in`
- OTP verification flow before login
- JWT-based authentication
- Create, browse, search, and soft-delete item listings
- Upload listing images to Cloudinary
- Check item availability by booked date ranges
- Create bookings for rental or barter
- Update booking status across `Pending`, `Active`, `Completed`, and `Cancelled`
- Real-time barter rooms with Socket.io
- Accept or reject barter offers live
- Submit reviews after completed bookings
- Recalculate trust score from reviews, completions, and penalties
- Create Stripe payment intents for fiat bookings
- Use a dummy payment success route for local testing

## PRD-Led, Code-Backed

This project is especially useful as a **product-to-engineering handoff example**:

- [prd.pdf](./prd.pdf) captures the product direction
- [CampusTrade_full.txt](./CampusTrade_full.txt) and [CampusTrade_TRD.txt](./CampusTrade_TRD.txt) describe the intended system behavior
- the implementation in `frontend/` and `backend/` shows the working prototype

One important note: the technical documents describe a broader target architecture, while the current repo is a practical MVP implementation. For example, the documents mention PostgreSQL, but the code currently uses **MongoDB + Mongoose**.

## Architecture Snapshot

```text
Frontend (React + Vite)
        |
        |  HTTP / JSON
        v
Backend (Express API)
        |
        |-- MongoDB via Mongoose
        |-- Cloudinary for listing images
        |-- Stripe for payment intents
        |
        +-- Socket.io namespace: /barter
```

## Tech Stack

| Layer | Current implementation |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios |
| Styling | CSS + Tailwind tooling present |
| Backend | Node.js, Express, Helmet, CORS |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |
| Realtime | Socket.io |
| Uploads | Multer + Cloudinary |
| Payments | Stripe |

## Repository Structure

```text
CampusTrade/
|- frontend/      React client
|- backend/       Express API, models, controllers, routes, sockets
|- docs/          runbooks and supporting project docs
|- scripts/       validation helpers
|- prd.pdf        product requirements document
|- CampusTrade_full.txt
|- CampusTrade_TRD.txt
```

## Core User Flows

### 1. Onboarding

- User signs up with a campus email
- System generates an OTP
- User verifies email
- Verified user logs in and receives a JWT

### 2. Listing & Discovery

- User creates a listing with title, price, description, category, and images
- Other students browse available listings
- Listings can support fiat rental, barter, or both

### 3. Booking

- Borrower selects a date range
- Backend checks overlapping bookings
- Booking is created as `Pending`
- Booking can later move to `Active`, `Completed`, or `Cancelled`

### 4. Barter Negotiation

- Two parties join a real-time barter room
- Messages are persisted
- Owner can accept or reject the barter live

### 5. Reputation

- Reviews unlock after completed bookings
- Trust score is recalculated from completed activity and penalties

## API Surface

Base URL:

```text
http://localhost:5000/api/v1
```

Main route groups:

- `/auth`
- `/users`
- `/items`
- `/bookings`
- `/payments`
- `/reviews`

Health check:

```text
GET /api/v1/health
```

## Local Setup

### Prerequisites

- Node.js 18+ recommended
- MongoDB connection string
- Cloudinary account for uploads
- Stripe secret key for real payment intent creation

### 1. Install dependencies

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

### 2. Create backend environment variables

Create `backend/.env` with values like:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/campustrade
JWT_SECRET=replace_this_with_a_secure_secret
CLIENT_ORIGIN=http://localhost:5173
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
STRIPE_SECRET_KEY=sk_test_your_key
```

### 3. Start the backend

```powershell
cd backend
node server.js
```

### 4. Start the frontend

```powershell
cd frontend
npm run dev
```

### 5. Open the app

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

## Important Implementation Notes

- Registration is currently restricted to `@adityauniversity.in`
- OTP delivery is currently logged for development instead of being sent by email
- The frontend stores the JWT in `localStorage`
- Backend route versioning follows `/api/v1/*`
- There is a dummy payment endpoint to simulate successful fiat checkout during development

## Current Gaps

This repo is already a strong prototype, but a few things are still in MVP territory:

- no polished production deployment configuration yet
- backend test script is still a placeholder
- OTP email sending is not fully wired up
- some PRD/TRD aspirations are broader than the current shipped code
- frontend UX can be expanded beyond the existing core pages

## Roadmap From The PRD

Natural next steps for this project:

- stronger calendar and booking UX
- richer search, filters, and categories
- better lender and borrower dashboards
- refresh token flow and more robust auth lifecycle
- production-grade email verification
- webhook-driven Stripe confirmation
- admin moderation and abuse handling
- analytics, reliability, and test coverage

## Why This README Matters

This project is more than a CRUD app. It is a startup-shaped student product with:

- a clear campus problem
- an exchange model that mixes rentals and barter
- trust and verification as part of the product, not an afterthought
- a direct line from product requirement to engineering implementation

If you are evaluating this repo for a capstone, portfolio, internal handoff, or startup prototype, CampusTrade shows both the **idea** and the **execution path**.

## References

- [prd.pdf](./prd.pdf)
- [CampusTrade_full.txt](./CampusTrade_full.txt)
- [CampusTrade_TRD.txt](./CampusTrade_TRD.txt)
- [docs/runbook.md](./docs/runbook.md)
