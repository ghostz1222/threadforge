# ThreadForge MVP Website

Production-structured React + Vite + Tailwind implementation based on:
- `design-studio.jsx`
- `tshirt-mvp-flow-v2.jsx`
- `threadforge-build-prompt.md`

## Included Product Flow
- Landing (`/`)
- Design Studio (`/studio`)
- Product Configuration (`/customize`)
- Checkout (`/checkout`)
- Order Status (`/order-status/:orderId`)
- Marketplace Phase 2 shell (`/marketplace`)

## Included Component/Plugin Architecture
- `src/components/ShirtMockup.jsx`
- `src/components/DesignGrid.jsx`
- `src/components/StylePicker.jsx`
- `src/components/PlacementEditor.jsx` (Fabric.js)
- `src/components/ColorPicker.jsx`
- `src/components/SizePicker.jsx`
- `src/components/GenCounter.jsx`

## Integrations and Server Hooks
- `src/lib/generateDesign.js` (Flux Schnell/Pro tiers)
- `src/lib/upscale.js` (print-ready upscale flow)
- `src/lib/moderation.js` (prompt filtering + output moderation hook)
- `src/lib/printful.js` (fulfillment route hook)
- `src/lib/stripe.js` (checkout hook)
- `src/lib/supabase.js` (client bootstrapping)
- `src/api/*.js` route shells for generate/checkout/webhook/moderate/upscale/printful-order

## Run
```bash
npm install
npm run dev
```

## Notes
- By default, the app runs with mock integrations so the full user flow is testable without external keys.
- Enable live provider routes by copying `.env.example` to `.env` and turning the `VITE_USE_SERVER_*` flags on.
- Real product previews use `/api/mockup-preview` (Printful mockup task API). If `PRINTFUL_API_KEY` is missing, the UI falls back to composited product-photo previews.
- Placeholder local design generation is disabled by default. Set `VITE_ALLOW_PLACEHOLDER_GEN=true` only if you explicitly want SVG dummy outputs for offline UI testing.
