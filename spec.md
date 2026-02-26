# Specification

## Summary
**Goal:** Connect the NEXUS frontend to a complete Motoko backend canister, implement an Admin Panel, and add a real-time in-app notification system — replacing all mock/demo data with live canister calls.

**Planned changes:**
- Create `backend/main.mo` as a single Motoko actor with all data types (UserProfile, ProProfile, Service, Booking, Notification, Transaction), stable storage, and a heartbeat that auto-releases escrow after 48 hours
- Implement all Pro canister functions: `updatePro()`, `addService()`, `removeService()`, `getMyServices()`, `activateSubscription()`, `getRadarDemandes()`, `getWalletSolde()`, `acceptBooking()`, `declineBooking()`, `uploadGalleryPhoto()`, `getMyGallery()`
- Implement all Client canister functions: `getActivePros()`, `getFlashPros()`, `createBooking()`, `getMyBookings()`, `cancelBooking()`, and a commented `/* PAYREXX_STUB */` block
- Implement Admin-only canister functions: `adminGetAllPros()`, `adminValidatePro()`, `adminGetAllTransactions()`, `adminGetMetrics()` — guarded by an admin principal whitelist
- Implement in-app notification system in the canister with 5 types: `#nouvelle_demande`, `#paiement_confirme`, `#fonds_liberes`, `#avis_recu`, `#booking_confirme`, auto-triggered at relevant state transitions
- Add `/* TWILIO_STUB */` comment blocks at booking confirmation, escrow release, and new request events in the canister
- Create `frontend/src/lib/actor.ts` with a cached `getActor(identity?)` function using `@dfinity/agent`
- Create `frontend/src/lib/api.ts` with typed async wrappers for every canister method
- Create `frontend/src/lib/notifications.ts` polling `getMyNotifications()` every 15 seconds with unread count tracking
- Update `AppContext.tsx` to replace all mock/demo data imports with `api.ts` calls and React Query
- Update `Login.tsx` and `ProLogin.tsx` to remove demo mode and use real Internet Identity authentication
- Connect Pro dashboard screens (`BusinessScreen`, `RadarPro`, `WalletPro`, `DashboardScreen`) to live canister calls
- Connect Client screens (`Explorer`, `BookingFlow`, `ClientDashboard`) to live canister calls
- Create a new Admin Panel screen (route key `'admin'`) with pros validation table, transactions table, and revenue metrics — using the existing dark premium palette
- Update `GlobalHeader.tsx` with a notification bell and red unread-count badge
- Update `NotificationCenter.tsx` with a slide-in panel, all 5 notification type labels, timestamps, and mark-read/dismiss actions
- Add React Query hooks in `useQueries.ts` for all new canister endpoints and mutations

**User-visible outcome:** Users authenticate via real Internet Identity, all bookings and wallet data are stored on-chain, pros receive live radar requests and can manage their business from the canister, admins can validate pros and view platform metrics from a new Admin Panel, and all users see real-time in-app notifications with an unread badge.
