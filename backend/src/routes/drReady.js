import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // 1. MongoDB 연결 상태 확인
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: 'not-ready',
        backend: 'healthy',
        mongodb: 'disconnected'
      });
    }

    // 2. MongoDB에 실제 ping 명령 전송
    await mongoose.connection.db.admin().command(
      { ping: 1 },
      { maxTimeMS: 2000 }
    );

    // 3. 모든 검사 성공
    return res.status(200).json({
      status: 'ready',
      backend: 'healthy',
      mongodb: 'healthy'
    });

  } catch (error) {
    console.error('DR readiness check failed:', error.message);

    return res.status(503).json({
      status: 'not-ready',
      backend: 'healthy',
      mongodb: 'unhealthy'
    });
  }
});

export default router;
