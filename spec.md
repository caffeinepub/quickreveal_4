# Specification

## Summary
**Goal:** Add a new self-contained `ProApp.tsx` component for the professional space and wire it into the role selection screen.

**Planned changes:**
- Create `frontend/src/components/ProApp.tsx` as a fully standalone React component with `useState`-based navigation (no React Router)
- Include Dashboard, Radar, Wallet, and Business tabs inside `ProApp.tsx`, along with a Subscription Modal and Subscription Success animation screen
- Define a color constants object `C` inside `ProApp.tsx` with `t4: '#2E2E3E'`, used for `IconCamera` fill and all subtle/discrete UI elements (inactive icons, dividers, placeholder text, secondary backgrounds)
- Update `RoleSelection.tsx` (or `RoleSelectionV2.tsx`, whichever is active) to render `<ProApp />` when the user selects the "Professionnel" role, replacing the previously broken pro component

**User-visible outcome:** Selecting "Professionnel" on the role selection screen now opens a fully functional professional space with Dashboard, Radar, Wallet, and Business tabs, subscription flow, and consistent subtle styling — without affecting the existing client navigation flow.
