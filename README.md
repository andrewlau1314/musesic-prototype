# Musesic prototype

A clickable front-end prototype of the Musesic piano-practice app for a Hong Kong family. It is a static site: no account, no API key, and no network connection after these files are on disk.

## Run

From this folder:

```bash
python3 -m http.server 8080
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080).

Or:

```bash
npx serve
```

Open the address that command prints.

## Walkthrough

About 45 seconds. On a wide screen the app sits in a phone frame.

1. Read the welcome screen, then press **Start this week's exercise**.
2. Leave **Lightly Row** selected, or switch to **C major five-finger pattern**. Press **Analyse this take**. The microphone stays off.
3. Wait until the note strip finishes filling in. **See feedback** stays off until then.
4. Read the limited pitch and onset feedback. Press **Open weekly summary**.
5. Press **Share with the tutor**. The app says nothing was sent. Press **Restart demo**.

**Back** is on every screen after welcome.
