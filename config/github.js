const axios = require('axios');

const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'github_insights_api'
  }
});

module.exports = githubAPI;
