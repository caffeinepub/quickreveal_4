# Specification

## Summary
**Goal:** Refactor the NEXUS Beauty Platform into a full multi-file production architecture with real ICP Internet Identity authentication, TWINT-only payments via Payrexx, SMS OTP via Cloudflare Worker proxy, and a complete Motoko backend — eliminating all Stripe/Revolut references, emojis, and demo/fake flows.

**Planned changes:**
- Create `frontend/src/lib/payrexx.ts` with `createSubscriptionUrl` and `createBookingUrl` functions calling Payrexx API directly (TWINT only, `psp[0]=twint`) using env vars `VITE_PAYREXX_INSTANCE` and `VITE_PAYREXX_SECRET`
- Create `frontend/src/lib/twilio.ts` with `sendOTP` and `verifyOTP` proxying through `VITE_WORKER_URL` (Cloudflare Worker), never exposing credentials
- Create `frontend/src/lib/actor.ts` (ICP Internet Identity, createActor, login, logout), `frontend/src/lib/api.ts` (all canister functions), `frontend/src/lib/notifications.ts`
- Create `frontend/src/state/useAppState.ts` with global state, `go()`, `showToast()`, `update()`
- Create `frontend/src/styles/globals.css` with CSS variable palette, keyframe animations, hidden scrollbars, Inter font
- Create `frontend/src/components/icons/index.tsx` with 30+ named SVG icon components (zero emojis)
- Create all 13 UI components under `frontend/src/components/ui/`: BtnPrimary, BtnSecondary, Input, Label, Card, Toast, Header, TabBarClient, TabBarPro, TabBarAdmin, BottomSheet, ProgressCircle, Shimmer
- Create all auth screens: `LoginScreen.tsx` (Internet Identity), `RoleScreen.tsx`, `OTPScreen.tsx` (6-digit SMS OTP)
- Create all 11 client screens: ExplorerScreen, FicheProScreen, Booking1–5Screen, LiveStatusScreen, ReservationsScreen, AlertesScreen, ClientProfilScreen
- Booking5Screen calls `createBookingUrl` and redirects via `window.location.href` to Payrexx TWINT gateway (no setTimeout fake payment)
- Create all 6 pro screens: ProDashboardScreen, ProRadarScreen, ProWalletScreen, ProBusinessScreen (5 tabs), SubscriptionModal, SuccessScreen
- SubscriptionModal calls `createSubscriptionUrl` and redirects to Payrexx TWINT (19.90 CHF)
- Create all 5 admin screens: AdminLoginScreen, AdminDashboardScreen, AdminProsScreen, AdminBookingsScreen, AdminRevenusScreen
- Create `SetupScreen` (first-run config) shown when env vars are empty or admin credentials absent from localStorage; saves to localStorage and canister
- Create `backend/main.mo` with full Motoko actor: Internet Identity auth, pro profiles, explorer query, 5-step booking lifecycle, wallet with 30s transfer cooldown, notifications, admin functions, 48h escrow heartbeat, admin config storage
- Create `backend/Types.mo` with all shared types
- Add commented-out `PAYREXX_INTEGRATION` block in `main.mo` as a documented HTTP outcall stub for future ICP mainnet activation
- Create `.env.production` at project root with 5 placeholder env vars (VITE_PAYREXX_INSTANCE, VITE_PAYREXX_SECRET, VITE_WORKER_URL, VITE_ICP_CANISTER_ID, VITE_ICP_HOST)
- Enforce layout rules across all screens: `flex flex-col fixed inset-0`, scroll zone `flex-1 overflow-y-auto`, CTA buttons `flex-shrink-0`, tab bars `flex-shrink-0` (never `position: fixed`), no `100vh`, Inter font only, gold backgrounds always use `color: #050507`
- Remove all Stripe and Revolut references from every file
- Remove all emoji characters from all source files

**User-visible outcome:** A fully structured, production-ready multi-file NEXUS Beauty Platform with real ICP Internet Identity login, TWINT-only Payrexx payments for bookings and subscriptions, SMS OTP verification, complete client/pro/admin screen flows, and a Motoko backend — with no demo modes, no fake payment flows, and no emojis.
