# Timetable — App

A small offline-ready web app showing your weekly class schedule.

## Files

- `index.html` — page structure only
- `style.css` — all styling
- `app.js` — app logic (loads schedule.json and renders it)
- `schedule.json` — your class data, the only file you need to edit
- `manifest.json`, `sw.js`, `icons/` — what make it installable and offline-ready

## 1. Add your real classes

Open `schedule.json` and replace the sample entries with your own, in this shape:

```json
{
  "Monday": [
    { "time": "08:00-08:50", "subject": "Mathematics" },
    { "time": "08:50-09:40", "subject": "English" }
  ],
  "Tuesday": [ ]
}
```

- Each day is its own list — they don't need to line up or have the same
  number of classes.
- Leave a day as `[]` if there's nothing scheduled.
- Save `schedule.json` — that's the only file you need to touch.

## 2. Preview it locally

Just open `index.html` in a browser to check it looks right. Because the app
now loads `schedule.json` with `fetch`, some browsers block that from a
plain double-clicked file — if the page shows "Couldn't load schedule",
serve the folder locally instead, e.g. `python3 -m http.server` from inside
it, then open `http://localhost:8000`. This will work automatically once
it's hosted online in step 3.

The app will keep working with no internet connection once installed, since
the service worker caches everything on first load.

- App name, colors, and icon are all set in `manifest.json` — edit those if
  you'd like to rename it or restyle the icon.
- If you edit `app.js`, `style.css`, `index.html`, or `schedule.json`, bump
  `CACHE_NAME` in `sw.js` (e.g. `v2` → `v3`) so installed copies of the app
  pick up the update.
