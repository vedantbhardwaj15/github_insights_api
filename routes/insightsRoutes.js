// src/routes/insightsRoutes.js
const express = require("express");
const rateLimiter = require("../middleware/rateLimiter"); // Redis-based limiter
const { getRepoInsights, getUserInsights } = require("../controllers/insightsController");

const router = express.Router();

// Apply rate limiting to both endpoints
router.get("/repo/:owner/:repo", rateLimiter, getRepoInsights);
router.get("/user/:username", rateLimiter, getUserInsights);

module.exports = router;
