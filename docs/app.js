let SCHEDULE = null;
let DAYS = [];
 
// Small date/time helpers shared by the render functions below.
const WEEKDAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const todayName = () => WEEKDAY_NAMES[new Date().getDay()];
const nowMinutes = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const toMinutes = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
 
// Which day's classes are currently shown. Set once schedule.json loads,
// defaulting to today if today has an entry, otherwise the first day listed.
let selectedDay = null;
 
// Builds the row of day tabs (Mon, Tue, ...) and wires up click handling.
// Re-run on every render so the "active" and "is-today" classes stay correct.
function renderTabs(){
  const nav = document.getElementById("dayTabs");
  nav.innerHTML = "";
  DAYS.forEach((day) => {
    const btn = document.createElement("button");
    btn.className = "day-tab" + (day === selectedDay ? " active" : "") + (day === todayName() ? " is-today" : "");
    btn.textContent = day.slice(0, 3);
    btn.setAttribute("aria-pressed", day === selectedDay);
    btn.addEventListener("click", () => { selectedDay = day; render(); });
    btn.innerHTML += `<span class="today-dot"></span>`;
    nav.appendChild(btn);
  });
}
 
// Renders the list of classes for selectedDay, highlighting the one
// happening right now (only possible when selectedDay is actually today).
// Called on a 60s interval too, so the NOW highlight moves on its own.
function renderList(){
  const main = document.getElementById("classList");
  const entries = SCHEDULE[selectedDay] || [];
 
  if (entries.length === 0){
    main.innerHTML = `<div class="empty-state"><span class="big">No classes</span>Nothing scheduled for ${selectedDay}.</div>`;
    return;
  }
 
  const isToday = selectedDay === todayName();
  const nowMin = nowMinutes();
 
  main.innerHTML = entries.map((entry) => {
    const [startStr, endStr] = entry.time.split("-");
    const isNow = isToday && nowMin >= toMinutes(startStr) && nowMin < toMinutes(endStr);
    return `
      <div class="class-row${isNow ? " now" : ""}">
        <div class="time-block"><span class="start">${startStr}</span><span class="end">${endStr}</span></div>
        <div class="subject-block">
          <span class="subject-name">${entry.subject}</span>
          ${isNow ? '<span class="now-pill">NOW</span>' : ""}
        </div>
      </div>`;
  }).join("");
}
 
// Shows today's date in the header, independent of which day is selected.
function renderDate(){
  document.getElementById("todayDate").textContent =
    new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
 
// Full repaint: tabs, class list, and header date, in that order.
function render(){ renderTabs(); renderList(); renderDate(); }
 
// Fetches schedule.json, keeps the offline cache in sync with it, then
// does the first render. Runs once on startup; nothing else calls this.
async function loadSchedule(){
  try {
    const res = await fetch("schedule.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    SCHEDULE = await res.json();
    DAYS = Object.keys(SCHEDULE);
    selectedDay = DAYS.includes(todayName()) ? todayName() : DAYS[0];
    render();
    setInterval(renderList, 60 * 1000); // keep the NOW highlight fresh
  } catch (err) {
    // Covers a missing/unreachable schedule.json and bad JSON in it alike.
    document.getElementById("classList").innerHTML =
      `<div class="empty-state"><span class="big">Couldn't load schedule</span>Check that schedule.json is next to index.html, then reload.</div>`;
  }
}
 
loadSchedule();
 
// Registers the service worker for offline support. Failure is swallowed
// on purpose: the app still works online without it, just not offline.
if ("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
