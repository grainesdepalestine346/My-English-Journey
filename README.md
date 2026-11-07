# English Journey – Graines de Palestine
Static site (HTML/CSS/JS). No backend, no API keys, no audio or video files.
## Deploy on GitHub Pages
1. Create a repository and upload all files (keep the folder structure).
2. Settings → Pages → Source: "Deploy from a branch" → `main` / root → Save.
3. Open `https://<username>.github.io/<repository>/`. Microphone recording needs HTTPS (GitHub Pages provides it).
## Branding
No logo or charter was supplied. `assets/logo-placeholder.svg` and the colour variables at the top of `css/style.css` are temporary: replace them with the official files.
## Speaking features
Works in-browser: recording, playback, delete (stored in IndexedDB on the device), optional en-GB transcript where the browser supports it, British spelling check on a short word list, self-assessment, notes.
Needs an external AI service (not included): automatic grammar, vocabulary and pronunciation feedback. Use the checklist and teacher feedback instead.
## Content status
Complete: Lesson 1 at A1, A2, B1, B2; placement test (8 questions); calendar of 32 lessons. To add a lesson, follow the structure of `LESSON` in `js/data.js`. A1/A2 include Arabic translations of vocabulary and instructions.
