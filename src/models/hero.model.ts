
import { IHero } from "@/interfaces/Hero.interface";
import { model, Schema } from "mongoose";

const HeroSchema = new Schema<IHero>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    shortDescription: { type: String, required: true },
    images: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

export const Hero = model<IHero>("Hero", HeroSchema);