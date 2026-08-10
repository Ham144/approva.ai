## 2026-08-10T08:39:33Z
You are the Worker for Milestone M2 (Interactive Legal & Security Modals).

Your Working Directory: C:\Users\USER\.gemini\antigravity\scratch\approva.ai\.agents\teamwork_preview_worker_m2
Project Root: C:\Users\USER\.gemini\antigravity\scratch\approva.ai
Original Request File: C:\Users\USER\.gemini\antigravity\scratch\approva.ai\.agents\ORIGINAL_REQUEST.md
Project File: C:\Users\USER\.gemini\antigravity\scratch\approva.ai\PROJECT.md

Explorer handoffs to review:
1. `C:\Users\USER\.gemini\antigravity\scratch\approva.ai\.agents\teamwork_preview_explorer_m2_i1_1\handoff.md`
2. `C:\Users\USER\.gemini\antigravity\scratch\approva.ai\.agents\teamwork_preview_explorer_m2_i1_2\handoff.md`
3. `C:\Users\USER\.gemini\antigravity\scratch\approva.ai\.agents\teamwork_preview_explorer_m2_i1_3\handoff.md`

Tasks:
1. Implement `frontend/src/components/LegalModal.jsx`:
   - Interactive dialog component with 3 tabs: Privacy Policy (`privacy`), Terms of License (`terms`), Security Whitepaper (`whitepaper`).
   - Detailed contents per specs:
     * Privacy Policy: On-Premise data sovereignty, RBAC control, zero external telemetry, session cookie privacy.
     * Terms of License: Perpetual buyout model ("Lisensi Beli Putus"), zero seat/subscription fees, deployment rights, optional annual maintenance (AMC ~10%/year).
     * Security Whitepaper: On-Premise TLS 1.3 / AES-256 encryption, data sovereignty, SHA-256 digital signature digest (`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`), tamper resistance, and immutable append-only audit log.
   - Fixed overlay backdrop blur styling (`fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn`).
   - Close controls: ESC key listener, backdrop click, close button (`<X />`).
2. Update `frontend/src/pages/LandingPage.jsx`:
   - Add `isLegalModalOpen` and `legalModalTab` states.
   - Update footer links (`Privacy Policy`, `Terms of License`, `Security Whitepaper`) to wire `onClick` handlers opening the respective tabs.
   - Render `<LegalModal isOpen={isLegalModalOpen} onClose={() => setIsLegalModalOpen(false)} initialTab={legalModalTab} />`.
3. Verify implementation:
   - Run Vite build command inside `frontend/`: `node node_modules/vite/bin/vite.js build` (or `pnpm run build`). Verify Exit Code 0.
   - Run E2E test runner: `node test/e2e_suite.js` inside `frontend/`. Verify all 38 tests pass.
