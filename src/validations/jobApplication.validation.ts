import { z } from "zod";

export const jobApplicationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  position: z.string().min(1),

  cvOption: z.enum(["upload", "gdrive", "dropbox"]),

  cvFile: z.string().optional(),
  googleDriveLink: z.string().optional(),
  dropboxLink: z.string().optional(),

  coverLetter: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.cvOption === "upload" && !data.cvFile) {
    ctx.addIssue({
      code: "custom",
      message: "CV file is required",
      path: ["cvFile"],
    });
  }

  if (data.cvOption === "gdrive" && !data.googleDriveLink) {
    ctx.addIssue({
      code: "custom",
      message: "Google Drive link is required",
      path: ["googleDriveLink"],
    });
  }

  if (data.cvOption === "dropbox" && !data.dropboxLink) {
    ctx.addIssue({
      code: "custom",
      message: "Dropbox link is required",
      path: ["dropboxLink"],
    });
  }
});