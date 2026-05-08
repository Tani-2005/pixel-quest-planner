export function renderErrorPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PixelQuest</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #140a25;
        --panel: #261050;
        --text: #f4edff;
        --muted: #b9abd8;
        --accent: #6c3fc5;
        --border: #3e216e;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: var(--bg);
        color: var(--text);
        font-family: Inter, system-ui, sans-serif;
        padding: 24px;
      }
      main {
        width: min(100%, 560px);
        background: var(--panel);
        border: 2px solid var(--border);
        padding: 32px;
      }
      h1 {
        margin: 0 0 12px;
        font-size: clamp(28px, 4vw, 40px);
        line-height: 1.1;
      }
      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }
      .actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 24px;
      }
      a, button {
        appearance: none;
        border: 2px solid var(--border);
        background: var(--accent);
        color: var(--text);
        text-decoration: none;
        padding: 12px 16px;
        font: inherit;
        cursor: pointer;
      }
      .secondary {
        background: transparent;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Something went wrong</h1>
      <p>The app hit a server error while loading. Refresh to try again, or head back home.</p>
      <div class="actions">
        <button onclick="window.location.reload()">Refresh</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </main>
  </body>
</html>`;
}