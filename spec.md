# Specification

## Summary
**Goal:** Complete visual overhaul of the NEXUS platform with a premium dark UI using a consistent #0A0A0A–#1A1A1A palette, gold (#E8C89A) accents, Inter typography, and polished micro-animations.

**Planned changes:**
- Redesign the login/splash screen: solid #0A0A0A background, typographic NEXUS logo (white Inter Black 52px + blue period #4F6EF7 60px, letter-spacing -2px), tagline, 1px golden separator, golden pill CTA button, security line, and locale footer; remove all image assets and duplicate NEXUS text
- Implement a fixed global header on all authenticated screens: #0A0A0A background, 1px #1F1F1F bottom border, NEXUS logo left at 24px, notification bell with animated red pulse badge right, circular 32px initials avatar right, no "Mes résa" button
- Redesign the Explorer search bar: #1A1A1A background, 1px #2A2A2A border, golden pin icon left, "Votre ville..." placeholder, Swiss Romande city dropdown on tap, golden "≤ 50 km" pill right opening a distance slider
- Redesign Explorer category filters as horizontally scrollable pills (no scrollbar): active gold #E8C89A / inactive #1A1A1A, border-radius 50px; order: Tous, Flash, Barber, Coiffure, Esthétique, Massage
- Add a "DISPONIBLES MAINTENANT" Flash section in Explorer: pulsing green dot title, horizontally scrollable 160×200px cards with cover photo, gradient overlay, green FLASH badge, pro name, and city
- Redesign main pro cards in Explorer: full-width 180px cover photo, FLASH badge top-left, Revolut badge top-right, #111111 info zone with name/rating/category/location/response time/price in #E8C89A/RÉSERVER button, 20px radius, shadow
- Add a fixed bottom navigation bar: #0F0F0F background, 1px #1F1F1F top border, 64px + iOS safe area, four tabs (Explorer, Réservations, Messages, Profil), active tab in #E8C89A, red badge on Réservations
- Apply global Inter typography system (import from Google Fonts): H1 28px, H2 22px, Body 15px, Caption 12px, Labels 11px uppercase, Prices 18px #E8C89A, Buttons 14px #0A0A0A uppercase
- Implement micro-animations: tap scale(0.96) 150ms on all buttons/cards, elevated shadow on hover/tap, infinite FLASH badge pulse, red badge pulse, golden shimmer skeleton loaders, 200ms fade page transitions
- Build/redesign the pro detail screen: 220px cover photo, 80px circular profile photo with 3px gold border overlapping cover, pro name/slogan/badges, score bar, horizontally scrollable service cards with gold pricing, sticky bottom CTA "⚡ RÉSERVER MAINTENANT — X CHF" in #E8C89A

**User-visible outcome:** The entire NEXUS app displays a cohesive premium dark UI with gold accents, smooth animations, polished typography, and a consistent mobile navigation experience across all screens.
