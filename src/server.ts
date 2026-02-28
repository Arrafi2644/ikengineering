import express from "express";
import cors from "cors";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { corsOptions } from "./middleware/cors.js";
import apiRoutes from "./routes/api.js";
import {
  createEmailTransporter,
  getEmailConfig,
  validateEmailConfig
} from "./utils/email.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(compression() as any); // Gzip compression
app.use(cors(corsOptions)); // CORS configuration
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies

// Static file serving for React build
const clientBuildPath = path.join(__dirname, "../public");
app.use(express.static(clientBuildPath));

// API routes
app.use("/api", apiRoutes);

// Serve React app for all non-API routes
app.get("*all", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {

    // Handle multer errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size allowed is 5MB."
      });
    }

    if (err.name === "MulterError") {
      return res.status(400).json({
        success: false,
        message: "File upload error: " + err.message
      });
    }

    // Handle CORS errors
    if (err.message === "Not allowed by CORS") {
      return res.status(403).json({
        success: false,
        message: "CORS policy violation"
      });
    }

    // General error response
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Initialize server
const startServer = async () => {
  try {
    // Validate email configuration (optional for development)
    let isEmailValid = false;
    try {
      const emailConfig = getEmailConfig();
      const transporter = createEmailTransporter(emailConfig);
      isEmailValid = await validateEmailConfig(transporter);
    } catch (error) {
      // Email configuration failed, continue without email functionality
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();
