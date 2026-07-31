# Workout Clock — project notes

React + Vite PWA, built from a Figma design (file key `NZWJzghw4ZazatdV8MxJhn`).
Four workout timer modes, each its own route: `/tabata`, `/fortime`, `/emom`, `/amrap`.

## Structure
- `src/pages/*.jsx` — one file per mode. Each owns its setup fields + its phase
  sequencing (work/rest order, count up vs down). This is deliberate per-mode
  separation, not an oversight — don't merge them back into one file.
- `src/lib/useWorkoutRunner.js` — shared state machine plumbing (countdown,
  wake lock, screen state) used by all four pages.
- `src/lib/timer.js` — drift-free rAF timer (`runPhaseTimer`) + the
  vibrate+flicker alert (`alertPulse`).
- `src/components/WorkoutScreens.jsx` — shared setup/countdown/running/completed
  rendering; `showRound`/`showPhase` props toggle the round counter and
  WORK/REST label for TABATA/EMOM.

## Decisions worth knowing before changing behavior

**No sound, ever.** Alerts are vibration + a dark/light theme flicker only.
This was deliberate: the user runs Spotify during workouts, and there's no
reliable way for a web app to play a sound without interrupting/pausing
background music on iOS Safari (platform limitation, not a bug). If audio
alerts are ever added, flag this constraint again — don't just add a beep.

**Alert timing.** Every countdown segment (10s pre-start, each work/rest
phase, FOR TIME approaching its cap, AMRAP counting down) flashes red +
vibrates on its last 3 seconds. This logic lives in `runPhaseTimer`'s
`isAlert` calculation — reuse it, don't reimplement per page.

**EMOM math.** "EVERY x MIN y SEC" is the interval. "REST x SEC" is
subtracted from that interval to get work time (`work = every - rest`), so
each round always lands exactly on the next interval boundary. Rest happens
*inside* each round, not after all rounds.

**TABATA/EMOM rest after the last round.** Currently rest still plays out
after the final round before the completed screen shows (simplest consistent
state-machine behavior — same rule every round, no special-casing the last
one). This was flagged to the user as a judgment call, not confirmed either
way. If they want the last rest skipped, change the `finish()` check to fire
right after the last **work** phase instead of after its rest.

**RESET vs BACK.** RESET (during running/completed) returns to that mode's
setup screen with the previously-used values (via localStorage,
`wodclock:<mode>`). BACK always exits to the home screen.

**Design tokens**, pulled from Figma variables, not guessed:
`--dark-theme-bg:#1e1e1e`, `--light-theme-bg:#dcdcdc` (the flicker swaps
between these), `--green:#22c55e` (status/success), `--red:#ef4444`
(status/danger). Fonts: Archivo ExtraBold (headings/digits/round counter),
Geist Mono (labels/inputs/buttons/footer) — both loaded from Google Fonts.

## Deploy
Static SPA — `npm run build` outputs `dist/`. Client-side routing means
direct navigation/refresh on e.g. `/tabata` needs a rewrite rule:
`public/_redirects` (Netlify) and `vercel.json` (Vercel) are already set up
for this. Any other static host needs the equivalent "serve index.html for
all paths" config.
