import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import apiRoutes from "./routes/api";
import { corsOptions } from "./middleware/cors";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import notFound from "./middleware/notFound";

const app: Application = express();

// __dirname fix (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// Middleware
// ======================
app.use(cookieParser());
app.use(compression());
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ======================
// Static React Build
// ======================
const clientBuildPath = path.join(__dirname, "../public");
app.use(express.static(clientBuildPath));

// ======================
// API Routes
// ======================
app.use("/api", apiRoutes);

// ======================
// Root Route
// ======================
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

// ======================
// React SPA fallback
// ======================
// app.get("*", (req: Request, res: Response) => {
//   res.sendFile(path.join(clientBuildPath, "index.html"));
// });

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(clientBuildPath, "index.html"));
// });

app.get("*all", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// ======================
// Global Error Handler
// ======================
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    // Zod error
    if (err.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: err.errors.map((e: any) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    // Multer error
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
);

// ======================
// Not Found
// ======================
// app.use((req: Request, res: Response) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

app.use(globalErrorHandler)
app.use(notFound)


export default app;