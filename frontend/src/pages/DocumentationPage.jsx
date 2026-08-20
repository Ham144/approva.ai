import React, { useState } from "react";
import {
  Terminal,
  ShieldCheck,
  Cpu,
  Database,
  Search,
  BookOpen,
  Layers,
  Key,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Server,
} from "lucide-react";
import { PHONE } from "@/api/constant";

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState("architecture");
  const [copiedCode, setCopiedCode] = useState("");

  const handleCopy = (codeText, id) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const navItems = [
    {
      id: "architecture",
      label: "01. System Architecture",
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      id: "onpremise",
      label: "02. On-Premise Deployment",
      icon: <Server className="w-4 h-4" />,
    },
    {
      id: "auth",
      label: "03. LDAP & SSO Integration",
      icon: <Key className="w-4 h-4" />,
    },
    {
      id: "logic-routing",
      label: "04. Dynamic Logic Engine",
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: "audit-trail",
      label: "05. Audit Trail & Security",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-teal-500 selection:text-zinc-950 px-4 py-8 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SPEC */}
        <div className="border-b border-zinc-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-teal-400" />
              <span>ENGINE MANUAL</span>
              <span>/</span>
              <span className="text-zinc-300">DOC REF: APPROVA-DOCS-2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
              Dokumentasi Teknis &amp; Panduan Engine
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Panduan integrasi, konfigurasi server on-premise VPS, skema
              isolasi tenant, dan parameter arsitektur Approva.ai.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg shrink-0">
            <span className="w-2 h-2 rounded-full bg-teal-500 inline-block animate-pulse" />
            <span>VERSION 2.5 STABLE</span>
          </div>
        </div>

        {/* MAIN DOCUMENTATION LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SIDEBAR NAVIGATION (4 COLS) */}
          <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-8">
            <div className="p-2 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 px-3 py-1.5 block tracking-wider">
                Indeks Dokumentasi
              </span>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-mono transition-colors text-left ${
                    activeSection === item.id
                      ? "bg-zinc-800 text-teal-400 font-semibold border border-zinc-700"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${activeSection === item.id ? "rotate-90 text-teal-400" : "text-zinc-600"}`}
                  />
                </button>
              ))}
            </div>

            {/* Quick Support Card */}
            <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2 text-xs font-mono">
              <span className="text-[10px] uppercase text-zinc-500 block">
                SLA &amp; Support Tier
              </span>
              <p className="text-zinc-400 font-sans text-xs">
                Memerlukan bantuan arsitektur atau custom deployment skema?
              </p>
              <div className="pt-1 text-teal-400 font-medium flex items-center gap-1 hover:underline cursor-pointer">
                <a
                  target="_blank"
                  href={`https://wa.me/${PHONE}?text=approva-ai:`}
                >
                  Hubungi Technical Support
                </a>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* DOCUMENTATION CONTENT BODY (8 COLS) */}
          <div className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-8 text-xs sm:text-sm font-sans leading-relaxed">
            {/* SECTION 1: ARCHITECTURE */}
            {activeSection === "architecture" && (
              <div className="space-y-6">
                <div className="border-b border-zinc-800 pb-4 space-y-1">
                  <span className="font-mono text-xs text-teal-400 uppercase">
                    SPEC // OVERVIEW
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-100">
                    01. Arsitektur Engine &amp; Multi-Tenancy
                  </h2>
                </div>

                <p className="text-zinc-300">
                  Approva.ai dibangun menggunakan arsitektur modular yang
                  memisahkan logika master template alur kerja (workflow) dengan
                  instance eksekusi permohonan. Arsitektur ini menjamin keutuhan
                  data saat terjadi modifikasi alur kerja di masa depan.
                </p>

                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2 font-mono text-xs">
                  <div className="text-zinc-500 uppercase text-[10px]">
                    Ringkasan Prinsip Arsitektur:
                  </div>
                  <ul className="space-y-1.5 text-zinc-300">
                    <li>
                      • <strong>Cascading Isolation:</strong> Penghapusan master
                      template menghapus instansi turunan untuk mencegah
                      dangling reference.
                    </li>
                    <li>
                      • <strong>Immutable History:</strong> Seluruh mutasi
                      status dicatat dalam log permanen yang tidak dapat diubah
                      oleh database admin biasa.
                    </li>
                    <li>
                      • <strong>Tenant Data Segregation:</strong> Setiap
                      organisasi anak perusahaan memiliki skema otorisasi dan
                      konfigurasi email mandiri.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* SECTION 2: ON-PREMISE DEPLOYMENT */}
            {activeSection === "onpremise" && (
              <div className="space-y-6">
                <div className="border-b border-zinc-800 pb-4 space-y-1">
                  <span className="font-mono text-xs text-teal-400 uppercase">
                    DEPLOYMENT // HOSTING
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-100">
                    02. On-Premise VPS &amp; Server Setup
                  </h2>
                </div>

                <p className="text-zinc-300">
                  Sistem beroperasi 100% mandiri di dalam Virtual Private Server
                  (VPS) atau server fisik internal organisasi Anda tanpa
                  membutuhkan telemetri berkala ke server eksternal.
                </p>

                {/* Code Block Example */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Environment Variables Setup (.env)</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          "APP_PORT=3000\nDATABASE_URL=mongodb://localhost:27017/approva_db\nREDIS_URL=redis://localhost:6379\nJWT_SECRET=super_secret_enterprise_key\nAUTH_LDAP_ENABLED=true",
                          "env",
                        )
                      }
                      className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
                    >
                      {copiedCode === "env" ? (
                        <Check className="w-3.5 h-3.5 text-teal-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {copiedCode === "env"
                          ? "Tersalin"
                          : "Salin Konfigurasi"}
                      </span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                    {`APP_PORT=3000
DATABASE_URL=mongodb://localhost:27017/approva_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=super_secret_enterprise_key
AUTH_LDAP_ENABLED=true`}
                  </pre>
                </div>
              </div>
            )}

            {/* SECTION 3: LDAP & AUTH */}
            {activeSection === "auth" && (
              <div className="space-y-6">
                <div className="border-b border-zinc-800 pb-4 space-y-1">
                  <span className="font-mono text-xs text-teal-400 uppercase">
                    SECURITY // LDAP
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-100">
                    03. Integrasi Active Directory &amp; LDAP
                  </h2>
                </div>

                <p className="text-zinc-300">
                  Approva mendukung sinkronisasi autentikasi ganda: kredensial
                  lokal terenkripsi (DB Local) dan Active Directory korporat
                  untuk single sign-on (SSO) akun karyawan.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-teal-400 font-semibold uppercase block">
                      LDAP Protocol
                    </span>
                    <p className="text-zinc-400 font-sans text-xs">
                      Sinkronisasi otomatis informasi departemen &amp; email
                      akun pemohon langsung dari domain controller.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-teal-400 font-semibold uppercase block">
                      Granular Roles
                    </span>
                    <p className="text-zinc-400 font-sans text-xs">
                      Hierarki 4 level hak akses: Member, Viewer, Department
                      Head, dan Organization Owner.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: LOGIC ROUTING */}
            {activeSection === "logic-routing" && (
              <div className="space-y-6">
                <div className="border-b border-zinc-800 pb-4 space-y-1">
                  <span className="font-mono text-xs text-teal-400 uppercase">
                    ENGINE // LOGIC RULES
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-100">
                    04. Smart Logic Routing &amp; Conditional Branches
                  </h2>
                </div>

                <p className="text-zinc-300">
                  Engine evaluasi kondisi memproses nilai formulir secara
                  runtime untuk menentukan jalur tahapan berikutnya secara
                  dinamis.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex justify-between items-center">
                    <span className="text-zinc-200">JUMP_TO_STAGE</span>
                    <span className="text-zinc-500">
                      Lompat node jika input nominal &gt; limit threshold
                    </span>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex justify-between items-center">
                    <span className="text-zinc-200">COMPLETED_IF</span>
                    <span className="text-zinc-500">
                      Otomatisasi penyelesaian instan pada kondisi khusus
                    </span>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex justify-between items-center">
                    <span className="text-zinc-200">REDO_ROLLBACK</span>
                    <span className="text-zinc-500">
                      Pengembalian berkas spesifik ke tahap input pembuat
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: AUDIT TRAIL */}
            {activeSection === "audit-trail" && (
              <div className="space-y-6">
                <div className="border-b border-zinc-800 pb-4 space-y-1">
                  <span className="font-mono text-xs text-teal-400 uppercase">
                    AUDIT // COMPLIANCE
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-100">
                    05. Audit Trail &amp; Kepatuhan Regulasi
                  </h2>
                </div>

                <p className="text-zinc-300">
                  Setiap dokumen yang diproses melalui Approva dilengkapi dengan
                  hash SHA-256 dan catatan waktu digital (timestamp) yang tidak
                  dapat dimanipulasi secara manual.
                </p>

                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2 text-xs font-mono">
                  <div className="text-zinc-400">
                    Verifikasi Integritas Berkas:
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900 text-teal-400 truncate">
                    HASH:
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </div>
                  <p className="text-zinc-500 text-[11px] font-sans">
                    Log audit menyertakan IP pengakses, identitas approver
                    terverifikasi, dan rekaman status transisi lengkap.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
