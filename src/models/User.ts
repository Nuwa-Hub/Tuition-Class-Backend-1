import mongoose, { Schema, Document, Model } from "mongoose";

interface UserDoc extends Document {
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  phone: string;
  paid: boolean;
  classId: String;
  slip: String;
  role: String;
  email: String;
  address: String;
  classType: String;
}

const UserSchema = new Schema(
  {
    password: { type: String },
    salt: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    classId: { type: String, unique: true },
    checked: { type: Boolean, default: false },
    email: { type: String },
    slip: { type: String },
    role: {
      type: String,
      enum: ["Admin", "Student"],
      default: "Student",
      required: true,
    },
    phone: { type: String, unique: true },
    paid: { type: Boolean, default: false },
    classType: {
      type: String,
      enum: ["physics", "chemistry", "both"],
      default: null,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const User = mongoose.model<UserDoc>("user", UserSchema);

export { User };
