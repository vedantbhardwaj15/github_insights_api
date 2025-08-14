const githubAPI = require("../config/github");
const { getRedisClient } = require("../config/redis");
const CACHE_TTL = process.env.CACHE_TTL || 3600;

// Repo insights
async function fetchRepoInsights(owner, repo) {
  const cacheKey = `repo:${owner}/${repo}`;
  const redis = getRedisClient();

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      return JSON.parse(cached);
    }

    console.log(`⚡ Fetching repo data from GitHub API for ${owner}/${repo}`);
    const [repoData, contributorsData] = await Promise.all([
      githubAPI.get(`/repos/${owner}/${repo}`),
      githubAPI.get(`/repos/${owner}/${repo}/contributors`)
    ]);

    const result = {
      name: repoData.data.name,
      stars: repoData.data.stargazers_count,
      forks: repoData.data.forks_count,
      open_issues: repoData.data.open_issues_count,
      watchers: repoData.data.watchers_count,
      contributors: contributorsData.data.map(c => ({
        login: c.login,
        contributions: c.contributions
      }))
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);
    return result;
  } catch (err) {
    console.error("❌ Error fetching repo insights:", err.message);
    throw new Error("Failed to fetch repository insights");
  }
}

// User insights
async function fetchUserInsights(username) {
  const cacheKey = `user:${username}`;
  const redis = getRedisClient();

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      return JSON.parse(cached);
    }

    console.log(`⚡ Fetching user data from GitHub API for ${username}`);
    const [userData, reposData] = await Promise.all([
      githubAPI.get(`/users/${username}`),
      githubAPI.get(`/users/${username}/repos`)
    ]);

    const result = {
      username: userData.data.login,
      public_repos: userData.data.public_repos,
      followers: userData.data.followers,
      following: userData.data.following,
      repos: reposData.data.map(r => ({
        name: r.name,
        stars: r.stargazers_count,
        forks: r.forks_count
      }))
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);
    return result;
  } catch (err) {
    console.error("❌ Error fetching user insights:", err.message);
    throw new Error("Failed to fetch user insights");
  }
}

module.exports = { fetchRepoInsights, fetchUserInsights };
