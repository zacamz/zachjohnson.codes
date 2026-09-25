import { useEffect, useRef } from "react";
import "./Less.css";

function loadStylesheet(href) {
  const existing = document.querySelector(`link[data-less-style="true"]`);
  if (existing) return existing;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.lessStyle = "true";
  document.head.appendChild(link);
  return link;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-less-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.lessSrc = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function Less() {
  const booted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const stylesheet = loadStylesheet("/less/style.css");

    (async () => {
      try {
        await loadScript("/less/Board.js");
        await loadScript("/less/Game.js");
        if (cancelled) return;
        if (typeof window.startLessGame === "function") {
          window.startLessGame();
          booted.current = true;
        }
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
      // The game stylesheet styles `body`, so it must not outlive this page.
      stylesheet.remove();
      document.body.classList.remove(
        "turn-blue",
        "turn-red",
        "game-over-blue",
        "game-over-red"
      );
    };
  }, []);

  return (
    <div className="Less" id="less-app">
      <main className="game-app">
        <header className="game-hud">
          <div className="game-brand">
            <h1>Less</h1>
            <p className="tagline">Fan edition</p>
          </div>
          <p id="turn-status" className="turn-status"></p>
          <p id="score-status" className="score-status"></p>
          <p id="winner-status" className="winner-status" aria-live="polite"></p>
          <div className="actions">
            <button type="button" id="end-turn">
              End turn
            </button>
            <button type="button" id="new-game">
              New game
            </button>
          </div>
        </header>
        <div id="board-root"></div>
      </main>
    </div>
  );
}

export default Less;
