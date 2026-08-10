# Project: Approva.ai Frontend Optimization

## Architecture
- React 18 SPA built with Vite 5.4, Tailwind CSS 3.4, DaisyUI 4.12, Lucide React icons, Zustand state management, react-hot-toast notification infrastructure, and jsPDF / jspdf-autotable.
- Located in `C:\Users\USER\.gemini\antigravity\scratch\approva.ai\frontend`.
- Main page: `src/pages/LandingPage.jsx`.
- Components: `src/components/` (e.g. `RoiStatementModal.jsx`, `LegalModal.jsx`, `ModalConfirmation.jsx`, `ModalShowTips.jsx`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | R1. ROI Financial Statement Export | Add print/export button in ROI section, modal layout formatting, and jsPDF/window.print() functionality for IDR & Managerial Hours savings | M1 | survey |
| 2 | R2. Interactive Legal & Security Modals | Add interactive modal dialogs for Privacy Policy, Terms of License, and Security Whitepaper (On-Premise encryption, data sovereignty, SHA-256 digital signature, audit log) linked from footer | M2 | survey |
| 3 | R3. Micro-Interactions & Active Scroll Nav | Active scroll indicator on header nav + progress bar, copy-to-clipboard in Stranger Mode Public Link with toast notification "Link Berhasil Disalin!", and responsive feedback animations | M3 | survey |
| 4 | E2E. E2E Test Suite Creation | Opaque-box test suite for features R1, R2, R3 (Tiers 1-4) | E2E | survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | ROI Financial Exporter | ROI Exporter button, RoiStatementModal, window.print(), jsPDF export | none | DONE |
| M2 | Legal & Security Modals | LegalModal component (3 tabs: Privacy, Terms, Whitepaper), footer links wiring | none | IN_PROGRESS |
| M3 | Nav & Micro-Interactions | Active scroll nav & progress bar, Stranger Mode link copy & toast, UI micro-animations | none | PLANNED |
| M4 | Final Integration & E2E Verification | 100% E2E test pass + Tier 5 white-box coverage hardening | M1, M2, M3, E2E | PLANNED |

## Interface Contracts
### LandingPage.jsx ↔ RoiStatementModal.jsx
- Props: `isOpen` (boolean), `onClose` (function), `employeeCount` (number), `avgApprovalTimeDays` (number), `monthlySavingsRp` (number), `monthlyApprovalCount` (number), `totalHoursSaved` (number).
- Functions: `handlePrint()` (invokes `window.print()`), `handleExportPdf()` (invokes `jsPDF` / `jspdf-autotable`).

### LandingPage.jsx ↔ LegalModal.jsx
- Props: `isOpen` (boolean), `onClose` (function), `initialTab` ('privacy' | 'terms' | 'whitepaper').
- Tabs:
  - `privacy`: On-Premise data sovereignty, RBAC, zero external telemetry, session cookie privacy.
  - `terms`: Perpetual buyout model ("Lisensi Beli Putus"), zero seat/subscription fees, deployment rights, AMC optional.
  - `whitepaper`: On-Premise TLS 1.3 / AES-256 encryption, data sovereignty, SHA-256 digital signature digest (`e3b0c44...`), immutable audit log.

### LandingPage.jsx ↔ Clipboard & Toast
- Function: `handleCopyPublicLink()` copies `https://approva.ai/p/PT-Semen-Indonesia-reimburse` to clipboard via `navigator.clipboard.writeText` and calls `toast.success("Link Berhasil Disalin!")`.

## Code Layout
- `frontend/src/pages/LandingPage.jsx`: Main landing page, navigation, hero, features, canvas hub, scenarios (stranger mode copy link), roi calculator, faq, license, footer links.
- `frontend/src/components/RoiStatementModal.jsx`: Executive financial summary modal & print/pdf generator for ROI calculator.
- `frontend/src/components/LegalModal.jsx`: Interactive legal & security whitepaper modal dialog.
- `frontend/src/App.jsx`: Main React entry rendering `<Toaster />` and route setup.
- `frontend/dist`: Output of `vite build`.
