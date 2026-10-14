# Dev

## 폴더 구조

```
Dev
├── backend/                  # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js         # MongoDB 연결
│   │   ├── models/
│   │   │   └── LaunchLog.js  # 게임 실행 기록 모델
│   │   ├── routes/
│   │   │   └── launch.js     # /api/launch 라우트
│   │   └── index.js          # 서버 진입점
│   ├── .env.example          # 환경변수 예시
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                 # React + Vite
│   ├── public/               # 정적 파일
│   ├── src/
│   │   ├── components/
│   │   │   ├── TopBar.jsx    # 상단 바 (로고, 탭, 사용자)
│   │   │   ├── NewsList.jsx  # 새소식 목록
│   │   │   └── LaunchBar.jsx # 업데이트 상태 + 게임 시작 버튼
│   │   ├── data/
│   │   │   └── launcher.js   # 게임 정보, 새소식 데이터
│   │   ├── App.jsx           # 런처 메인 화면
│   │   ├── App.css
│   │   ├── index.css         # 전역 스타일
│   │   └── main.jsx          # React 진입점
│   ├── index.html
│   ├── vite.config.js        # (개발용) /api 요청을 backend로 프록시
│   ├── nginx.conf.template   # (배포용) 정적 파일 서빙 + /api 프록시
│   ├── Dockerfile
│   └── package.json
│
└── .gitignore
```

## API

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/api/launch` | 게임 시작 클릭 기록 |
| GET | `/api/launch` | 누적 클릭 수 조회 |
| GET | `/api/health` | 서버 상태 확인 |

### POST `/api/launch`

"게임 시작" 버튼을 누르면 호출됩니다. 요청 본문 없이 호출하며, 클릭 1회마다 MongoDB `launchlogs` 컬렉션에 클릭 시각(`createdAt`)이 담긴 문서 1개를 저장합니다.

```json
// 201 Created
{ "id": "6acecf1ee9c83ea9d713e25f", "launchedAt": "2026-10-14T00:38:54.252Z" }
```

### GET `/api/launch`

지금까지 저장된 클릭 기록의 총 개수를 반환합니다. 부하테스트 후 보낸 요청 수와 비교해 유실 여부를 확인하는 용도입니다.

```json
// 200 OK
{ "total": 80 }
```

### GET `/api/health`

서버가 실행 중인지 확인합니다. DB 연결 상태는 확인하지 않습니다.

```json
// 200 OK
{ "status": "ok", "message": "Hello from backend!" }
```
