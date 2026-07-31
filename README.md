# WOD Clock

A minimal, distraction-free workout timer for the four classic CrossFit/HIIT formats — **TABATA**, **FOR TIME**, **EMOM**, and **AMRAP**. Built as an installable PWA so it works full-screen on a phone with the screen kept awake during a workout, even with no signal in the gym.

## Features

- **Four workout modes**
  - **TABATA** — work/rest intervals over a set number of rounds
  - **FOR TIME** — count up until you finish the workout
  - **EMOM** — every N minutes (or seconds) on the minute, for a set number of rounds
  - **AMRAP** — as many rounds as possible, counting down from a set time
- **10-second pre-start countdown** with a visual/vibration alert on the final 3 seconds
- Round counter that turns **orange during rest** and stays **red during work**
- Screen Wake Lock so the display doesn't sleep mid-workout
- Installable as a PWA (works offline via a service worker) with light/dark aware theming
- Share button to quickly send the app to a training partner
- Settings (rounds, work/rest durations, etc.) are remembered per mode via `localStorage`

## Tech stack

- [React](https://react.dev/) + [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/) for dev/build tooling
- Plain CSS (no framework), driven off CSS custom properties for theming

## Getting started

```bash
npm install
npm run dev
```

This starts the Vite dev server (default: http://localhost:5173).

### Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  pages/            One page per workout mode (Home, Tabata, ForTime, Emom, Amrap)
  components/       Shared UI (Screen, WorkoutScreens, SetupField)
  lib/               Timer engine, workout runner hook, settings storage
public/              PWA manifest, service worker, icons
```

## Deployment

The project includes a `vercel.json` and is set up to deploy as a static site on [Vercel](https://vercel.com/).