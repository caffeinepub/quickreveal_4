# Specification

## Summary
**Goal:** Implement complete NEXUS OS professional space with authentication, multi-tab dashboard (RADAR, WALLET, PORTFOLIO, AGENDA), 4-step studio builder workflow with subscription, and integration with client-side Explorer.

**Planned changes:**
- Add ProLogin screen with hardcoded authentication (pro@nexus.ch / nexus2025)
- Create NexusOS dashboard with 4 tabs: RADAR (incoming bookings), WALLET (balance & transactions), PORTFOLIO (studio management), AGENDA (availability calendar)
- Implement 4-step Builder workflow: artist info, logistics (mobile/studio with GPS), services with dual pricing, availability schedule
- Add subscription screen with free first month offer (199 CHF/an) that publishes studio
- Integrate published studios into Explorer with full searchability and geolocation filtering
- Add clickable NEXUS logo navigation to Splash throughout app
- Filter blocked time slots from client booking flow based on pro's AGENDA configuration
- Disable past dates and elapsed time slots in BookingDate component
- Fix AU STUDIO availability bug to check for configured studio address
- Implement '📍 Autour de moi' geolocation filter with Haversine distance calculation
- Extend AppContext with Builder/subscription screen states, pro session, and enhanced provider data structure
- Update App.tsx router to support new screens with slide transitions

**User-visible outcome:** Professionals can log into NEXUS OS, create and publish their studio with services and pricing, manage incoming booking requests, view wallet balance, and configure their weekly availability calendar. Published studios appear in the Explorer for clients to discover and book, with geolocation-based distance filtering. Past time slots are properly disabled, and the AU STUDIO option works correctly when configured.
