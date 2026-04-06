# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.






Here's exactly how to submit it step by step:

---

**Step 1 — Set up the project locally**

Open your terminal and run:
```bash
npm create vite@latest finflow -- --template react
cd finflow
npm install
```

Then replace the contents of `src/App.jsx` with the `FinanceDashboard.jsx` file you downloaded. Also delete `src/App.css` and `src/index.css` (or just empty them out so they don't interfere).

---

**Step 2 — Test it locally**

```bash
npm run dev
```
Open `http://localhost:5173` and make sure everything looks good — check all three tabs, dark mode, add/edit transactions, and the export button.

---

**Step 3 — Push to GitHub**

Go to [github.com](https://github.com) → New Repository → name it `finflow-dashboard` → create it. Then in your terminal:

```bash
git init
git add .
git commit -m "Initial commit - FinFlow Finance Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/finflow-dashboard.git
git push -u origin main
```

---

**Step 4 — Deploy on Vercel (free, takes 2 minutes)**

Go to [vercel.com](https://vercel.com) → Sign up with GitHub → click **Add New Project** → import your `finflow-dashboard` repo → click **Deploy**. Vercel auto-detects Vite, no config needed. You'll get a live link like `finflow-dashboard.vercel.app`.

---

**Step 5 — Write a quick README**

Create a `README.md` in your project root. The assignment specifically evaluates documentation, so include:

```markdown
# FinFlow — Finance Dashboard

A personal finance dashboard built with React + Vite.

## Features
- Financial overview with KPI cards, health score, and charts
- Transaction management with search, filter, and sort
- Role-based UI (Admin / Viewer)
- Insights & monthly analytics
- Dark mode, CSV export, localStorage persistence

## Tech Stack
React, Vite, vanilla CSS-in-JS (no external UI library)

## Setup
npm install
npm run dev

## Live Demo
https://finflow-dashboard.vercel.app
```

---

**Step 6 — Submit**

On the Zorvyn portal, submit:
- **GitHub repo link** — `https://github.com/YOUR_USERNAME/finflow-dashboard`
- **Live deployment link** — your Vercel URL
- Paste the README content in the description field if they ask for it

---

The whole process should take about 15–20 minutes. The deadline is tomorrow at 10 PM so you have plenty of time — just don't wait until the last minute since Vercel deploys can occasionally take a few minutes. Good luck! 🎯
