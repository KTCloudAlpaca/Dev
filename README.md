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
│   ├── vite.config.js        # /api 요청을 backend로 프록시
│   └── package.json
│
└── .gitignore
```
