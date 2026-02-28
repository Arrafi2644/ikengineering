import { Request, Response } from "express";
import { createEmailTransporter, getEmailConfig } from "../utils/email.js";
import { JobApplicationRequest, ApiResponse } from "../types/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { renderFile } from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const submitJobApplication = async (
  req: Request<{}, ApiResponse, JobApplicationRequest>,
  res: Response<ApiResponse>
) => {
  try {
    console.log('💼 Job application submission received');
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      cvOption,
      cvFile,
      googleDriveLink,
      dropboxLink,
      coverLetter
    } = req.body;

    console.log('Application data:', { firstName, lastName, email, phone, position, cvOption, hasFile: !!req.file });

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !position || !cvOption) {
      console.error('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        message: "Missing required fields",
        error:
          "firstName, lastName, email, phone, position, and cvOption are required"
      });
    }

    // Validate CV option specific requirements
    if (cvOption === "upload" && !cvFile && !req.file) {
      console.error('❌ Validation failed: CV file missing for upload option');
      return res.status(400).json({
        message: "CV file is required when upload option is selected"
      });
    }

    if (cvOption === "gdrive" && !googleDriveLink) {
      console.error('❌ Validation failed: Google Drive link missing');
      return res.status(400).json({
        message:
          "Google Drive link is required when Google Drive option is selected"
      });
    }

    if (cvOption === "dropbox" && !dropboxLink) {
      console.error('❌ Validation failed: Dropbox link missing');
      return res.status(400).json({
        message: "Dropbox link is required when Dropbox option is selected"
      });
    }

    // Email configuration
    console.log('⚙️ Loading email configuration...');
    const emailConfig = getEmailConfig();
    const transporter = createEmailTransporter(emailConfig);

    // Prepare email content
    const subject = "New Job Application Received – IK Engineering Careers";
    console.log('📝 Preparing email with subject:', subject);
    const templatePath = path.join(
      __dirname,
      "../templates/job-application.ejs"
    );
    const htmlContent = await renderFile(templatePath, {
      firstName,
      lastName,
      email,
      phone,
      position,
      cvOption,
      cvFile: cvFile || null,
      googleDriveLink: googleDriveLink || null,
      dropboxLink: dropboxLink || null,
      coverLetter: coverLetter || null
    });

    // Prepare attachments
    const attachments = [];
    if (cvOption === "upload" && req.file) {
      console.log('📎 Attaching CV file:', req.file.originalname);
      attachments.push({
        filename: req.file.originalname,
        path: req.file.path
      });
    }

    // Send email
    const mailOptions = {
      from: emailConfig.auth.user,
      to: process.env.APPLICATION_SUBMISSION_EMAIL || emailConfig.auth.user,
      subject,
      html: htmlContent,
      attachments,
      replyTo: email
    };

    console.log('📨 Sending email to:', mailOptions.to);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully! Message ID:', info.messageId);
    console.log('Response:', info.response);

    // Clean up uploaded file after sending email
    if (req.file) {
      try {
        const fs = await import('fs/promises');
        await fs.unlink(req.file.path);
        console.log('🗑️ Cleaned up temporary file:', req.file.path);
      } catch (cleanupError) {
        console.error('⚠️ Failed to clean up file:', cleanupError);
        // Don't fail the request if cleanup fails
      }
    }

    res.status(200).json({
      message:
        "Job application submitted successfully. We will review your application and get back to you soon!"
    });
  } catch (error) {
    console.error('❌ Job application submission failed:', error);
    console.error('Error details:', error instanceof Error ? error.stack : error);
    res.status(500).json({
      message: "Failed to submit job application. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
