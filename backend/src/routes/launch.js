import { Router } from 'express';
import LaunchLog from '../models/LaunchLog.js';

const router = Router();

// 게임 시작 클릭 기록
router.post('/', async (req, res) => {
  const log = await LaunchLog.create({});
  res.status(201).json({ id: log._id, launchedAt: log.createdAt });

  // 응답은 이미 보냈으므로 누적 수 조회는 로그용으로만 쓰고, 실패해도 요청에 영향을 주지 않는다
  LaunchLog.estimatedDocumentCount()
    .then((total) => console.log(`Launch recorded: ${log._id} (total ${total})`))
    .catch((err) => console.error('Failed to count launches:', err.message));
});

// 누적 클릭 수 조회
router.get('/', async (req, res) => {
  const total = await LaunchLog.estimatedDocumentCount();
  res.json({ total });
});

export default router;
