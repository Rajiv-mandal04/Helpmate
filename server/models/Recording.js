import mongoose from "mongoose";

const recordingSchema = new mongoose.Schema(
  {
    filename: String,
    filePath: String,
    contentType: String,
  },
  { timestamps: true }
);

export default mongoose.model("Recording", recordingSchema);
