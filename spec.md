# Specification

## Summary
**Goal:** Fix and stabilize the Pro Space with persistent state via ProContext, refactor navigation to use useState (no React Router for tabs), replace gradient card backgrounds with real Unsplash images for pros and services, and apply various UI/UX corrections.

**Planned changes:**
- Create a global `ProContext` / `ProProvider` with `proActif`, `setProActif`, `proData`, and `setProData`; wrap all pro screens so state persists across tab navigation
- Refactor `ProLayout` to use `useState('dashboard')` for tab switching with conditional rendering of `RadarScreen`, `WalletScreen`, `DashboardScreen`, and `BusinessScreen` — no React Router
- Refactor `BusinessScreen` to use `useState('identite')` for 4 sub-tabs (Identite / Paiement / Services / Galerie) with conditional rendering and all data stored in ProContext
- Replace the photo upload in the Galerie sub-tab with a ref-based approach using 4 `useRef` file inputs, base64 via FileReader, image type/size validation (image/* only, max 10MB), and a remove button with `stopPropagation`
- Fix subscription flow: `SubscriptionSuccess` uses a 4500ms `useEffect` timer that calls `setProActif(true)` then `onSuccessComplete`, which calls `setActiveTab('dashboard')` in ProLayout — no route change
- Fix "Activer mon profil" button in Galerie to only require `photos.filter(Boolean).length >= 3`; IBAN not required in demo mode
- Replace colored gradient backgrounds on Explorer pro cards with real Unsplash images via `coverUrl` field on each demo pro entry (Studio Blade, Karim Cuts, Tom Barber, Elise Coiffure, Sarah Style, Nadia Beauty, Clara Nails, Zen by Marco)
- Apply mandatory dark gradient overlay (`rgba(5,5,7,0.1)` to `rgba(5,5,7,0.92)`) on all pro card images (Flash Live cards, Explorer list cards, Pro profile cover)
- Add Unsplash image URLs to all demo service data entries (Barber, Coiffure, Esthetique, Massage categories); display images on Explorer service cards and pro profile service lists
- Update Flash Live cards (168×228px) to use `<img>` with `objectFit:'cover'`, dark overlay, and gradient fallback on error
- Update Explorer list card avatars (44px circular) to display `coverUrl` as circular image, falling back to gradient + initials
- Update pro profile cover (270px) to display `coverUrl` full-width with `objectPosition:'top center'`, grain overlay at ~3% opacity, and dark gradient overlay
- Ensure "Commencer l'essai gratuit" button always has `background: #F2D06B` and `color: #050507` with no conditional gold-on-gold styling
- Verify Wallet 30-second cooldown (balance zeroed, button disabled with countdown) is not broken by the ProContext/ProLayout refactor
- Remove all emoji characters from pro-space components; use only SVG icon components or plain text labels

**User-visible outcome:** The Pro Space is fully stable — tabs and sub-tabs navigate without crashes or state resets, pro cards and service cards display real Unsplash photos with dark overlays, photo upload in Galerie works reliably, and profile activation requires only 3 uploaded photos regardless of IBAN.
