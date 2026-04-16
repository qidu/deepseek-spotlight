# DeepSeek Spotlight

A Chrome extension that adds a **Cmd+K spotlight panel** for quickly searching and navigating your DeepSeek chat sessions.
It could provide you better chat sessions list, category, and search experiences than the original side bar of deepseek chat. 

---

## Features

- **Instant search** — fuzzy search across all your chat session titles
- **Two view modes** — browse by recency or by topic category
- **Keyboard-driven** — open, navigate, and select without touching the mouse
- **Auto-auth** — reads your session token from the page, no setup required

---

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the project folder
5. Navigate to [chat.deepseek.com](https://chat.deepseek.com) and log in

The extension only activates on `https://chat.deepseek.com/*`.

---

## Usage

### Keyboard shortcuts

| Shortcut | macOS | Windows / Linux |
|----------|-------|-----------------|
| Open / close panel | `Cmd+K` | `Ctrl+K` |
| Toggle view mode | `Cmd+L` | `Ctrl+L` |
| Navigate items | `↑` / `↓` | `↑` / `↓` |
| Open session | `Enter` | `Enter` |
| Close panel | `Esc` | `Esc` |

### View modes

**Time mode** (default) — all sessions listed as a flat list, most recently updated first.

**Category mode** (`Cmd+L` / `Ctrl+L`) — sessions grouped by topic:

| Category | Topics |
|----------|--------|
| 🔀 Git / GitHub | commits, branches, rebase, diff… |
| 🐳 Docker / Container | docker, compose, kubernetes… |
| 📦 Node / npm | npm, yarn, webpack, bundling… |
| 🤖 AI / ML | models, LLMs, embeddings… |
| 🔐 Auth / Security | OAuth, JWT, tokens, SSL… |
| 💻 Terminal / Shell | bash, zsh, tmux, ssh… |
| 🐍 Python | pip, Django, Flask, pandas… |
| 🌐 Web / Frontend | React, Vue, CSS, TypeScript… |
| 🗄️ Database | SQL, Postgres, Redis, MongoDB… |
| 📐 Math / Science | equations, calculus, matrices… |
| 🌿 Life / Other | poetry, culture, general… |
| 💬 General | everything else |

Click a category row to expand and show its sessions sorted by last updated time. Click again to collapse.

### Search

Type in the search box to fuzzy-search session titles. Results are ranked by match quality regardless of view mode.

---

## How it works

The extension runs as a content script on `chat.deepseek.com`. When the panel opens for the first time it fetches all your chat sessions from:

```
GET /api/v0/chat_session/fetch_page?lte_cursor.pinned=false
```

It reads your Bearer token from `localStorage.userToken` (set by the DeepSeek app after login) and sends the same headers the web app uses. Pagination is handled automatically — all pages are fetched and cached in memory for the session.

Sessions are cached after the first load. Close and reopen the panel without refetching.

---

## Files

```
├── manifest.json   Chrome extension manifest (MV3)
├── content.js      Panel logic — fetch, search, render, keyboard handling
└── styles.css      Light-theme panel styles
```

---

## Requirements

- Chrome (or any Chromium-based browser)
- An active login session at [chat.deepseek.com](https://chat.deepseek.com)
