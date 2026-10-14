import mongoose from 'mongoose';

const launchLogSchema = new mongoose.Schema(
  {
    player: { type: String, required: true, trim: true },
    version: { type: String, required: true, trim: true },
    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

export default mongoose.model('LaunchLog', launchLogSchema);
