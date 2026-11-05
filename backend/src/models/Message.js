import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 40,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 240,
    },
    attending: {
      type: String,
      enum: ["attending", "blessings"],
      default: "attending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

messageSchema.set("toJSON", {
  transform(_doc, ret) {
    return {
      _id: String(ret._id),
      name: ret.name,
      message: ret.message,
      attending: ret.attending,
      createdAt: ret.createdAt,
    };
  },
});

export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
