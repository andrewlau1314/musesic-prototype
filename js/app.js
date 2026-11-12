/**
 * Musesic prototype
 * -----------------
 * Five screens a family can click through in about a minute.
 * There is no microphone, no account, and no model call.
 *
 * The listening screen is a short timer (about 2.7 seconds) with a note
 * strip that fills in. Feedback and the weekly summary are pre-baked
 * simulation copy for two prepared takes:
 *   - Lightly Row (default)
 *   - C major five-finger pattern
 *
 * Flow: welcome → exercise → listening → feedback → summary → nothing sent.
 * Back moves one step. Restart returns to welcome and the default take.
 *
 * Flagged note indexes are 0-based positions in the prepared take.
 * Lightly Row: 5 (E4), 7 (G4), 15 (C5). Five-finger: 5 (F4).
 */

const ANALYSIS_MS = 2700;

/** Exact product lines. Dashes are real typographic characters, not hyphens. */
const COPY = {
  exerciseTitle: "This week's exercise",
  lightlyLine: "Lightly Row \u2014 22 seconds",
  pitchLine: "Pitch: E in bar 2 was sharp",
  onsetLine: "Onset: last note was late",
  summaryTitle: "Weekly summary",
  practisedLine: "Practised the designated exercise on four days",
  improvingLine: "Pitch is improving. Endings still a little late.",
  weekRange: "3\u20139 November 2026",
  sharpTrend: "6 \u2192 2",
  flatCents: "Flat, about \u221218 cents",
};

const TAKES = {
  lightly: {
    id: "lightly",
    name: "Lightly Row",
    titleLine: COPY.lightlyLine,
    notes: 16,
    facts: [
      "Original teaching edition, 8 bars",
      "16 notes in this take",
      "Learner level: Grade 1, Hana Wong",
    ],
    hero: [COPY.pitchLine, COPY.onsetLine],
    overview:
      "14 of 16 notes were in tune. Two notes in bar 2 were sharp, and the last note was late.",
    flagged: [
      {
        index: 5,
        note: "E4",
        where: "Bar 2, beat 1",
        pitch: "Sharp, about +25 cents",
        onset: "On time",
        kind: "pitch",
      },
      {
        index: 7,
        note: "G4",
        where: "Bar 2, beat 3",
        pitch: "Sharp, about +22 cents",
        onset: "On time",
        kind: "pitch",
      },
      {
        index: 15,
        note: "C5",
        where: "Bar 8, last note",
        pitch: "In tune",
        onset: "Late, about 80 ms",
        kind: "onset",
      },
    ],
    recommendation:
      "Practise bar 2 slowly three times, listening for E and G. Then play through to the last C without slowing down.",
    why:
      "Hana gets one clear correction before the next lesson, instead of a general remark that practice was uneven.",
    inputLine:
      "Lightly Row, original teaching edition, 22 seconds, 16 notes, 8 bars",
    ending:
      "Endings are still a little late. That matches today's take of the last note.",
    home: "Ask Hana to play bar 2 slowly and listen for E and G.",
  },
  five: {
    id: "five",
    name: "C major five-finger pattern",
    titleLine: "C major five-finger pattern",
    notes: 10,
    facts: [
      "Original teaching edition",
      "16 seconds, 10 notes",
      "Learner level: Grade 1, Hana Wong",
    ],
    hero: [
      "Pitch: the F in the middle was slightly flat",
      "Onset: the notes were even",
    ],
    overview:
      "9 of 10 notes were in tune. The F in the middle of the pattern was slightly flat. Onsets were even.",
    flagged: [
      {
        index: 5,
        note: "F4",
        where: "ascending 6th note",
        pitch: COPY.flatCents,
        onset: "On time",
        kind: "pitch",
      },
    ],
    recommendation:
      "Play the five-finger pattern slowly, and linger on F until it matches the note beside it. Then return to a steady tempo.",
    why:
      "A single flat note is easier to correct now than after a week of repeating the same pattern.",
    inputLine:
      "C major five-finger pattern, original teaching edition, 16 seconds, 10 notes",
    ending:
      "Endings are still a little late across the week. Today's five-finger take was even in time. The note to correct is F.",
    home: "Ask Hana to play the five-finger pattern slowly, and linger on F until it matches the note beside it.",
  },
};

const TITLES = {
  welcome: "Musesic",
  exercise: "This week's exercise \u00b7 Musesic",
  analysing: "Listening \u00b7 Musesic",
  feedback: "Limited feedback \u00b7 Musesic",
  summary: "Weekly summary \u00b7 Musesic",
  sent: "Nothing was sent \u00b7 Musesic",
};

const BACK = {
  exercise: "welcome",
  analysing: "exercise",
  feedback: "analysing",
  summary: "feedback",
  sent: "summary",
};

const state = {
  screen: "welcome",
  take: "lightly",
  analysisReady: false,
};

let timers = [];

function clearTimers() {
  timers.forEach((id) => clearTimeout(id));
  timers = [];
}

function later(fn, ms) {
  const id = setTimeout(fn, ms);
  timers.push(id);
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function currentTake() {
  return TAKES[state.take];
}

function layout({ step, title, back, body, dock }) {
  return `
    <div class="device-inner" data-screen="${state.screen}">
      <header class="top">
        <div class="top-row">
          ${
            back
              ? '<button type="button" class="text-btn" data-action="back">Back</button>'
              : '<span class="top-spacer"></span>'
          }
          <p class="badge">Prototype simulation</p>
        </div>
        <div class="brand-row">
          <p class="mark">Musesic</p>
          <p class="step">Step ${step} of 5</p>
        </div>
      </header>
      <main class="scroll" id="main">
        <div class="view">
          <h1 id="screen-title" tabindex="-1">${esc(title)}</h1>
          ${body}
        </div>
      </main>
      <footer class="dock">${dock}</footer>
    </div>
  `;
}

function screenWelcome() {
  return layout({
    step: 1,
    title: "Was practice in tune and in time?",
    back: false,
    body: `
      <p class="lede">After a weekly lesson, a Grade 1\u20132 beginner often leaves without one clear exercise. The parent cannot tell whether practice was in tune or in time.</p>
      <section class="panel">
        <h2>Musesic's promise</h2>
        <ul class="plain">
          <li>One designated short exercise, original or properly licensed, no longer than 30 seconds.</li>
          <li>Limited feedback on pitch and note onset only.</li>
          <li>A weekly practice summary in plain language for the parent.</li>
        </ul>
        <p class="boundary">No posture, hand shape, video, or dynamics, and no full performance mark.</p>
      </section>
      <div class="household">
        <p><span class="role">Learner</span> Hana Wong, 10, Grade 1</p>
        <p><span class="role">Parent</span> Alex Wong, Hong Kong</p>
        <p class="quiet">Year-1 pilot for Grade 1\u20132. About 20 original or properly licensed exercises.</p>
      </div>
    `,
    dock: '<button type="button" class="btn btn-primary" data-action="start">Start this week\'s exercise</button>',
  });
}

function takeCard(take) {
  const selected = state.take === take.id;
  const facts = take.facts
    .map((line) => `<span class="take-meta">${esc(line)}</span>`)
    .join("");
  return `
    <label class="take${selected ? " is-selected" : ""}">
      <input type="radio" name="take" value="${take.id}" ${selected ? "checked" : ""}>
      <span class="take-body">
        <span class="take-title">${esc(take.titleLine)}</span>
        ${facts}
      </span>
    </label>
  `;
}

function screenExercise() {
  return layout({
    step: 2,
    title: COPY.exerciseTitle,
    back: true,
    body: `
      <p>Hana's designated exercise sits in the Year-1 pilot: Grade 1\u20132, original or properly licensed, under 30 seconds. Choose one prepared sample take.</p>
      <fieldset>
        <legend>Prepared sample takes</legend>
        ${takeCard(TAKES.lightly)}
        ${takeCard(TAKES.five)}
      </fieldset>
    `,
    dock: `
      <p class="dock-note" id="dock-note">Prepared sample. No live microphone.</p>
      <button type="button" class="btn btn-primary" data-action="analyse">Analyse this take</button>
    `,
  });
}

/** Note strip. Listening mode fills every head the same way. Result mode marks flags. */
function stripHtml(take, mode) {
  const byIndex = new Map(take.flagged.map((flag) => [flag.index, flag]));
  const items = [];
  for (let i = 0; i < take.notes; i += 1) {
    const flag = byIndex.get(i);
    let kind = "wait";
    let caption = "";
    let spoken = `Note ${i + 1} of ${take.notes}`;
    if (mode === "result") {
      if (!flag) {
        kind = "ok";
        spoken += ", in tune, onset on time";
      } else if (flag.kind === "pitch") {
        kind = "pitch";
        caption = flag.pitch.startsWith("Flat") ? "Flat" : "Sharp";
        spoken += `, ${flag.note}, ${flag.pitch}, onset ${flag.onset}`;
      } else {
        kind = "onset";
        caption = "Late";
        spoken += `, ${flag.note}, ${flag.pitch}, ${flag.onset}`;
      }
    }
    const cap = caption
      ? `<span class="note-cap">${esc(caption)}</span>`
      : "";
    items.push(
      `<li class="note note-${kind}" data-index="${i}">` +
        `<span class="head" aria-hidden="true"></span>${cap}` +
        `<span class="sr">${esc(spoken)}</span></li>`
    );
  }
  const label =
    mode === "result"
      ? `Notes in this take, ${take.notes} notes`
      : `Listening strip, ${take.notes} notes`;
  const listenClass = mode === "listen" ? " strip-listen" : "";
  return `<ol class="strip strip-${take.notes}${listenClass}" aria-label="${esc(label)}">${items.join("")}</ol>`;
}

function legendHtml(take) {
  const hasPitch = take.flagged.some((flag) => flag.kind === "pitch");
  const hasOnset = take.flagged.some((flag) => flag.kind === "onset");
  const items = [
    '<li><span class="swatch swatch-ok" aria-hidden="true"></span> In tune, on time</li>',
  ];
  if (hasPitch) {
    items.push(
      '<li><span class="swatch swatch-pitch" aria-hidden="true"></span> Pitch to correct</li>'
    );
  }
  if (hasOnset) {
    items.push(
      '<li><span class="swatch swatch-late" aria-hidden="true"></span> Onset to correct</li>'
    );
  }
  return `<ul class="legend">${items.join("")}</ul>`;
}

function tableHtml(take) {
  const bodies = take.flagged
    .map(
      (flag) => `
      <tbody>
        <tr class="note-name">
          <th colspan="2" scope="rowgroup">${esc(flag.note)}, ${esc(flag.where)}</th>
        </tr>
        <tr>
          <th scope="row">Pitch</th>
          <td>${esc(flag.pitch)}</td>
        </tr>
        <tr>
          <th scope="row">Onset</th>
          <td>${esc(flag.onset)}</td>
        </tr>
      </tbody>`
    )
    .join("");
  return `<table class="sheet"><caption class="sr">Flagged notes</caption>${bodies}</table>`;
}

function inputHtml(take) {
  const rows = [
    ["Sample", "Prepared take. Microphone off."],
    ["Exercise", take.inputLine],
    ["Learner", "Hana Wong, 10, Grade 1"],
    ["Comparison", "Each note's pitch and onset against the designated score."],
  ];
  const html = rows
    .map(([term, detail]) => `<dt>${esc(term)}</dt><dd>${esc(detail)}</dd>`)
    .join("");
  return `<dl class="meta">${html}</dl>`;
}

function screenAnalysing() {
  const take = currentTake();
  return layout({
    step: 3,
    title: "Listening to this take",
    back: true,
    body: `
      <p class="kicker">${esc(take.titleLine)}</p>
      <p>Comparing each note's pitch and onset with the designated score, so Hana has one correction before the next lesson. Pitch shows whether the note was in tune. Onset shows whether it started on time.</p>
      <p>This does not use video. It does not analyse posture, hand shape, or dynamics.</p>
      <div class="stage-card" id="analysis-panel" aria-busy="true">
        ${stripHtml(take, "listen")}
        <div class="bar" id="listen-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Listening progress">
          <div class="bar-fill" id="listen-bar"></div>
        </div>
        <p class="status is-live" id="listen-status" aria-live="polite" aria-atomic="true">
          <span class="status-dot" aria-hidden="true"></span>
          <span id="listen-text">Listening to the prepared sample.</span>
        </p>
        <p class="mic">Prepared sample take. The microphone is off.</p>
      </div>
    `,
    dock: `
      <p class="dock-note" id="dock-note">Microphone is off. Feedback opens when this check finishes.</p>
      <button type="button" class="btn btn-primary" id="see-feedback" data-action="feedback" aria-describedby="dock-note" disabled>See feedback</button>
    `,
  });
}

function screenFeedback() {
  const take = currentTake();
  const hero = take.hero.map((line) => `<p>${esc(line)}</p>`).join("");
  return layout({
    step: 4,
    title: "Limited feedback",
    back: true,
    body: `
      <p class="kicker">${esc(take.titleLine)}</p>
      <div class="hero">${hero}</div>
      <p>${esc(take.overview)}</p>
      <h2>Notes in this take</h2>
      <div class="stage-card">
        ${stripHtml(take, "result")}
        ${legendHtml(take)}
      </div>
      <h2>Flagged notes</h2>
      ${tableHtml(take)}
      <h2>Recommendation</h2>
      <div class="callout"><p>${esc(take.recommendation)}</p></div>
      <h2>Why this helps</h2>
      <p>${esc(take.why)}</p>
      <h2>Input used</h2>
      ${inputHtml(take)}
      <h2>Scope</h2>
      <p>Pitch and note onset only. Not posture, hand shape, video, or dynamics, and not a full performance mark.</p>
    `,
    dock: '<button type="button" class="btn btn-primary" data-action="summary">Open weekly summary</button>',
  });
}

function statsHtml() {
  const items = [
    ["4", "Practice days"],
    ["46 min", "Time this week"],
    ["4", "Designated takes"],
    [COPY.sharpTrend, "Sharp notes vs last week"],
  ];
  return `<div class="stats">${items
    .map(
      ([value, label]) =>
        `<p class="stat"><strong>${esc(value)}</strong><span>${esc(label)}</span></p>`
    )
    .join("")}</div>`;
}

function daysHtml() {
  const days = [
    ["Monday", true],
    ["Tuesday", true],
    ["Wednesday", false],
    ["Thursday", true],
    ["Friday", false],
    ["Saturday", true],
    ["Sunday", false],
  ];
  const items = days
    .map(([name, on]) => `<li class="${on ? "on" : ""}">${esc(name)}</li>`)
    .join("");
  return `<ul class="days" aria-hidden="true">${items}</ul>`;
}

function screenSummary() {
  const take = currentTake();
  return layout({
    step: 5,
    title: COPY.summaryTitle,
    back: true,
    body: `
      <p class="dateline">For Alex Wong \u00b7 ${esc(COPY.weekRange)}</p>
      <p class="kicker">${esc(take.titleLine)}</p>
      <p>Plain language for home, not a music-exam report.</p>
      <div class="hero">
        <p>${esc(COPY.practisedLine)}</p>
        <p>${esc(COPY.improvingLine)}</p>
      </div>
      ${statsHtml()}
      <p>Hana completed the designated exercise on Monday, Tuesday, Thursday, and Saturday.</p>
      ${daysHtml()}
      <p>Pitch is improving: fewer sharp notes than last week.</p>
      <p>${esc(take.ending)}</p>
      <h2>A useful question at home</h2>
      <div class="callout"><p>${esc(take.home)}</p></div>
    `,
    dock: `
      <p class="dock-note">Prototype only. Nothing leaves this screen.</p>
      <button type="button" class="btn btn-primary" data-action="share">Share with the tutor</button>
    `,
  });
}

function screenSent() {
  return layout({
    step: 5,
    title: "Nothing was sent",
    back: true,
    body: `
      <p class="lede">This is a prototype simulation. Nothing was sent to the tutor. The weekly summary stayed on this screen.</p>
      <p>Restart the demo to walk through again. The other prepared take is on the exercise screen.</p>
    `,
    dock: '<button type="button" class="btn btn-primary" data-action="restart">Restart demo</button>',
  });
}

const SCREENS = {
  welcome: screenWelcome,
  exercise: screenExercise,
  analysing: screenAnalysing,
  feedback: screenFeedback,
  summary: screenSummary,
  sent: screenSent,
};

function render(options = {}) {
  const screen = state.screen;
  app.innerHTML = SCREENS[screen]();
  document.title = TITLES[screen];
  // Move focus only when restoring a control, such as the selected take.
  // Focusing the heading on every screen paints a box around the title.
  if (options.focus) {
    const target = document.querySelector(options.focus);
    if (target) target.focus({ preventScroll: true });
  }
  if (screen === "analysing") startAnalysis();
}

/**
 * Fill the note strip, then unlock See feedback.
 * Leaving the screen clears the timers, so a late tick cannot skip ahead.
 * Reduced motion still waits the same time. It only drops the stagger.
 */
function startAnalysis() {
  clearTimers();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const notes = Array.from(document.querySelectorAll(".strip-listen .note"));
  const bar = document.getElementById("listen-bar");
  const barWrap = document.getElementById("listen-progress");
  const text = document.getElementById("listen-text");
  const status = document.getElementById("listen-status");
  const button = document.getElementById("see-feedback");
  const note = document.getElementById("dock-note");
  const panel = document.getElementById("analysis-panel");

  function setProgress(percent) {
    if (!bar || !barWrap) return;
    bar.style.width = `${percent}%`;
    barWrap.setAttribute("aria-valuenow", String(percent));
  }

  if (reduce) {
    notes.forEach((el) => el.classList.add("is-lit"));
    setProgress(8);
    later(() => {
      if (state.screen !== "analysing") return;
      setProgress(40);
    }, 900);
    later(() => {
      if (state.screen !== "analysing") return;
      setProgress(75);
    }, 1800);
  } else {
    notes.forEach((el, index) => {
      const delay =
        notes.length === 1
          ? 400
          : Math.round(160 + (index * 2000) / (notes.length - 1));
      later(() => {
        if (state.screen !== "analysing") return;
        el.classList.add("is-lit");
        setProgress(Math.round(((index + 1) / notes.length) * 92));
      }, delay);
    });
  }

  later(() => {
    if (state.screen !== "analysing") return;
    text.textContent = "Comparing each note's pitch with the score.";
  }, 900);

  later(() => {
    if (state.screen !== "analysing") return;
    text.textContent = "Comparing each note's onset with the score.";
  }, 1800);

  later(() => {
    if (state.screen !== "analysing") return;
    state.analysisReady = true;
    setProgress(100);
    text.textContent = "Listening complete. Pitch and onset are ready to read.";
    if (status) status.classList.remove("is-live");
    if (panel) panel.setAttribute("aria-busy", "false");
    if (note) note.textContent = "The check is complete.";
    if (button) button.disabled = false;
  }, ANALYSIS_MS);
}

function go(screen) {
  clearTimers();
  state.screen = screen;
  if (screen === "analysing") state.analysisReady = false;
  render();
}

function restart() {
  clearTimers();
  state.screen = "welcome";
  state.take = "lightly";
  state.analysisReady = false;
  render();
}

function onClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) return;
  const action = button.getAttribute("data-action");
  if (action === "start") go("exercise");
  else if (action === "back") {
    const prev = BACK[state.screen];
    if (prev) go(prev);
  } else if (action === "analyse") go("analysing");
  else if (action === "feedback") {
    if (!state.analysisReady) return;
    go("feedback");
  } else if (action === "summary") go("summary");
  else if (action === "share") go("sent");
  else if (action === "restart") restart();
}

function onChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.name !== "take") return;
  if (input.value !== "lightly" && input.value !== "five") return;
  state.take = input.value;
  render({ focus: `input[name="take"][value="${state.take}"]` });
}

const app = document.getElementById("app");
document.addEventListener("click", onClick);
document.addEventListener("change", onChange);
render();
