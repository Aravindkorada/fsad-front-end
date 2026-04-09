---
description: Set up a Vite + React project for a scholarship‑tracking platform with admin & student portals
---
1. **Show Vite create‑vite help**
   ```bash
   npx create-vite@latest --help
   ```

2. **Create a Vite React project in the current folder**
   // turbo
   ```bash
   npx -y create-vite@latest ./ --template react
   ```

3. **Install React Router for navigation**
   // turbo
   ```bash
   npm install react-router-dom
   ```

4. **Add Google Font “Inter” and a global CSS reset**
   - Edit `index.html` to include the `<link>` to Inter.
   - Create `src/index.css` with a CSS reset and base variables (gradient background, glass‑morphism backdrop, etc.).

5. **Create the main app layout with routing**
   - Replace the default `src/App.jsx` with a router that defines two top‑level routes: `/admin` and `/student`.
   - Add a simple navigation bar that lets you switch between portals.

6. **Add the Student portal components**
   - `src/pages/StudentDashboard.jsx` – displays a list of 10 hard‑coded scholarship cards.
   - `src/components/ScholarshipCard.jsx` – shows scholarship details and an **Apply** button that toggles to **Applied** on click (using local `useState`).
   - Apply glass‑morphism styling, subtle hover animations, and a micro‑transition for the button state change.

7. **Add the Admin portal components**
   - `src/pages/AdminDashboard.jsx` – a placeholder page where admins can later manage listings (CRUD UI to be built later).
   - Basic layout with a dark‑mode toggle (optional for future enhancement).

8. **Run the development server to verify**
   // turbo
   ```bash
   npm run dev
   ```

> **⚡️ Turbo annotation** – steps marked with `// turbo` are safe to run automatically (they only install packages or start the dev server). If you prefer to run them manually, just ignore the annotation.
