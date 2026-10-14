import { useState } from 'react';

const LABELS = {
  ready: '게임 시작',
  launching: '실행 중...',
  running: '게임 실행 중',
  error: '다시 시도',
};

function LaunchBar({ player, version, updateSize }) {
  const [status, setStatus] = useState('ready');
  const canPlay = status === 'ready' || status === 'error';

  const handlePlay = async () => {
    if (!canPlay) return;
    setStatus('launching');

    try {
      const res = await fetch('/api/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player, version }),
      });
      if (!res.ok) throw new Error(`Launch failed: ${res.status}`);
      setStatus('running');
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
