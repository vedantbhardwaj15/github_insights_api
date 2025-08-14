require("dotenv").config();
const { initRedis } = require("./config/redis");
const app = require("./app");

async function startServer() {
  try {
    initRedis();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
