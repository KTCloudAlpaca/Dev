const tabs = ['홈', '패치노트', '커뮤니티', '상점'];

function TopBar({ player }) {
  return (
    <header className="topbar">
      <div className="topbar__logo">
        <span className="topbar__logo-mark">◆</span>
        ALPACA
      </div>

      <nav className="topbar__tabs">
        {tabs.map((tab, i) => (
          <button key={tab} className={`topbar__tab ${i === 0 ? 'is-active' : ''}`}>
            {tab}
          </button>
        ))}
      </nav>

      <div className="topbar__user">
        <span className="topbar__avatar">{player[0]}</span>
        <span>{player}</span>
      </div>
    </header>
  );
}

export default TopBar;
