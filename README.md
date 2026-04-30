# DeepSeek Spotlight

A Chrome extension that adds a **Cmd+K spotlight panel** for quickly searching and navigating your DeepSeek chat sessions.
It could provide you better chat sessions list, category, and search experiences than the original side bar of deepseek chat. 

---

## Features

- **Instant search** — fuzzy search across all your chat session titles
- **Multiple browsing modes** — jump into time view, built-in category view, or dynamic category view
- **Keyboard-driven** — open, navigate, and select without touching the mouse
- **Dynamic categorization toggle** — generate categories from repeated keywords in your chat titles
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
| Open category panel | `Cmd+K` | `Ctrl+K` |
| Open time panel | `Cmd+L` | `Ctrl+L` |
| Navigate items | `↑` / `↓` | `↑` / `↓` |
| Open session | `Enter` | `Enter` |
| Close panel | `Esc` | `Esc` |

### View modes

**Time mode** (`Cmd+L` / `Ctrl+L`) — all sessions listed as a flat list, most recently updated first.

**Default category mode** (`Cmd+K` / `Ctrl+K`, with dynamic categorization off) — sessions grouped by built-in topic buckets:

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

**Dynamic category mode** (`Cmd+K` / `Ctrl+K`, with dynamic categorization on) — categories are generated from repeated keywords in your session titles. Each session is assigned to its strongest matching keyword based on document frequency, token length, and how early the term appears in the title.

Use the `dynamic cat` toggle in the panel header to switch between default and dynamic category grouping.

Click a category row to expand and show its sessions sorted by last updated time. Click again to collapse.

### Search

Type in the search box to fuzzy-search session titles. Results are ranked by match quality regardless of view mode.

Dynamic categories are built from the current session list and cached while the panel stays open, then rebuilt when you reopen the dynamic category view or change the dynamic categorization toggle.

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
