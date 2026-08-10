import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  FileText,
  Lock,
  Server,
  Key,
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
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn text-slate-100">
      {/* Outer backdrop click layer */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0a0f1d] border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto z-10">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              {activeTab === "privacy" && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
              {activeTab === "terms" && <FileText className="w-6 h-6 text-cyan-400" />}
              {activeTab === "whitepaper" && <Lock className="w-6 h-6 text-blue-400" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {activeTab === "privacy" && "Kebijakan Privasi & Kedaulatan Data"}
                {activeTab === "terms" && "Syarat & Ketentuan Lisensi Enterprise"}
                {activeTab === "whitepaper" && "Whitepaper Keamanan & Arsitektur Kriptografi"}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Approva.ai Official Compliance &amp; Security Specifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup Legal Modal"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("privacy")}
            className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === "privacy"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Privacy Policy</span>
            <span className="sm:hidden">Privacy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("terms")}
            className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === "terms"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Terms of License</span>
            <span className="sm:hidden">Terms</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("whitepaper")}
            className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === "whitepaper"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Lock className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Security Whitepaper</span>
            <span className="sm:hidden">Whitepaper</span>
          </button>
        </div>

        {/* Tab 1: Privacy Policy Content */}
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
                  Seluruh basis data, formulir digital, berkas lampiran, dan histori transaksi otorisasi disimpan 100% di dalam infrastruktur jaringan internal (On-Premise) atau Private Cloud milik perusahaan Anda. Approva.ai tidak pernah menyimpan, menduplikasi, atau mengalirkan data perusahaan ke server cloud eksternal vendor.
                </p>
                <div className="text-[11px] text-emerald-400 font-mono pt-1">
                  ✓ Data Sepenuhnya Milik Perusahaan — Tanpa Pihak Ketiga.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Key className="w-4 h-4" />
                  <span>Kontrol Akses Berbasis Peran (RBAC)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Akses terhadap dokumen dan persetujuan diatur secara granular menggunakan arsitektur Role-Based Access Control (RBAC). Setiap pengguna hanya memiliki akses sesuai dengan matriks hierarki jabatan, departemen, dan tingkat otorisasi yang telah disetujui.
                </p>
                <div className="text-[11px] text-cyan-400 font-mono pt-1">
                  ✓ Otorisasi Bertingkat &amp; Akses Granular Per Departemen.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <EyeOff className="w-4 h-4" />
                  <span>Zero External Telemetry</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Platform Approva.ai bebas 100% dari kode telemetri, skrip analitik, atau pengacak pelacak eksternal (seperti Google Analytics, Meta Pixel, atau Mixpanel). Tidak ada kebocoran data keluar (Zero Outbound Data Leakage) dari lingkungan eksekusi aplikasi.
                </p>
                <div className="text-[11px] text-blue-400 font-mono pt-1">
                  ✓ Nol Outbound Connection &amp; Nol Pelacak Pihak Ketiga.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Cookie className="w-4 h-4" />
                  <span>Session Cookie Privacy</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cookie yang digunakan oleh platform terbatas strictly pada enkapsulasi sesi otentikasi bertanda tangan digital (HTTP-Only, SameSite=Strict, Secure). Tidak ada cookie pelacak lintas situs (cross-site tracking cookies) maupun profil perilaku pengguna.
                </p>
                <div className="text-[11px] text-indigo-400 font-mono pt-1">
                  ✓ Cookie Terenkripsi Hanya Untuk Sesi Otentikasi Aktif.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Terms of License Content */}
        {activeTab === "terms" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400">
                MODEL LISENSI: PERPETUAL BUYOUT MODEL (LISENSI BELI PUTUS)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                LIFETIME LICENSE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Model Lisensi Beli Putus (Perpetual Buyout)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Approva.ai memberikan hak pemakaian platform secara permanen (Perpetual Ownership) melalui satu kali pembayaran lisensi beli putus. Perusahaan Anda memiliki hak penuh untuk menjalankan platform selamanya tanpa batasan tenggat lisensi.
                </p>
                <div className="text-[11px] text-cyan-400 font-mono pt-1">
                  ✓ Sekali Bayar, Hak Milik &amp; Pemakaian Selamanya.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Cpu className="w-4 h-4" />
                  <span>Bebas Biaya Per-Seat &amp; Berlangganan</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tidak ada biaya bulanan/tahunan per pengguna (Zero Per-Seat / Per-User Monthly Fee) dan tidak ada biaya langganan berulang (Zero Recurring Subscription). Organisasi Anda bebas menambahkan pengguna, manajer, dan alur approval tanpa batasan kuota.
                </p>
                <div className="text-[11px] text-emerald-400 font-mono pt-1">
                  ✓ Pengguna &amp; Alur Kerja Tanpa Batas Tanpa Tambahan Biaya.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Layers className="w-4 h-4" />
                  <span>Hak Deployment Infrastruktur Mandiri</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Lisensi memberikan hak penuh untuk melakukan instalasi dan pemeliharaan platform pada server fisik internal (Bare Metal), Virtual Machine (VMware/Hyper-V), atau container cluster (Docker/Kubernetes) di data center korporasi.
                </p>
                <div className="text-[11px] text-blue-400 font-mono pt-1">
                  ✓ Fleksibilitas Instalasi Pada Data Center Internal Korporasi.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Wrench className="w-4 h-4" />
                  <span>Pemeliharaan &amp; Support Tahunan Opsional (AMC)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Layanan Pemeliharaan Tahunan (Annual Maintenance Contract - AMC ~10%/tahun) bersifat opsional. AMC mencakup pembaruan versi (major/minor features), patch keamanan berkala, dan dukungan teknis prioritas L3 dengan SLA 24/7. Platform tetap beroperasi normal meskipun AMC tidak diperpanjang.
                </p>
                <div className="text-[11px] text-amber-400 font-mono pt-1">
                  ✓ AMC Opsional (~10%/Tahun) Tanpa Penghentian Sistem.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Security Whitepaper Content */}
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
                    Seluruh komunikasi data antar modul menggunakan transmisi terenkripsi TLS 1.3 mTLS (Data In-Transit). Seluruh data sensitif dan berkas lampiran yang tersimpan di disk dienkripsi menggunakan standar AES-256-GCM (Data At-Rest) untuk mencegah ekstraksi fisik storage.
                  </p>
                  <div className="text-[11px] text-blue-400 font-mono pt-1">
                    ✓ Proteksi Enkripsi Ganda Pada Jaringan dan Media Penyimpanan.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Database className="w-4 h-4" />
                    <span>Log Audit Nir-Ubah Append-Only (Immutable Audit Log)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Rekaman histori approval dan aktivitas pengguna dicatat ke dalam struktur log append-only yang bersifat immutable (tidak dapat diubah, diedit, atau dihapus oleh siapapun, termasuk administrator). Arsitektur ini dirancang penuh untuk memenuhi kepatuhan audit ISO/IEC 27001 dan SOC 2 Type II.
                  </p>
                  <div className="text-[11px] text-emerald-400 font-mono pt-1">
                    ✓ Jejak Audit Nir-Ubah Siap Kepatuhan Sertifikasi ISO 27001 &amp; SOC 2.
                  </div>
                </div>
              </div>

              {/* SHA-256 Digital Signature Digest Verification Stamp Card */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono uppercase tracking-wider">
                    <Hash className="w-4 h-4" />
                    <span>SHA-256 Digital Signature Digest Verification Stamp</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                    TAMPER RESISTANT
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#070a11] border border-slate-800 font-mono text-xs text-cyan-300 break-all flex items-center justify-between gap-3">
                  <span>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Setiap keputusan persetujuan dan pembuatan formulir secara otomatis menghasilkan nilai hash unik SHA-256 (Cryptographic Fingerprint) untuk menjamin keaslian berkas. Perubahan sekecil 1 bit pada isi formulir atau metadata akan secara otomatis membatalkan tanda tangan digital dan memunculkan peringatan manipulasi (Tamper Detection Alert).
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
            type="button"
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
