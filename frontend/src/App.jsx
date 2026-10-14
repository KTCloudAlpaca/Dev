import TopBar from './components/TopBar.jsx';
import NewsList from './components/NewsList.jsx';
import LaunchBar from './components/LaunchBar.jsx';
import { player, game, news } from './data/launcher.js';
import './App.css';

function App() {
  return (
    <div className="launcher">
      <TopBar player={player} />

      <main className="hero">
        <section className="hero__content">
          <span className="hero__season">{game.season}</span>
          <h1 className="hero__title">{game.title}</h1>
          <p className="hero__desc">{game.description}</p>
          <button className="hero__link">패치노트 보기 →</button>
        </section>

        <NewsList items={news} />
      </main>

      <LaunchBar version={game.version} updateSize={game.updateSize} />
    </div>
  );
}

export default App;
