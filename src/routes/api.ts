import express from "express";
import { submitContactForm } from "../controllers/contact-controller.js";
import { submitJobApplication } from "../controllers/application-controller.js";
import { uploadSpec, uploadCV } from "../middleware/upload.js";

const router = express.Router();

// Contact form route with file upload middleware
router.post("/contact", uploadSpec, submitContactForm);

// Job application route with file upload middleware
router.post("/application", uploadCV, submitJobApplication);

export default router;
