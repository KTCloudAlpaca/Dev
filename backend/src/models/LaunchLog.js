import mongoose from 'mongoose';

// 게임 시작 클릭 1회 = 문서 1개 (클릭 시각만 기록)
const launchLogSchema = new mongoose.Schema(
  {},
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

export default mongoose.model('LaunchLog', launchLogSchema);
