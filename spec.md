# Specification

## Summary
**Goal:** Apply a comprehensive set of UI corrections to the NEXUS app (v6.0 patch), covering icon replacement, color palette cleanup, component redesigns, and interaction fixes across both pro and client interfaces.

**Planned changes:**
- Replace all emoji characters throughout the UI with inline SVG icons (stroke 1.5px, currentColor, 16px default) — including tab bars, section titles, radar buttons, and subscription modal bullets
- Change "Me Rendre Visible" button label to "Activer mon profil"; restrict confetti particles to color #F2D06B only
- Implement a 2×2 photo upload grid in MonBusiness gallery with file picker, live counter "X/4 photos", gold progress bar, and "Minimum atteint ✓" indicator at 3+ photos
- Build the complete subscription activation flow in ProSubscriptionModal: fullscreen modal with email input, animated top progress bar, success overlay with green check circle and gold confetti, navigation to Pro Dashboard after 2500ms, and proActif/essaiJours state; Pro Dashboard shows "ESSAI GRATUIT · J1/7" badge; Flash toggle defaults ON when proActif is true; "Voir mon profil public" navigates to Explorer with the pro profile at position 1
- Simplify color palette: Explorer cards use #0D0D13 background (remove violet/bordeaux tints); Wallet card uses neutral dark gradient with subtle gold border; bar chart inactive bars #1C1C26 and active bar #F2D06B (no gradients); both tab bars use rgba(5,5,7,0.96) with backdrop-blur, gold 2px top indicator on active tab, no colored background on active tab
- Redesign Explorer professional cards as a full-width vertical list (80px height, flex layout, 44px avatar circle, flash response time in #00D97A, SVG star rating, price in #F2D06B)
- Update WalletPro: add "Libéré dans 48h après prestation" text below escrow amount; disable transfer button showing "Virement initié" for 30s after tap; show 5s toast with #00D97A left border
- Redesign RoleSelection screen with 2 full-width 96px cards (no emoji, no iOS icons), SVG arrow right, blue highlight for Client card, gold highlight for Professional card on tap
- Audit and enforce all #F2D06B background buttons to use #050507 text color — no gold-on-gold combinations anywhere in the app

**User-visible outcome:** The NEXUS app displays a fully consistent, emoji-free UI with refined colors, functional photo upload in MonBusiness, a complete subscription activation flow, redesigned Explorer list cards, improved Wallet interactions, and a cleaner role selection screen.
