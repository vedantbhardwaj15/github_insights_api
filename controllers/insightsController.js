// src/controllers/insightsController.js
const { fetchRepoInsights, fetchUserInsights } = require("../services/insightsService");

/**
 * Controller: Get repository insights
 */
async function getRepoInsights(req, res) {
  try {
    const { owner, repo } = req.params;

    if (!owner || !repo) {
      return res.status(400).json({ error: "Owner and repo are required" });
    }

    const data = await fetchRepoInsights(owner, repo);
    res.json(data);
  } catch (err) {
    console.error("❌ getRepoInsights error:", err.message);
    res.status(500).json({ error: "Failed to fetch repository insights" });
  }
}

/**
 * Controller: Get user insights
 */
async function getUserInsights(req, res) {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const data = await fetchUserInsights(username);
    res.json(data);
  } catch (err) {
    console.error("❌ getUserInsights error:", err.message);
    res.status(500).json({ error: "Failed to fetch user insights" });
  }
}

module.exports = { getRepoInsights, getUserInsights };
