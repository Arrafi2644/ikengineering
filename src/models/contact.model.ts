import { IContactFormData } from "@/interfaces/contact.interface";
import { Schema, model } from "mongoose";

// Mongoose Schema
const contactFormSchema = new Schema<IContactFormData>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    projectType: {
      type: String,
      required: true,
    },
    projectDetails: {
      type: String,
      required: true,
    },
    uploadSpec: {
      type: [String], 
    },
    preferredContactTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Model
export const ContactForm = model<IContactFormData>(
  "ContactForm",
  contactFormSchema
);