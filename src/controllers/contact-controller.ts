import { Request, Response } from "express";
import { createEmailTransporter, getEmailConfig } from "../utils/email.js";
import { ContactFormRequest, ApiResponse } from "../types/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { renderFile } from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const submitContactForm = async (
  req: Request<{}, ApiResponse, ContactFormRequest>,
  res: Response<ApiResponse>
) => {
  try {
    console.log('📧 Contact form submission received');
    const {
      name,
      email,
      phone,
      company,
      projectType,
      projectDetails,
      uploadSpec,
      preferredContactTime
    } = req.body;

    console.log('Form data:', { name, email, phone, company, projectType, hasFile: !!req.file });

    // Validate required fields
    if (!name || !email || !phone || !projectType || !projectDetails) {
      console.error('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        message: "Missing required fields",
        error:
          "name, email, phone, projectType, and projectDetails are required"
      });
    }

    // Email configuration
    console.log('⚙️ Loading email configuration...');
    const emailConfig = getEmailConfig();
    const transporter = createEmailTransporter(emailConfig);

    // Prepare email content
    const subject = "New Website Inquiry – Contact Form | IK Engineering";
    console.log('📝 Preparing email with subject:', subject);
    const templatePath = path.join(__dirname, "../templates/contact-form.ejs");
    const htmlContent = await renderFile(templatePath, {
      name,
      email,
      phone,
      company,
      projectType,
      projectDetails,
      uploadSpec: uploadSpec || null,
      preferredContactTime
    });

    // Prepare attachments
    const attachments = [];
    if (uploadSpec && req.file) {
      console.log('📎 Attaching file:', req.file.originalname);
      attachments.push({
        filename: req.file.originalname,
        path: req.file.path
      });
    }

    // Send email
    const mailOptions = {
      from: emailConfig.auth.user,
      to: process.env.CONTACT_EMAIL || emailConfig.auth.user,
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
        "Contact form submitted successfully. We will get back to you soon!"
    });
  } catch (error) {
    console.error('❌ Contact form submission failed:', error);
    console.error('Error details:', error instanceof Error ? error.stack : error);
    res.status(500).json({
      message: "Failed to submit contact form. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
