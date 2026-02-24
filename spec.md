# Specification

## Summary
**Goal:** Build NEXUS Platform v2.0 — a full-featured beauty/wellness service marketplace on ICP with Internet Identity auth, city-based geolocation (Swiss romande), 10-second React Query polling, 6 seeded demo pro profiles, and complete booking/payment/review flows.

**Planned changes:**
- Implement Internet Identity login screen with NEXUS logo, single Sign In button, and subtitle for WebAuthn/Face ID/Fingerprint
- Add role selection screen (Client / Pro) after login; Client triggers simulated OTP (code 1234, 30s timer, one-time), Pro opens onboarding modal
- Build Pro onboarding modal ("LAUNCH MY SERVICE") with 5 benefits, 7-day free trial CTA, and "Not now" option
- Build Pro profile builder (Espace Pro) with 7 sections: Identity (cover/profile photos, name, slogan, bio, category, city, radius, languages, phone), Revolut payment setup, Service catalogue with presets, Gallery (min 3 photos), Availability grid, Flash mode (auto-off after 4h), Reputation score display
- Implement publication validation (Revolut + 3 photos + 1 service required); show red checklist if incomplete, subscription modal if complete
- Build subscription modal with 7-day free trial, simulated Revolut payment (3s auto-success), golden confetti on activation, trial banner in Pro dashboard, Day -1 notification
- Build Explorer screen (client) with category filters, distance slider, city selector (10 Swiss romande cities), "Available NOW ⚡" flash section with pulsing badge, pro card grid with skeleton loading
- Build Pro detail page (Fiche Pro) with cover, profile, reputation scores, services with before/after photos, gallery, time slots, reviews, and sticky "Book Now" CTA
- Implement 6-step Flash booking flow: service selection → time slot → address → summary → NEXUS PAY (simulated Revolut, 3s auto-success, escrow messaging) → post-payment confirmation with 10-minute countdown
- Build Radar Pro dashboard with React Query polling every 10 seconds, pending/confirmed/history tabs, red nav badge, per-request countdown timers, Accept/Decline actions, and auto-routing on decline/timeout
- Implement Live Status shared timeline (client + pro view) with booking lifecycle steps, 24h post-service confirmation prompts, fund release simulation, and 48h mediation flow
- Build Wallet Pro screen with available/escrowed balances, simulated Revolut transfer, transaction history table, stats summary, and monthly revenue bar chart
- Implement double review system: client public 5-star review + pro internal client rating; auto-suspend pros with average rating below 3.5 from Explorer
- Build Notification Center: bell icon with red unread badge, 7 notification types including simulated SMS display, mark-all-read on open
- Define Motoko backend data models and CRUD for: ProProfile, Service, GalleryPhoto, Availability, Booking, Review, Notification, Wallet, Transaction with stable storage
- Seed 6 demo pro profiles at canister init (if none exist): Studio Blade (Barber/Lausanne/Flash), BarberKing Geneva (Barber/Geneva), Studio Élé (Coiffure/Geneva), Atelier Fribourg Hair (Coiffure/Fribourg), Glow by Sofia (Esthétique/Lausanne), Zen Touch (Massage/Geneva)
- Replace all GPS/geolocation logic with city-based proximity matching using a fixed 10-city Swiss romande list and city-zone proximity map; remove useGeolocation.ts, haversine.ts, nominatim.ts references
- Serve 6 demo pro cover photos as static assets from frontend/public/assets/generated and assign to seeded profiles
- Apply NEXUS design system: #0A0A0A background, #E8C89A gold accent, #1A1A1A cards, Inter font, mobile-first max-width 430px, pulsing Flash badges, skeleton loaders, 200ms transitions, golden confetti on key events

**User-visible outcome:** A fully functional dark-themed mobile-first service marketplace where clients can browse 6 live demo pros, book Flash services with simulated payment and escrow, track booking status in real time, and leave reviews — while pros can manage their profile, accept/decline bookings via a live-polling radar, and track earnings in a wallet dashboard.
