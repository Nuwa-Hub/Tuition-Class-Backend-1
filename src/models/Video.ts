import mongoose, { Schema, Document, Model } from "mongoose";

export interface VideoDoc extends Document {
  videoUrl: string;
  title: string;
  limit: number;
  description: string;
}

const VideoSchema = new Schema(
  {
    videoUrl: String,
    title: String,
    limit: String,
    description: String,
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Video = mongoose.model<VideoDoc>("Video", VideoSchema);

export { Video };