# Publishing on GitHub Pages
1. Create a repository and upload every file in this folder, keeping the folder structure.
2. Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
3. The site appears at `https://<username>.github.io/<repository>/` within minutes.
4. To update: edit or upload files on GitHub and commit. Test locally with `python3 -m http.server` (opening files directly will not load the JSON).
## Audio
Upload MP3 files with the names in each unit JSON (e.g. `audio/unit-01/listening-1.mp3`). British English, no music.
## Brand
Edit only `assets/css/brand.css`. Current colours and font are PROVISIONAL.
## Adding a unit
Copy `content/units/unit-01.json` to `unit-02.json`, edit it, then set `"ok": true` for that week in `content/programme.json`.
