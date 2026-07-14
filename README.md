# Hooria OS — v4 (final)

Hooria Amir's interactive portfolio operating system. Real content throughout, every button wired to a real action, tested end-to-end in an actual browser (not just read over) before packaging.

## Run it

Open `index.html` directly, or serve it locally (recommended):

```bash
cd hooria-os
python3 -m http.server 8000
# then open http://localhost:8000
```

No build step, no `npm install` — everything is static HTML/CSS/JS.

## Everything included

**Boot → Lock → Desktop**
Randomized real-project-flavored boot log, live clock lock screen, time-aware desktop lighting that subtly shifts tone across the day, a cursor glow effect (toggleable), fictional Wi-Fi/battery indicators in the topbar, and a manual Developer Mode button alongside the Konami-code easter egg.

**Window manager**
Drag, resize, snap-to-edge (drag to the screen border, or ⌘/Ctrl+←/→), double-click-to-maximize, minimize, position/size memory per app across reloads, and a fixed race-condition bug where rapidly closing and reopening the same app could load content into a window that was about to be deleted.

**9 core apps**: Projects (7 real case studies with clickable, animated architecture diagrams and an illustrative regional map on JobPulse), About, Experience, Skills, Architecture playground, Blog, Resume (with Print + a skills graph), Contact (with a QR code and copy-to-clipboard), and a Display Settings app for themes/wallpapers.

**5 more apps**: Terminal (30+ commands), File Explorer (13 folders including Achievements and a hint-only Secrets folder), Paint (pencil/eraser/rectangle/circle/text/undo/redo/zoom/grid/recent colors), Sticky Notes, Music Player (3 procedurally-generated ambient tracks via Web Audio, no external files).

**Arcade — 7 mini-games**, all with a persistent local leaderboard: Snake, Memory Match, Tic-Tac-Toe (unbeatable minimax AI), Typing Speed Test, 2048, Minesweeper, and a Pixel Art Studio.

**Personalization**
6 themes (Dark, Light, Cyber, Terminal Green, Midnight Blue, Purple Neon) + a 7th **secret theme** unlocked only after finding the Konami code. 12 built-in wallpapers plus **custom wallpaper upload** (stored locally via `localStorage`, your own image, persists across reloads).

**Desktop widgets**: clock, focus meter, weather mockup, illustrative GitHub activity graph, current-focus note, rotating quote, a real **coding streak counter** (counts consecutive days you've opened the OS), and a **Spotify-style Now Playing widget** that live-syncs with the Music Player — even after you close the Music app, the track keeps playing and the widget keeps reflecting it, exactly like a real OS.

**Achievements & secrets**: 11 tracked achievements (Konami code, `sudo hire-hooria`, 10 logo clicks, playing each game, opening the Recycle Bin, etc.), viewable via the Terminal's `achievements` command or the File Explorer's Achievements folder. The Secrets folder gives honest hints without spoiling anything outright.

**Mobile**: not a shrunk desktop — a real card-list home screen with full-screen app sheets, and **swipe-down-to-close** on each sheet's header, matching real mobile app conventions.

## Bugs found and fixed while building this (via actual browser testing, not just reading code)

1. **2048 crashed on first render** — tile numbers were passed directly to the DOM-builder instead of as strings. Fixed, verified with a screenshot of working tiles.
2. **Minesweeper had the same class of bug** — the adjacent-mine count could be a number instead of a string in the same spot. Caught before it shipped, fixed.
3. **Rapid app close/reopen race** — closing and instantly reopening the same app (e.g. switching Arcade games quickly) could render new content into a window that was mid-close and about to be deleted 170ms later. Fixed by clearing window state immediately on close instead of waiting for the animation to finish, then stress-tested with repeated rapid open/close cycles.

## File structure

```
hooria-os/
├── index.html       # OS shell — boot/lock, topbar, desktop, dock, spotlight, menus, cursor glow, shutdown screen
├── styles.css        # Core design system + all base app styles + architecture detail panel
├── styles-v2.css      # Power menu, shutdown screen, widgets, dev-mode overlay, print stylesheet, cursor glow
├── content.js           # Real content — profile, 7 projects (with per-node architecture explanations), skills, blog
├── themes.js              # Theme + wallpaper engine (incl. secret theme + custom upload), Display Settings app
├── app.js                  # Core OS engine — windows, dock, spotlight, achievements, konami, topbar, cursor glow
├── terminal.js               # Terminal app + 30+ commands
├── apps-extra.js               # Paint, Notes, MusicEngine + widget, Arcade (7 games + leaderboard), File Explorer
└── resume.pdf                   # Generated from your real CV — swap in your own file anytime, same filename
```

## Still worth double-checking before you share this

- **Per-project GitHub/demo links** point to your GitHub profile as a placeholder — add real repo URLs in `content.js` once they're public.
- **Screenshots** aren't included in any case study since I don't have real screenshots of your apps to use.
- **QR code** needs an internet connection to load its small CDN library (like the Google Fonts already in use) — it degrades to a clean text fallback if offline.
- **Custom wallpaper** is stored in `localStorage`, which has a size limit (~5-10MB depending on browser) — very large images may fail to upload; the app shows a clear message if that happens rather than failing silently.
