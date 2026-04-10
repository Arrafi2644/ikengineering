import { Schema, model } from "mongoose";
import { IJobApplication } from "@/interfaces/jobApplication.interface";

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    position: { type: String, required: true },

    cvOption: {
      type: String,
      enum: ["upload", "gdrive", "dropbox"],
      required: true,
    },

    cvFile: { type: String },
    googleDriveLink: { type: String },
    dropboxLink: { type: String },

    coverLetter: { type: String },
  },
  { timestamps: true }
);

export const JobApplication = model<IJobApplication>(
  "JobApplication",
  jobApplicationSchema
);