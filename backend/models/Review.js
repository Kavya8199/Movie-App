import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true },
    user: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 10 },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
