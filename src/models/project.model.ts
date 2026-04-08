
import { IProject } from "@/interfaces/project.interface";
import { model, Schema } from "mongoose";

/* ================= Project ================= */

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
    duration: { type: String, required: true },
    workers: { type: String, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", projectSchema);
