
import { IFeature, IService } from "@/interfaces/service.interface";
import { model, Schema } from "mongoose";

/* ================= Feature ================= */
const featureSchema = new Schema<IFeature>(
  {
    title: { type: String, required: true }  },
  { _id: false }
);

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    shortDescription: { type: String, required: true },
    image: { type: String, required: true },
    features: { type: [featureSchema], required: true },
  },
  { timestamps: true }
);

/* ================= Slug Middleware ================= */
serviceSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    let slug = baseSlug;
    let counter = 1;

    while (await Service.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }
});

serviceSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<IService>;

  if (update.title) {
    const baseSlug = update.title
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    let slug = baseSlug;
    let counter = 1;

    while (await Service.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    update.slug = slug;
  }

  this.setUpdate(update);
});

export const Service = model<IService>("Service", serviceSchema);
