---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Express Backend & MongoDB Initialization

## Objective
Set up the fundamental Node.js + Express backend, connect to MongoDB using Mongoose, and define the `User` and `Item` Mongoose schemas according to the TRD.

## Context
- .gsd/SPEC.md
- .gsd/DECISIONS.md (MongoDB chosen over Postgres)
- TRD Database Design (Section 3, adapted for NoSQL)

## Tasks

<task type="auto">
  <name>Initialize backend and connect MongoDB</name>
  <files>backend/package.json, backend/server.js, backend/config/db.js</files>
  <action>
    - Initialize an Express application in a `backend/` directory.
    - Install `express`, `mongoose`, `dotenv`, `cors`, `helmet`.
    - Create `backend/config/db.js` to establish a Mongoose connection using `process.env.MONGO_URI`.
    - Set up the basic Express server in `server.js` matching TRD security headers (Helmet, CORS).
  </action>
  <verify>Run `node backend/server.js` and verify it connects to a local/remote MongoDB instance (provided via .env).</verify>
  <done>Express server starts and successfully logs a MongoDB connection.</done>
</task>

<task type="auto">
  <name>Define Mongoose Schemas (User & Item)</name>
  <files>backend/models/User.js, backend/models/Item.js</files>
  <action>
    - Create `User.js`: `name` (String), `edu_email` (String, unique), `email_verified` (Boolean), `trust_score` (Number, default 50), `penalty_points` (Number, default 0). 
    - *Note: We will add `password_hash` in the Auth plan next.*
    - Create `Item.js`: `owner_id` (ObjectId ref User), `title`, `description`, `category`, `daily_price`, `accepts_barter`, `image_urls` ([String]), `is_available` (Boolean).
  </action>
  <verify>Review the schema files for correct Mongoose types and strict adherence to TRD fields.</verify>
  <done>Mongoose models for User and Item are fully defined and exported.</done>
</task>

## Success Criteria
- [ ] Backend server runs cleanly with MongoDB connected.
- [ ] User and Item Mongoose schemas are correctly defined.
