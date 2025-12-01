const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

const { connectDB, sequelize } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const apiLimiter = require("./middleware/rateLimitMiddleware");
const errorHandler = require("./middleware/errorHandler");

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Connect to PostgreSQL
connectDB();

// Sync Sequelize models to database
sequelize
  .sync({ alter: true })
  .then(() => console.log("Tables synced with PostgreSQL."))
  .catch((err) => console.error(err));

// API Routes
app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API running");
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
