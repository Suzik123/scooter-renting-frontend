# UniScoot — Scooter Renting Frontend

A single-page web app for renting electric scooters. Users sign in, find a
scooter on the map, start a timed ride, end it, see the cost charged from
their wallet, and review ride history.

This is a **frontend-only** project. There is no backend — all data comes
from mock files in `src/mock/`, and state is kept in the browser (Zustand +
`localStorage`).

---

## 1. Tech stack (what it's built with)

| Area            | Choice                                 |
| --------------- | -------------------------------------- |
| Language        | TypeScript                             |
| UI library      | React 19                               |
| Build tool      | Vite 6                                 |
| Routing         | React Router v7 (`react-router-dom`)   |
| State           | Zustand 5 (with `persist` middleware)  |
| Styling         | Tailwind CSS v4 (via PostCSS)          |
| Icons           | `lucide-react`                         |
| Class helper    | `clsx`                                 |

Entry point: `src/main.tsx` → mounts `<BrowserRouter><App /></BrowserRouter>`
into `#root` in `index.html`.

---

## 2. How to run

```bash
npm install
npm run dev        # start Vite dev server
npm run build      # type-check + production build
npm run preview    # preview the production build
```

---

## 3. Folder structure

```
src/
├── main.tsx              # React bootstrap (BrowserRouter + App)
├── App.tsx               # All routes (see §4)
├── index.css             # Tailwind import + theme colors
├── types/index.ts        # Shared TypeScript interfaces
├── mock/data.ts          # Fake users, scooters, rides, transactions…
├── stores/               # Zustand stores (global state)
│   ├── authStore.ts
│   ├── scootersStore.ts
│   ├── activeRideStore.ts
│   ├── rideHistoryStore.ts
│   ├── walletStore.ts
│   └── uiStore.ts
├── pages/                # One file per route (thin — just composes sections)
└── components/
    ├── layout/           # AppLayout, Sidebar (desktop), BottomNav (mobile)
    ├── sections/         # Big feature blocks used by pages
    └── ui/               # Small reusable primitives (Button, Badge, StatCard…)
```

**Rule of thumb:** `pages/` are thin, `components/sections/` contain most of
the real UI, `components/ui/` are generic reusable widgets.

---

## 4. Routing (`src/App.tsx`)

Two groups of routes:

**Public (no layout):**
- `/` → `LandingPage` (marketing page)
- `/login` → `LoginPage`

**App (wrapped in `AppLayout` with Sidebar + BottomNav):**
- `/dashboard` — greeting, quick actions, balance, nearby scooters
- `/map` — search + filters + scooter list + map canvas
- `/wallet` — balance, top-up, transactions, payment methods
- `/history` — list of past rides, stats, filters
- `/history/:id` — details of one ride
- `/profile` — user info, settings, eco impact
- `/ride/active` — live ride timer + end-ride button
- `/ride/complete` — summary after a ride ends

Navigation: desktop uses `Sidebar.tsx`, mobile uses `BottomNav.tsx`
(same links, different layouts). Links use `NavLink` so the active tab
highlights automatically.

---

## 5. State management (Zustand)

Each store is a small module that exposes data + actions. Components read
with a hook (`useXStore(selector)`) and call actions directly.

| Store                | Responsibility                                      | Persisted? |
| -------------------- | --------------------------------------------------- | ---------- |
| `authStore`          | current user, login/register/logout                 | yes (`uniscoot-auth`) |
| `scootersStore`      | list of scooters, selected one, sort filter         | no (loaded from mock) |
| `activeRideStore`    | currently running ride + live timer + cost          | yes (`uniscoot-active-ride`) |
| `rideHistoryStore`   | past rides, filters, user stats, rating             | yes (`uniscoot-rides`) |
| `walletStore`        | balance, transactions, payment methods              | yes (`uniscoot-wallet`) |
| `uiStore`            | toasts, modal open/close flags                      | no |

Persisted stores use Zustand's `persist` middleware → data survives page
refresh via `localStorage`.

---

## 6. Key flows (what happens when the user…)

### 6a. Logs in
- `LoginForm` calls `useAuthStore().login(email, password)`.
- The store clones the mock user, swaps in the email, sets
  `isAuthenticated = true`, and persists to `localStorage`.
- There's no real server — password is ignored on purpose (mock).

### 6b. Picks a scooter and starts a ride
- `/map` shows scooters from `scootersStore` (sorted by filter:
  `All | Nearest | Best Battery | Cheapest`).
- Tapping **Start Ride** calls `activeRideStore.startRide(scooter)`:
  - Records `startedAt = Date.now()`.
  - Starts a 1-second `setInterval` ticker (`_tick`) that updates
    `elapsedSeconds` and `currentCost`.
  - Navigates to `/ride/active`.
- Pricing is fixed in the store: `unlockFee = $1.00`, `ratePerMin = $0.29`.

### 6c. Ends the ride
- `ActiveRidePage` calls `endRide()` which:
  1. Stops the ticker.
  2. Computes duration, distance (derived from elapsed time), avg/max speed,
     CO₂ saved.
  3. Calls `rideHistoryStore.addRide(finished)` to push it into history.
  4. Calls `walletStore.chargeRide(cost, rideId)` to deduct the balance
     and log a transaction.
  5. Clears the active ride and returns it, and the page navigates to
     `/ride/complete`.

### 6d. Tops up the wallet
- `TopUpModal` (rendered once in `AppLayout`, controlled by `uiStore`)
  calls `walletStore.topUp(amount, methodId)` → adds to balance and
  prepends a `topup` transaction.

### 6e. Page refresh mid-ride
- `activeRideStore` persists only `activeRide` (the minimum needed).
- On rehydrate, `onRehydrateStorage` recomputes `elapsedSeconds` from
  `Date.now() - startedAt`, so the timer is correct after refresh.
- `ActiveRidePage` waits for `persist.hasHydrated()` before deciding to
  redirect — otherwise the first render would see `null` and bounce the
  user off a valid ongoing ride.

---

## 7. Types (`src/types/index.ts`)

Central place for shared models:
`User`, `Scooter`, `Ride`, `Transaction`, `PaymentMethod`, `PricingPlan`,
`UserStats`. Stores and components import from here so data shape stays
consistent.

---

## 8. Styling

- Tailwind CSS v4 imported in `src/index.css` via `@import "tailwindcss";`.
- Theme tokens (brand colors) declared in `@theme { … }`:
  - `--color-primary` = `#22C55E` (green)
  - `--color-primary-dark`, `--color-primary-light`
  - `--color-dark`, `--color-dark-card`
- Layout is fully responsive: **mobile → bottom nav**,
  **desktop (`lg:`) → left sidebar**. Breakpoints are Tailwind defaults.

---

## 9. Component philosophy

- `components/ui/` — tiny, stateless, reusable
  (`Button`, `Badge`, `StatCard`, `ProgressBar`, `RatingStars`, …).
- `components/sections/` — bigger blocks tied to one feature
  (e.g. `WalletBalanceCard`, `RideTimerCard`, `HistoryStatsGrid`).
- `pages/` — compose sections into full screens, do almost no logic
  themselves.

This three-layer split (ui → sections → pages) is the single most
important thing to mention when asked "how is the UI organized?".

---

## 10. Likely teacher questions — quick answers

**Q: Where does the data come from?**
From `src/mock/data.ts`. No API calls; stores are seeded from this file.

**Q: Why Zustand and not Redux / Context?**
Zustand gives you a global store with zero boilerplate — one hook per
store, no providers, no reducers. Persistence is one middleware call.

**Q: How is the ride timer implemented?**
`activeRideStore` stores `startedAt` (a timestamp). A `setInterval`
ticker runs every 1s and recomputes `elapsedSeconds` from
`Date.now() - startedAt`, so accuracy doesn't depend on the interval
firing exactly on time.

**Q: How do you stay logged in after refresh?**
Zustand `persist` middleware writes the auth state to `localStorage`
under the key `uniscoot-auth` and rehydrates on load.

**Q: How is routing structured?**
React Router v7 with nested routes. An `AppLayout` route wraps all
authenticated pages so `Sidebar` + `BottomNav` render once, and each
page renders into `<Outlet />`.

**Q: How is it responsive?**
Tailwind breakpoints. Below `lg`, `BottomNav` is visible and `Sidebar`
is hidden. At `lg+`, it's the opposite.

**Q: Where is pricing defined?**
`PRICING` constant in `src/stores/activeRideStore.ts`
(`unlockFee: 1.0`, `ratePerMin: 0.29`).

**Q: What happens if the browser closes mid-ride?**
The ride is persisted. On reopen, the timer resumes from wall-clock
difference, not from where it stopped counting.

**Q: Is there a backend?**
No. It's a front-end-only app using mock data, suitable for swapping in
a real API later by replacing the `load*` / action bodies in each store.
