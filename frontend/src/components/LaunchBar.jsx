import { useEffect, useRef, useState } from 'react';

const LABELS = {
  ready: '게임 시작',
  launching: '실행 중...',
  running: '게임 실행 중',
  error: '다시 시도',
};

// '게임 실행 중' 상태에서 다시 '게임 시작'으로 돌아오기까지의 시간
const RESET_DELAY = 300;

function LaunchBar({ version, updateSize }) {
  const [status, setStatus] = useState('ready');
  const resetTimer = useRef();
  const canPlay = status === 'ready' || status === 'error';

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const handlePlay = async () => {
    if (!canPlay) return;
    setStatus('launching');

    try {
      const res = await fetch('/api/launch', { method: 'POST' });
      if (!res.ok) throw new Error(`Launch failed: ${res.status}`);
      setStatus('running');
      resetTimer.current = setTimeout(() => setStatus('ready'), RESET_DELAY);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <footer className="launchbar">
      <div className="launchbar__status">
        <div className="launchbar__info">
          <span className="launchbar__check">✓</span>
          <strong>업데이트 완료</strong>
          <span className="launchbar__meta">
            {version} · 최신 버전 · {updateSize}
          </span>
          {status === 'error' && (
            <span className="launchbar__error">서버에 연결할 수 없습니다</span>
          )}
        </div>
        <div className="launchbar__progress">
          <div className="launchbar__progress-fill" />
        </div>
      </div>

      <button
        className={`play-button is-${status}`}
        onClick={handlePlay}
        disabled={!canPlay}
      >
        {status === 'launching' && <span className="play-button__spinner" />}
        {LABELS[status]}
      </button>
    </footer>
  );
}

export default LaunchBar;
