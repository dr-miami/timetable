# Timetable — App

A small offline-ready web app showing your weekly class schedule, built so it
can be packaged into a real installable Android APK — no Android Studio needed.

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

## 3. Put it online (required by the APK tool)

The APK builder needs a live `https://` URL to scan. The easiest free option
is GitHub Pages:

1. Create a new GitHub repository and upload everything in this folder
   (`index.html`, `style.css`, `app.js`, `schedule.json`, `manifest.json`,
   `sw.js`, and the `icons` folder).
2. In the repo, go to **Settings → Pages**, set the source to your main
   branch, and save.
3. GitHub gives you a URL like `https://yourname.github.io/your-repo/`.
   Open it and confirm the app loads there.

Any other static HTTPS host (Netlify, Vercel, Cloudflare Pages, etc.) works
the same way, if you already use one of those.

## 4. Generate the APK with PWABuilder

1. Go to **https://www.pwabuilder.com**.
2. Paste your GitHub Pages URL and click **Start**.
3. PWABuilder scans the manifest and service worker (both already set up in
   this project) and shows a readiness score.
4. Click **Package for stores → Android**.
5. Download the generated APK (or Android App Bundle).
6. Transfer the APK to your phone and open it to install — you may need to
   allow "install from unknown sources" for your file manager or browser
   the first time.

The app will keep working with no internet connection once installed, since
the service worker caches everything on first load.

## Notes

- App name, colors, and icon are all set in `manifest.json` — edit those if
  you'd like to rename it or restyle the icon.
- If you edit `app.js`, `style.css`, `index.html`, or `schedule.json`, bump
  `CACHE_NAME` in `sw.js` (e.g. `v2` → `v3`) so installed copies of the app
  pick up the update.