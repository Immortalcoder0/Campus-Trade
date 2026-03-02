---
phase: 4
plan: 2
wave: 2
---

# Plan 4.2: Review APIs & File Uploading

## Objective
Expose the Review endpoints and integrate a robust image uploading solution using `multer` and Cloudinary for Item listings.

## Context
- .gsd/SPEC.md
- TRD Section 5.2 (Review Endpoints)
- TRD Section 8 (File Upload Specification)
- `backend/package.json`
- `backend/server.js`

## Tasks

<task type="auto">
  <name>Create Review Controller and Routes</name>
  <files>backend/controllers/reviewController.js, backend/routes/reviewRoutes.js, backend/server.js</files>
  <action>
    - Implement `POST /api/v1/reviews`. Verify the `req.user` is a party to the booking, the booking is `Completed`, and no review exists yet. Save the review, then call `calculateTrustScore`.
    - Implement `GET /api/v1/reviews/user/:id` to fetch a user's public reviews.
    - Mount `/api/v1/reviews` in `server.js`.
  </action>
  <verify>Ensure `server.js` mounts the new routes and `calculateTrustScore` is triggered after an insert.</verify>
  <done>Review endpoints are active and recalculate scores.</done>
</task>

<task type="auto">
  <name>Implement Image Uploading for Items</name>
  <files>backend/package.json, backend/utils/upload.js, backend/controllers/itemController.js, backend/routes/itemRoutes.js</files>
  <action>
    - Install `multer`, `cloudinary`, and `multer-storage-cloudinary`.
    - Build `backend/utils/upload.js` configuring Cloudinary using `CLOUDINARY_URL` and initialize the generic multer middleware.
    - Update `POST /api/v1/items` to accept `multipart/form-data`. Map `req.files.map(f => f.path)` to the Item `image_urls` array.
  </action>
  <verify>Check package.json for multer/cloudinary. Review `itemRoutes.js` to confirm the multer middleware precedes the controller.</verify>
  <done>Platform securely receives images and persists URL pointers in MongoDB.</done>
</task>

## Success Criteria
- [ ] Trust scores update automatically when a Review is posted.
- [ ] Users can submit images via `multipart/form-data` which are routed directly to Cloudinary.
