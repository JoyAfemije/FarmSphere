const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String }, // Cloudinary public_id for deletion
        alt: { type: String, default: "" },
      },
    ],
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    unit: {
      type: String,
      default: "piece", // piece, kg, litre, bag, set, etc.
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    specifications: [
      {
        key: String,
        value: String,
      },
    ],
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Aggregated review stats (updated on each review)
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    weight: Number,     // in kg
    dimensions: {
      length: Number,   // cm
      width: Number,
      height: Number,
    },
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate slug from name + timestamp for uniqueness
productSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    // Append short ID to prevent duplicates
    this.slug = `${baseSlug}-${Date.now().toString(36)}`;
  }
  next();
});

// Virtual to get discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.discountPrice && this.price > 0) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual: effective price (discounted if available)
productSchema.virtual("effectivePrice").get(function () {
  return this.discountPrice && this.discountPrice > 0 ? this.discountPrice : this.price;
});

// Indexes for fast searching and sorting
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ sold: -1 });

module.exports = mongoose.model("Product", productSchema);
