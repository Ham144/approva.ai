# Technical Analysis & Component Architecture Report: `LegalModal.jsx` (R2)

**Explorer**: M2 Explorer 1 (LegalModal Architecture Explorer)  
**Milestone**: M2 - Interactive Legal & Security Modals  
**Target Files**: `frontend/src/components/LegalModal.jsx`, `frontend/src/pages/LandingPage.jsx`  
**Date**: 2026-08-10  

---

## 1. Executive Summary

This report establishes the complete architectural design, component interface, tab navigation system, close controls, backdrop blur overlay styling, and content specifications for `LegalModal.jsx`. 

The modal provides interactive, high-trust documentation for Approva.ai's enterprise prospects across three core pillars:
1. **Privacy Policy**: 100% On-Premise Data Sovereignty, zero external telemetry, RBAC data isolation.
2. **Terms of License**: Perpetual buyout model ("Lisensi Beli Putus"), unlimited user seats, zero subscription lock-in, optional annual maintenance (AMC ~10%/year).
3. **Security Whitepaper**: On-Premise TLS 1.3 & AES-256 encryption, SHA-256 digital signature digests (`e3b0c44...`), immutable append-only audit trail, and ISO 27001 / SOC 2 / UU PDP compliance.

---

## 2. Component Interface & Props Contract

### Component Signature
```jsx
import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  X, 
  Server, 
  CheckCircle2, 
  Award, 
  FileCode, 
  EyeOff, 
  Key, 
  Scale 
} from "lucide-react";

const LegalModal = ({
  isOpen = false,
  onClose = () => {},
  initialTab = "privacy", // 'privacy' | 'terms' | 'whitepaper'
}) => { ... }
```

### Props Specifications
| Prop Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `isOpen` | `boolean` | Yes | `false` | Controls modal visibility. If `false`, component returns `null`. |
| `onClose` | `function` | Yes | `() => {}` | Callback function triggered to close modal and reset parent state. |
| `initialTab` | `'privacy' \| 'terms' \| 'whitepaper'` | No | `'privacy'` | Sets the active tab when modal opens. |

---

## 3. Tab Switching Interface Design

### State Synchronization
Internal state `activeTab` tracks current active tab:
```jsx
const [activeTab, setActiveTab] = useState(initialTab);

useEffect(() => {
  if (isOpen) {
    setActiveTab(initialTab || "privacy");
  }
}, [isOpen, initialTab]);
```

### Tab Bar Layout & Styling
The tab navigation bar uses a pill/segmented control design matching Approva's dark enterprise aesthetic:
```jsx
<div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
  <button
    onClick={() => setActiveTab("privacy")}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
      activeTab === "privacy"
        ? "bg-blue-600/20 text-cyan-300 border border-blue-500/50 shadow-md shadow-blue-500/10"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
    }`}
  >
    <ShieldCheck className="w-4 h-4 text-cyan-400" />
    <span>Privacy Policy</span>
  </button>

  <button
    onClick={() => setActiveTab("terms")}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
      activeTab === "terms"
        ? "bg-blue-600/20 text-cyan-300 border border-blue-500/50 shadow-md shadow-blue-500/10"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
    }`}
  >
    <Scale className="w-4 h-4 text-cyan-400" />
    <span>Terms of License</span>
  </button>

  <button
    onClick={() => setActiveTab("whitepaper")}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
      activeTab === "whitepaper"
        ? "bg-blue-600/20 text-cyan-300 border border-blue-500/50 shadow-md shadow-blue-500/10"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
    }`}
  >
    <Lock className="w-4 h-4 text-cyan-400" />
    <span>Security Whitepaper</span>
  </button>
</div>
```

---

## 4. Backdrop Blur Overlay & Close Controls

### 1. Outer Backdrop & Container Styling
Matches existing `RoiStatementModal.jsx` and `LandingPage.jsx` booking modal patterns:
```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
```

### 2. ESC Key Event Listener
```jsx
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape" && isOpen) {
      onClose();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [isOpen, onClose]);
```

### 3. Backdrop Click Handler
Dedicated background click capture layer:
```jsx
<div
  className="fixed inset-0 z-0"
  onClick={onClose}
  aria-hidden="true"
/>
```
And modal dialog content layer with relative z-index:
```jsx
<div className="relative z-10 w-full max-w-4xl rounded-2xl bg-[#0a0f1d] border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-slate-100">
```

### 4. Close Button Header
Top-right explicit close button with hover state:
```jsx
<button
  onClick={onClose}
  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
  aria-label="Close Modal"
>
  <X className="w-5 h-5" />
</button>
```

---

## 5. Detailed Tab Content Architecture

### Tab 1: Privacy Policy (`privacy`)
- **Header**: Banner with `ShieldCheck` icon, title "Kebijakan Privasi & Kedaulatan Data Enterprise".
- **Key Sections**:
  1. **100% On-Premise Data Sovereignty**: All form submissions, approval workflows, attachments, employee directories, and audit logs remain strictly within customer private cloud / self-hosted servers. Zero data transmitted to Approva external servers.
  2. **Zero External Telemetry & Tracking**: Zero third-party analytics scripts, no external cookies, no marketing trackers. Full compliance with strict banking & BUMN IT security guidelines.
  3. **Role-Based Access Control (RBAC)**: Fine-grained access control ensuring approval data is strictly accessible only to authorized workflow participants and designated internal administrators.
  4. **Session Cookie Isolation**: HttpOnly, SameSite=Strict session tokens storing zero PII in client browser.

### Tab 2: Terms of License (`terms`)
- **Header**: Banner with `Scale` icon, title "Syarat & Ketentuan Lisensi Enterprise (Beli Putus)".
- **Key Sections**:
  1. **Perpetual Buyout License ("Lisensi Beli Putus")**: Single upfront software license buyout granting perpetual, indefinite rights to host and execute Approva.ai without recurring seat or monthly subscription fees.
  2. **Unlimited User Seats & Dynamic Workflows**: Zero artificial caps on user seat counts, department channels, form templates, or approval workflow instances.
  3. **Deployment Freedom**: Perpetual authorization for installation on customer bare-metal servers, private cloud instances (AWS/GCP/Azure tenant), or air-gapped internal Docker/K8s clusters.
  4. **Optional Annual Maintenance Contract (AMC)**: Maintenance contract at ~10% annual fee covering priority SLA support, core engine security patches, and major feature updates.

### Tab 3: Security Whitepaper (`whitepaper`)
- **Header**: Banner with `Lock` icon, title "Whitepaper Keamanan & Arsitektur Kriptografi".
- **Key Sections**:
  1. **On-Premise TLS 1.3 & AES-256 Encryption**: Encrypted in-transit communication via TLS 1.3 and military-grade AES-256 bit encryption for attachment storage and database fields at rest.
  2. **SHA-256 Digital Signature Digest**: Every approval action generates a cryptographic SHA-256 digest (sample signature hash: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`) ensuring absolute non-repudiation and document integrity.
  3. **Immutable Append-Only Audit Trail**: Tamper-proof event logs capturing timestamp, user ID, IP address, device fingerprint, digital signature, and approval status changes.
  4. **Regulatory & Audit Readiness**: Architecture aligned with ISO 27001, SOC 2 Type II controls, and Indonesia Data Protection Law (UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi / PDP).

---

## 6. Wiring Specification in `LandingPage.jsx`

### 1. State Declaration
In `LandingPage.jsx`:
```jsx
const [legalModal, setLegalModal] = useState({
  isOpen: false,
  initialTab: 'privacy'
});

const openLegalModal = (tab = 'privacy') => {
  setLegalModal({ isOpen: true, initialTab: tab });
};

const closeLegalModal = () => {
  setLegalModal((prev) => ({ ...prev, isOpen: false }));
};
```

### 2. Footer Links Update
In `LandingPage.jsx` footer (lines 1144–1148):
```jsx
{/* ENTERPRISE FOOTER */}
<footer className="border-t border-slate-800 bg-[#070a11] py-12 px-6 sm:px-12 text-xs text-slate-500 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
  <div className="flex items-center gap-3">
    <img
      src="/logo.png"
      alt="Approva Official Logo"
      className="w-6 h-6 object-contain"
    />
    <span className="font-bold text-white text-sm">Approva.ai</span>
    <span>© 2026 Enterprise Dynamic E-Form & Approval Control Platform.</span>
  </div>
  <div className="flex gap-6 font-mono text-[11px]">
    <button
      onClick={() => openLegalModal("privacy")}
      className="hover:text-slate-300 transition-colors focus:outline-none"
    >
      Privacy Policy
    </button>
    <button
      onClick={() => openLegalModal("terms")}
      className="hover:text-slate-300 transition-colors focus:outline-none"
    >
      Terms of License
    </button>
    <button
      onClick={() => openLegalModal("whitepaper")}
      className="hover:text-slate-300 transition-colors focus:outline-none"
    >
      Security Whitepaper
    </button>
  </div>
</footer>
```

### 3. Modal Rendering Insertion
Near bottom of `LandingPage.jsx` render return statement:
```jsx
<LegalModal
  isOpen={legalModal.isOpen}
  onClose={closeLegalModal}
  initialTab={legalModal.initialTab}
/>
```

---

## 7. Verification & Build Readiness

- **Component Creation**: File path `frontend/src/components/LegalModal.jsx`.
- **Imports**: standard `lucide-react` icons (all present in existing `frontend/package.json`).
- **Build Command Verification**: `node node_modules/vite/bin/vite.js build` in `frontend/` directory compiles with exit code 0.
