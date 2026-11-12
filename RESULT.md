# Musesic prototype

Static site in this folder. Entry file: `index.html`.

## Files

- `index.html` — page shell and phone frame
- `css/styles.css` — layout, colour, type, motion
- `js/app.js` — five screens, both sample takes, listening timer, pre-baked feedback
- `fonts/Fraunces.ttf` — wordmark and headings
- `fonts/SourceSans3.ttf` — body and controls
- `fonts/NOTICE.txt` — font licences
- `README.md` — how to run it

## Golden path

Sample people: learner Hana Wong, 10, Grade 1. Parent Alex Wong, Hong Kong. Week on the summary: 3–9 November 2026.

1. **Welcome.** The problem (no single exercise after the lesson; a parent cannot tell if practice was in tune or in time) and the promise (one short exercise, pitch and onset only, a plain weekly summary, no posture analysis). Button: **Start this week's exercise**.
2. **This week's exercise.** Year-1 pilot, Grade 1–2, original or properly licensed, under 30 seconds. Two prepared takes, no live microphone:
   - Lightly Row — 22 seconds. Original teaching edition, 8 bars, 16 notes. Default.
   - C major five-finger pattern. Original teaching edition, 16 seconds, 10 notes.
   Button: **Analyse this take**.
3. **Listening.** About 2.7 seconds. The note strip fills in while the screen explains that each note's pitch and onset are compared with the designated score, and that video, posture, hand shape, and dynamics are not analysed. **See feedback** enables only when the timer finishes. Back during the wait does not skip ahead.
4. **Limited feedback.** Note strip, flagged-note table, input used, recommendation, why this helps, and scope (pitch and onset only).
   - Lightly Row: 14 of 16 in tune. E4 and G4 in bar 2 sharp (about +25 and +22 cents). Last note C5 late by about 80 ms. Indexes 5, 7, and 15. Visible lines: “Pitch: E in bar 2 was sharp” and “Onset: last note was late”.
   - Five-finger: 9 of 10 in tune. F4, the ascending 6th note, flat by about −18 cents. Onsets even. Index 5.
   Button: **Open weekly summary**.
5. **Weekly summary** for Alex Wong. Practice days 4, time 46 min, designated takes 4, sharp notes 6 → 2. Hana practised Monday, Tuesday, Thursday, and Saturday. Visible lines: “Weekly summary”, “Practised the designated exercise on four days”, “Pitch is improving. Endings still a little late.” The home question follows the take (bar 2, E and G, or linger on F). Button: **Share with the tutor**, which states this is a prototype simulation and nothing was sent. Then **Restart demo**.

## Limitations

- Every figure is a prototype simulation. The listening step is a timer, not audio analysis.
- No live microphone. Only the two prepared takes above.
- Share does not send anything, and there is no tutor inbox.
- No accounts, payment, posture, hand shape, video, dynamics, or a full performance mark.
- Year-1 pilot copy only: Grade 1–2, about 20 original or properly licensed exercises. No exam-syllabus pieces.
- Refreshing the page returns to the welcome screen. The chosen take is kept only until restart or refresh.
- Fonts are Fraunces and Source Sans 3 under the SIL Open Font License. See `fonts/NOTICE.txt`.
