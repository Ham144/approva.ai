# Technical Analysis & Content Specification: Interactive Legal & Security Modals (`LegalModal.jsx`)

**Milestone**: M2 (Interactive Legal & Security Modals)  
**Agent**: M2 Explorer 2 (Legal Content & Security Specifications Explorer)  
**Target Component**: `frontend/src/components/LegalModal.jsx`  
**Integration Target**: `frontend/src/pages/LandingPage.jsx`  
**Date**: 2026-08-10  

---

## 1. Executive Summary

This report provides complete, production-ready content specifications, UI architecture, and implementation guidelines for Requirement 2 (R2): **Interactive Legal & Security Whitepaper Modals**.

The footer of Approva.ai currently displays 3 links (`Privacy Policy`, `Terms of License`, `Security Whitepaper`) as static `href="#"` elements. By replacing these links with click triggers opening `LegalModal.jsx`, enterprise clients can review formal compliance guarantees regarding On-Premise data sovereignty, perpetual licensing, military-grade TLS 1.3 / AES-256 encryption, SHA-256 digital signatures, and immutable append-only audit logs.

---

## 2. Component Architecture (`LegalModal.jsx`)

### 2.1 Interface & State Contract

```typescript
interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'whitepaper';
}
```

- **Props**:
  - `isOpen`: Boolean controlling modal visibility.
  - `onClose`: Function to close the modal (resets state and hides modal).
  - `initialTab`: Active tab when modal opens (defaults to `'privacy'`).
- **Internal State**:
  - `activeTab`: Local React state initialized from `initialTab`, controlled via tab navigation buttons (`'privacy'`, `'terms'`, `'whitepaper'`).
- **Accessibility & UX**:
  - `Escape` key listener attached to `window` for keyboard dismissal.
  - Outer backdrop overlay click handler.
  - Scroll lock on body content when modal is active (`max-h-[85vh]` overflow handling).

---

## 3. Complete Tab Content Specifications

### 3.1 Tab 1: Privacy Policy (`privacy`)

* **Header Title**: Kebijakan Privasi & Kedaulatan Data Enterprise
* **Header Subtitle**: Komitmen Approva.ai Terhadap Keamanan, Kerahasiaan, dan Hak Akses Data Korporasi
* **Icon Header**: `<ShieldCheck className="w-6 h-6 text-emerald-400" />`
* **Badge**: `100% ON-PREMISE DATA SOVEREIGNTY`

#### Detailed Content Sections:

1. **Kedaulatan Data 100% On-Premise (Data Sovereignty)**
   * **Deskripsi**: Seluruh basis data, formulir digital, berkas lampiran, dan histori transaksi otorisasi disimpan 100% di dalam infrastruktur jaringan internal (On-Premise) atau Private Cloud milik perusahaan Anda. Approva.ai **tidak pernah** menyimpan, menduplikasi, atau mengalirkan data perusahaan ke server cloud eksternal vendor.
   * **Key Point**: "Data Anda Sepenuhnya Milik Perusahaan Anda — Tanpa Pihak Ketiga."

2. **Kontrol Akses Berbasis Peran Ketat (Role-Based Access Control / RBAC)**
   * **Deskripsi**: Akses terhadap dokumen dan persetujuan diatur secara granular menggunakan arsitektur Role-Based Access Control (RBAC). Setiap pengguna hanya memiliki akses sesuai dengan matriks hierarki jabatan, departemen, dan tingkat otorisasi yang telah disetujui.
   * **Key Point**: "Otorisasi Bertingkat & Akses Granular Per Departemen."

3. **Bebas Telemetri & Analitik Eksternal (Zero External Telemetry)**
   * **Deskripsi**: Platform Approva.ai bebas 100% dari kode telemetri, skrip analitik, atau pengacak pelacak eksternal (seperti Google Analytics, Meta Pixel, atau Mixpanel). Tidak ada kebocoran data keluar (*Zero Outbound Data Leakage*) dari lingkungan eksekusi aplikasi.
   * **Key Point**: "Nol Outbound Connection & Nol Pelacak Pihak Ketiga."

4. **Privasi Sesi & Cookie Terisolasi (Session Cookie Privacy)**
   * **Deskripsi**: Cookie yang digunakan oleh platform terbatas strictly pada enkapsulasi sesi otentikasi bertanda tangan digital (`HTTP-Only`, `SameSite=Strict`, `Secure`). Tidak ada cookie pelacak lintas situs (*cross-site tracking cookies*) maupun profil perilaku pengguna.
   * **Key Point**: "Cookie Terenkripsi Hanya Untuk Sesi Otentikasi Aktif."

---

### 3.2 Tab 2: Terms of License (`terms`)

* **Header Title**: Syarat & Ketentuan Lisensi Enterprise
* **Header Subtitle**: Model Lisensi Beli Putus (Perpetual Buyout Model) Tanpa Biaya Berlangganan
* **Icon Header**: `<FileText className="w-6 h-6 text-cyan-400" />`
* **Badge**: `PERPETUAL BUYOUT MODEL (LISENSI BELI PUTUS)`

#### Detailed Content Sections:

1. **Model Lisensi Beli Putus (Perpetual Buyout Model)**
   * **Deskripsi**: Approva.ai memberikan hak pemakaian platform secara permanen (*Perpetual Ownership*) melalui satu kali pembayaran lisensi beli putus. Perusahaan Anda memiliki hak penuh untuk menjalankan platform selamanya tanpa batasan tenggat lisensi.
   * **Key Point**: "Sekali Bayar, Hak Milik & Pemakaian Selamanya (Lifetime Rights)."

2. **Bebas Biaya Per-Seat & Berlangganan (Zero Seat & Subscription Fees)**
   * **Deskripsi**: Tidak ada biaya bulanan/tahunan per pengguna (*Zero Per-Seat / Per-User Monthly Fee*) dan tidak ada biaya langganan berulang (*Zero Recurring Subscription*). Organisasi Anda bebas menambahkan pengguna, manajer, dan alur approval tanpa batasan kuota.
   * **Key Point**: "Pengguna & Alur Kerja Tanpa Batas Tanpa Tambahan Biaya."

3. **Hak Deployment Infrastruktur Mandiri (Deployment Rights)**
   * **Deskripsi**: Lisensi memberikan hak penuh untuk melakukan instalasi dan pemeliharaan platform pada server fisik internal (*Bare Metal*), Virtual Machine (*VMware/Hyper-V*), atau container cluster (*Docker/Kubernetes*) di data center korporasi.
   * **Key Point**: "Fleksibilitas Instalasi Pada Data Center Internal Korporasi."

4. **Pemeliharaan & Support Tahunan Opsional (Optional Annual Maintenance Contract - AMC)**
   * **Deskripsi**: Layanan Pemeliharaan Tahunan (*Annual Maintenance Contract - AMC* ~10% per tahun) bersifat opsional. AMC mencakup pembaruan versi (major/minor features), patch keamanan berkala, dan dukungan teknis prioritas L3 dengan SLA 24/7. Platform tetap beroperasi normal meskipun AMC tidak diperpanjang.
   * **Key Point**: "AMC Opsional (~10%/Tahun) Tanpa Penghentian Sistem."

---

### 3.3 Tab 3: Security Whitepaper (`whitepaper`)

* **Header Title**: Whitepaper Keamanan & Arsitektur Kriptografi
* **Header Subtitle**: Standar Keamanan Enkripsi TLS 1.3 / AES-256, SHA-256 Digital Digest, & Immutable Audit Trail
* **Icon Header**: `<Lock className="w-6 h-6 text-blue-400" />`
* **Badge**: `MILITARY-GRADE SECURITY & COMPLIANCE READY`

#### Detailed Content Sections:

1. **Enkripsi In-Transit & At-Rest Standar Industri (TLS 1.3 & AES-256-GCM)**
   * **Deskripsi**: Seluruh komunikasi data antar modul menggunakan transmisi terenkripsi TLS 1.3 mTLS (*Data In-Transit*). Seluruh data sensitif dan berkas lampiran yang tersimpan di disk dienkripsi menggunakan standar AES-256-GCM (*Data At-Rest*) untuk mencegah ekstraksi fisik storage.
   * **Key Point**: "Proteksi Enkripsi Ganda Pada Jaringan dan Media Penyimpanan."

2. **Kedaulatan Kunci Kriptografi Mandiri (Data Sovereignty)**
   * **Deskripsi**: Kunci enkripsi (*KMS Keys*) dan sertifikat digital sepenuhnya dikelola di lingkungan server internal perusahaan tanpa ketergantungan pada API atau kunci enkripsi pihak ketiga (*No Vendor Lock-in*).
   * **Key Point**: "Manajemen Kunci Kriptografi Mandiri di Server Terlindung."

3. **Sidik Jari Digital Digest SHA-256 (SHA-256 Digital Signature Digest)**
   * **Deskripsi**: Setiap keputusan persetujuan dan pembuatan formulir secara otomatis menghasilkan nilai hash unik SHA-256 (*Cryptographic Fingerprint*) untuk menjamin keaslian berkas.
   * **Verbatim SHA-256 Digest Verification Code Stamp**:
     ```text
     e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
     ```
   * **Key Point**: "Verifikasi Otensitas Dokumen Berbasis Hashing SHA-256 Standard."

4. **Ketahanan Proteksi Anti-Manipulasi (Tamper Resistance)**
   * **Deskripsi**: Sistem proteksi nirkertas Approva.ai dilengkapi pemeriksaan integritas otomatis. Perubahan sekecil 1 bit pada isi formulir atau metadata akan secara otomatis membatalkan tanda tangan digital dan memunculkan peringatan manipulasi (*Tamper Detection Alert*).
   * **Key Point**: "Deteksi Otomatis Perubahan Berkas & Proteksi Anti-Injeksi."

5. **Log Audit Nir-Ubah Append-Only (Immutable Append-Only Audit Log)**
   * **Deskripsi**: Rekaman histori approval dan aktivitas pengguna dicatat ke dalam struktur log *append-only* yang bersifat *immutable* (tidak dapat diubah, diedit, atau dihapus oleh siapapun, termasuk administrator). Arsitektur ini dirancang penuh untuk memenuhi kepatuhan audit **ISO/IEC 27001** dan **SOC 2 Type II**.
   * **Key Point**: "Jejak Audit Nir-Ubah Siap Kepatuhan Sertifikasi ISO 27001 & SOC 2."

---

## 4. Proposed React Component Implementation

```jsx
// src/components/LegalModal.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  FileText,
  Lock,
  Server,
  KeyRound,
  EyeOff,
  Cookie,
  CheckCircle2,
  Cpu,
  Layers,
  Wrench,
  ShieldAlert,
  Hash,
  Database,
  Check,
} from "lucide-react";

const LegalModal = ({ isOpen, onClose, initialTab = "privacy" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn text-slate-100">
      {/* Outer click backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card Container */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0a0f1d] border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto z-10">
        
        {/* Header & Close Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              {activeTab === "privacy" && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
              {activeTab === "terms" && <FileText className="w-6 h-6 text-cyan-400" />}
              {activeTab === "whitepaper" && <Lock className="w-6 h-6 text-blue-400" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {activeTab === "privacy" && "Kebijakan Privasi & Kedaulatan Data"}
                {activeTab === "terms" && "Syarat & Ketentuan Lisensi Enterprise"}
                {activeTab === "whitepaper" && "Whitepaper Keamanan & Kriptografi"}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Approva.ai Official Compliance &amp; Security Specifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === "privacy"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Privacy Policy</span>
            <span className="sm:hidden">Privacy</span>
          </button>

          <button
            onClick={() => setActiveTab("terms")}
            className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === "terms"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Terms of License</span>
            <span className="sm:hidden">Terms</span>
          </button>

          <button
            onClick={() => setActiveTab("whitepaper")}
            className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === "whitepaper"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Lock className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Security Whitepaper</span>
            <span className="sm:hidden">Whitepaper</span>
          </button>
        </div>

        {/* Tab 1 Content: Privacy Policy */}
        {activeTab === "privacy" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400">
                STATUS KEPATUHAN: 100% ON-PREMISE DATA SOVEREIGNTY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Server className="w-4 h-4" />
                  <span>Kedaulatan Data 100% On-Premise</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Seluruh data transaksi, lampiran dokumen, dan kredensial pengguna disimpan 100% di server/cloud internal perusahaan Anda. Tidak ada data yang pernah keluar ke server eksternal milik vendor.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <KeyRound className="w-4 h-4" />
                  <span>Kontrol Akses Berbasis Peran (RBAC)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Persetujuan dan visibilitas dokumen diatur secara ketat berdasarkan hirarki matriks jabatan. Hanya personel berwenang yang dapat melihat dan menyetujui formulir.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <EyeOff className="w-4 h-4" />
                  <span>Zero External Telemetry</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sistem bersih 100% dari Google Analytics, Meta Pixel, atau tracker pihak ketiga. Nol pengumpulan data telemetri penggunaan ke server publik.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Cookie className="w-4 h-4" />
                  <span>Session Cookie Privacy</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cookie hanya digunakan untuk enkapsulasi sesi otentikasi aktif (HTTP-Only, Secure, SameSite=Strict). Bebas dari pelacak lintas situs (cross-site tracking).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 Content: Terms of License */}
        {activeTab === "terms" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400">
                MODEL LISENSI: PERPETUAL BUYOUT (BELI PUTUS)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                LIFETIME LICENSE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Model Beli Putus (Perpetual)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sekali bayar untuk hak pemakaian penuh selamanya (lifetime license). Tanpa risiko penghentian akses atau penguncian lisensi berkala.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Cpu className="w-4 h-4" />
                  <span>Zero Subscription &amp; Seat Fees</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bebas biaya bulanan/tahunan per pengguna. Tambahkan pengguna, departemen, dan alur approval sebanyak mungkin tanpa biaya tambahan per seat.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Layers className="w-4 h-4" />
                  <span>Deployment Rights Penuh</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Hak penuh untuk instalasi di infrastruktur milik perusahaan: Bare Metal, Private Cloud, VMware/Hyper-V, atau Kubernetes Cluster internal.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Wrench className="w-4 h-4" />
                  <span>AMC Tahunan Opsional (~10%)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dukungan perawatan tahunan (AMC ~10%/tahun) bersifat opsional untuk pembaruan fitur &amp; SLA support L3. Platform tetap aktif walau AMC tidak diperpanjang.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3 Content: Security Whitepaper */}
        {activeTab === "whitepaper" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-400">
                STANDAR KEAMANAN: TLS 1.3 / AES-256 / SHA-256 / IMMUTABLE AUDIT
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-mono border border-blue-500/20">
                MILITARY GRADE
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Enkripsi TLS 1.3 &amp; AES-256-GCM</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Data in-transit dilindungi saluran mTLS TLS 1.3. Data at-rest (database &amp; media penyimpanan) dienkripsi penuh menggunakan algoritma AES-256-GCM.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Database className="w-4 h-4" />
                    <span>Audit Log Nir-Ubah (Append-Only)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Jejak transaksi dicatat dalam log append-only immutable yang tidak dapat diubah/dihapus, siap mendukung kepatuhan sertifikasi ISO 27001 &amp; SOC 2.
                  </p>
                </div>
              </div>

              {/* Digital Signature SHA-256 Verification Stamp Card */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono uppercase tracking-wider">
                    <Hash className="w-4 h-4" />
                    <span>SHA-256 Digital Signature Digest Verification Stamp</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono">
                    TAMPER RESISTANT
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#070a11] border border-slate-800 font-mono text-xs text-cyan-300 break-all flex items-center justify-between gap-3">
                  <span>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Setiap dokumen persetujuan dikunci dengan sidik jari digital (cryptographic hash digest) di atas. Perubahan 1 bit data akan memicu peringatan manipulasi secara instan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
          <span className="font-mono text-[11px]">
            APPROVA.AI ENTERPRISE LEGAL &amp; SECURITY PLATFORM v2.0
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700"
          >
            Tutup Dialog
          </button>
        </div>

      </div>
    </div>
  );
};

export default LegalModal;
```

---

## 5. Wiring Instructions for `LandingPage.jsx`

In `frontend/src/pages/LandingPage.jsx`:

1. **Import `LegalModal`**:
   ```jsx
   import LegalModal from "../components/LegalModal";
   ```

2. **Add State for Legal Modal**:
   ```jsx
   const [legalModalState, setLegalModalState] = useState({
     isOpen: false,
     initialTab: "privacy",
   });

   const openLegalModal = (tab = "privacy") => {
     setLegalModalState({
       isOpen: true,
       initialTab: tab,
     });
   };

   const closeLegalModal = () => {
     setLegalModalState((prev) => ({ ...prev, isOpen: false }));
   };
   ```

3. **Update Footer Anchor Tags** (Lines 1144-1148 of `LandingPage.jsx`):
   *Replace*:
   ```jsx
   <div className="flex gap-6 font-mono text-[11px]">
     <a href="#" className="hover:text-slate-300">Privacy Policy</a>
     <a href="#" className="hover:text-slate-300">Terms of License</a>
     <a href="#" className="hover:text-slate-300">Security Whitepaper</a>
   </div>
   ```
   *With*:
   ```jsx
   <div className="flex gap-6 font-mono text-[11px]">
     <button
       onClick={() => openLegalModal("privacy")}
       className="hover:text-slate-300 transition-colors"
     >
       Privacy Policy
     </button>
     <button
       onClick={() => openLegalModal("terms")}
       className="hover:text-slate-300 transition-colors"
     >
       Terms of License
     </button>
     <button
       onClick={() => openLegalModal("whitepaper")}
       className="hover:text-slate-300 transition-colors"
     >
       Security Whitepaper
     </button>
   </div>
   ```

4. **Render `<LegalModal>`**:
   Place `<LegalModal>` right alongside `<RoiStatementModal>` or `<ModalConfirmation>` before the closing `</div>`:
   ```jsx
   <LegalModal
     isOpen={legalModalState.isOpen}
     onClose={closeLegalModal}
     initialTab={legalModalState.initialTab}
   />
   ```

---

## 6. Verification Steps

1. **Build Verification**:
   Execute Vite build in `frontend/`:
   ```powershell
   node node_modules/vite/bin/vite.js build
   ```
   *Expected Output*: Exit code 0, clean bundle generation in `dist/`.

2. **UI & Behavioral Verification**:
   - Click "Privacy Policy" in footer -> Modal opens with active "Privacy Policy" tab.
   - Click "Terms of License" in footer -> Modal opens with active "Terms of License" tab.
   - Click "Security Whitepaper" in footer -> Modal opens with active "Security Whitepaper" tab.
   - Switch tabs within modal using tab bar buttons -> Active tab switches instantly.
   - Press `Escape` or click close button / backdrop -> Modal closes cleanly.
   - Verify presence of SHA-256 digest `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` in Security Whitepaper tab.
