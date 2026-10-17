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
├── k8s/                      # (배포용) k8s 매니페스트
├── docker-compose.yml        # (개발용) 로컬 MongoDB
└── .gitignore
```

## 로컬 실행

필요한 것: Node.js, Docker

### 1. MongoDB 실행

루트(`Dev/`)에서 실행합니다.

```bash
docker compose up -d
```

`launcher-mongo` 컨테이너가 `27017` 포트로 뜹니다. 데이터는 `mongo-data` 볼륨에 저장되어 컨테이너를 내렸다 올려도 유지됩니다.

### 2. 백엔드 실행

```bash
cd backend
cp .env.example .env   # 최초 1회
npm install            # 최초 1회
npm run dev
```

아래 로그가 보이면 정상입니다. 서버는 DB 연결에 성공한 뒤에 뜨므로, MongoDB가 꺼져 있으면 서버도 뜨지 않습니다.

```
MongoDB connected: 127.0.0.1
Server running on http://localhost:5000
```

### 3. 프론트엔드 실행

새 터미널에서 실행합니다.

```bash
cd frontend
npm install   # 최초 1회
npm run dev
```

http://localhost:5173 에 접속합니다. `/api` 요청은 Vite가 `localhost:5000`(백엔드)으로 프록시합니다.

### 환경변수 (`backend/.env`)

| 이름 | 기본값 | 설명 |
|---|---|---|
| `PORT` | `5000` | 백엔드 포트 |
| `CLIENT_URL` | `http://localhost:5173` | CORS 허용 origin |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/launcher` | MongoDB 접속 주소 |

k8s 클러스터의 MongoDB를 쓰려면 `MONGODB_URI`를 클러스터 주소로 바꿉니다.

### MongoDB 관리

```bash
docker compose down                                # 중지 (데이터 유지)
docker compose down -v                             # 중지 + 데이터 삭제 (클릭 기록 초기화)
docker exec -it launcher-mongo mongosh launcher    # 셸 접속
```

부하테스트 전에는 `docker compose down -v`로 기록을 비운 뒤 다시 띄우면, `GET /api/launch`의 `total`을 보낸 요청 수와 바로 비교할 수 있습니다.

### 문제 해결

- **`[vite] http proxy error: /api/launch ... ECONNREFUSED`**: 백엔드가 떠 있지 않은 상태입니다. 백엔드 터미널에 `Server running` 로그가 있는지 확인하세요. 없다면 MongoDB 컨테이너가 실행 중인지(`docker ps`), `MONGODB_URI`가 올바른지 확인합니다.

## k8s 배포

매니페스트는 `k8s/`에 있습니다. 서버에서 레포를 clone한 뒤 직접 이미지를 빌드해 배포합니다.

| 파일 | 내용 |
|---|---|
| `backend.yaml` | backend Deployment + Service (`backend:5000`) |
| `frontend.yaml` | frontend Deployment + Service (NodePort `30080`) |

### 1. 이미지 빌드

```bash
docker build -t launcher-backend:v1 ./backend
docker build -t launcher-frontend:v1 ./frontend

# k8s 런타임(containerd)으로 이미지 전달
docker save launcher-backend:v1 launcher-frontend:v1 | sudo ctr -n k8s.io images import -
```

이미지는 빌드한 노드에만 있으므로, 노드가 여러 대라면 모든 노드에서 import하거나 레지스트리에 push해야 합니다.

### 2. Secret 생성

MongoDB(`db` 네임스페이스의 `mongodb` 서비스)는 인증이 걸려 있어, 접속 주소를 Secret으로 넣습니다. 계정 정보가 들어 있으므로 git에는 올리지 않습니다.

```bash
kubectl create secret generic backend-secret -n app \
  --from-literal=MONGODB_URI='mongodb://<user>:<password>@mongodb.db.svc.cluster.local:27017/launcher?authSource=admin'
```

### 3. 배포

frontend nginx는 시작할 때 `backend` 주소를 찾으므로 backend를 먼저 배포합니다.

```bash
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml

kubectl get pods -n app
kubectl logs -n app deploy/backend   # "MongoDB connected" 확인
```

`http://<노드 IP>:30080`으로 접속합니다. 외부에서 접속하려면 보안 그룹에서 `30080` 포트를 열어야 합니다.

코드를 수정한 뒤에는 이미지를 다시 빌드·import하고 `kubectl rollout restart -n app deploy/backend`(또는 `frontend`)로 재시작합니다.

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
