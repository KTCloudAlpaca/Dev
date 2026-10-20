import client from 'prom-client';

// Prometheus 가 GET /metrics 로 수집 (ServiceMonitor: myapp-monitor)
export const register = new client.Registry();

// 프로세스 기본 지표: CPU, 메모리, 이벤트 루프 지연, GC 등
client.collectDefaultMetrics({ register });

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'HTTP 요청 수',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP 응답 시간(초)',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

// 요청마다 수와 응답 시간을 기록. route 는 실제 URL 이 아니라 등록된 경로(/api/launch 등)로 묶는다
export function metricsMiddleware(req, res, next) {
  const end = httpDuration.startTimer();
  res.on('finish', () => {
    const route = req.route ? `${req.baseUrl}${req.route.path}` : 'unmatched';
    const labels = { method: req.method, route, status: String(res.statusCode) };
    httpRequests.inc(labels);
    end(labels);
  });
  next();
}
