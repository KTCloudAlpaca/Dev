import { Router } from 'express';
import LaunchLog from '../models/LaunchLog.js';

const router = Router();

// 게임 시작 버튼 클릭 기록
router.post('/', async (req, res) => {
  const { player, version } = req.body ?? {};
  if (!player || !version) {
    return res.status(400).json({ message: 'player and version are required' });
  }

  const log = await LaunchLog.create({
    player,
    version,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(201).json({ id: log._id, launchedAt: log.createdAt });
});

// 최근 실행 기록 조회
router.get('/', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const logs = await LaunchLog.find().sort({ createdAt: -1 }).limit(limit);
  res.json(logs);
});

export default router;
