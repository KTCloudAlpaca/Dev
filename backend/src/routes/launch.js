import { Router } from 'express';
import LaunchLog from '../models/LaunchLog.js';

const router = Router();

// 게임 시작 클릭 기록
router.post('/', async (req, res) => {
  const log = await LaunchLog.create({});
  res.status(201).json({ id: log._id, launchedAt: log.createdAt });
});

// 누적 클릭 수 조회
router.get('/', async (req, res) => {
  const total = await LaunchLog.estimatedDocumentCount();
  res.json({ total });
});

export default router;
