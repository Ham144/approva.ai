const DEV_URL = "";
let PROD_URL = "https://approva-ai.hexadim.com";

if (import.meta.env.VITE_BACKEND_URL) {
  PROD_URL = import.meta.env.VITE_BACKEND_URL;
}
export const PHONE = "6287876361051";

const isProductionEnvironment =
  window.location.hostname === "approva-ai.hexadim.com" ||
  window.location.hostname.endsWith(".approva-ai.hexadim.com");
// Set NODE_ENV berdasarkan kondisi
const NODE_ENV = isProductionEnvironment ? "production" : "development"; // kalau staging perlu beda, bisa ubah sini

// Final BASE_URL
export const BASE_URL = NODE_ENV === "production" ? PROD_URL : DEV_URL;
export const APP_NAME = "Approva.AI";
export const APP_DESC = "AI powered approval builder";
export const NAMA_PERUSAHAAN = "Hexadim LLC";

export const initialTempSourceData = {
  title: "",
  desc: "",
  keys: [],
};

export const inputKeysType = [
  "image",
  "text",
  "date",
  "number",
  "select",
  "pdf",
];

export const logs = [
  // --- ROADMAP / UPCOMING MILESTONES ---
  {
    date: "Next",
    type: "feat",
    text: "WhatsApp Gateway Service: integrasi template notifikasi & eksekusi instan",
    done: false,
  },
  {
    date: "Next",
    type: "core",
    text: "Automated Backup & Restore Engine: scheduler dump & restore basis data",
    done: false,
  },
  {
    date: "Next",
    type: "feat",
    text: "Konfigurasi mandiri visual setup host LDAP / Active Directory di dashboard",
    done: false,
  },
  {
    date: "Next",
    type: "core",
    text: "Audit komprehensif isolasi skema multi-tenancy enterprise",
    done: false,
  },
  {
    date: "Next",
    type: "core",
    text: "Automated End-to-End Testing Suite untuk alur kritis workflow",
    done: false,
  },
  {
    date: "Next",
    type: "core",
    text: "Portal dokumentasi teknis, schema definition, & API Sandbox",
    done: false,
  },

  // --- COMPLETED LOGS (TERBARU -> TERLAMA) ---

  // APR 2026
  {
    date: "20 Apr 2026",
    type: "feat",
    text: "Telegram Notification Support: bot pengingat antrean approval realtime",
    done: true,
  },
  {
    date: "20 Apr 2026",
    type: "feat",
    text: "Direct download generator PDF pada setiap review berkas permohonan",
    done: true,
  },
  {
    date: "20 Apr 2026",
    type: "feat",
    text: "Auto-switch tenant otomatis saat pengguna mengakses tautan organisasi luar",
    done: true,
  },
  {
    date: "20 Apr 2026",
    type: "feat",
    text: "Fitur copy-paste struktur parent ke flow lain & copy-paste child ke parent lain",
    done: true,
  },
  {
    date: "20 Apr 2026",
    type: "fix",
    text: "Fix navigasi arrow reorder hierarki child node naik-turun pada visual editor",
    done: true,
  },
  {
    date: "20 Apr 2026",
    type: "fix",
    text: "Penyesuaian opsi tindakan approval secara dinamis berdasarkan state logic",
    done: true,
  },

  // MAR 2026
  {
    date: "26 Mar 2026",
    type: "fix",
    text: "Fix RangeError [ERR_OUT_OF_RANGE]: buffer converter crash pada upload gambar besar di tipe table image",
    done: true,
  },
  {
    date: "18 Mar 2026",
    type: "perf",
    text: "Integrasi Redis Caching Layer untuk akselerasi loading query antrean flow",
    done: true,
  },
  {
    date: "12 Mar 2026",
    type: "feat",
    text: "Dukungan Web Camera API untuk capture foto dokumen langsung di form",
    done: true,
  },
  {
    date: "08 Mar 2026",
    type: "core",
    text: "Dukungan native left-click (open new tab) pada tabel halaman proses",
    done: true,
  },
  {
    date: "04 Mar 2026",
    type: "fix",
    text: "Fix internal server error handling pada kondisi evaluasi rule completed-if",
    done: true,
  },
  {
    date: "01 Mar 2026",
    type: "ui",
    text: "Penyesuaian dimensi dan hit area tombol navigasi continue form",
    done: true,
  },

  // FEB 2026
  {
    date: "26 Feb 2026",
    type: "ui",
    text: "Standardisasi styling disabled state pada form input dan kontrol navigasi",
    done: true,
  },
  {
    date: "22 Feb 2026",
    type: "fix",
    text: "Modifikasi mekanisme undo manual saat merubah currentStatusIndex",
    done: true,
  },
  {
    date: "18 Feb 2026",
    type: "fix",
    text: "Fix inkonsistensi struktur template approval saat instance aktif mengalami mutasi",
    done: true,
  },
  {
    date: "15 Feb 2026",
    type: "feat",
    text: "Penyempurnaan export CSV detail untuk dekonstruksi data bersarang pada komponen table",
    done: true,
  },
  {
    date: "12 Feb 2026",
    type: "feat",
    text: "Searchable external HTTP request option untuk field tipe select dinamis (Location, Vendor, dll)",
    done: true,
  },
  {
    date: "09 Feb 2026",
    type: "feat",
    text: "Integrasi HTTP API resolver endpoint untuk populasi data field select",
    done: true,
  },
  {
    date: "06 Feb 2026",
    type: "feat",
    text: "Logic Routing Engine: implementasi rule Jump To, Completed If, Rejected If, dan Prevent Next If",
    done: true,
  },
  {
    date: "02 Feb 2026",
    type: "ui",
    text: "Penyelarasan urutan ergonomis posisi tombol Approve dan Decline",
    done: true,
  },

  // JAN 2026
  {
    date: "29 Jan 2026",
    type: "ui",
    text: "Visual greyscale tone indicator pada status approval tahapan yang telah terlewati",
    done: true,
  },
  {
    date: "25 Jan 2026",
    type: "fix",
    text: "Fix engine filter hak akses komprehensif untuk level Member, Viewer, dan Owner",
    done: true,
  },
  {
    date: "21 Jan 2026",
    type: "feat",
    text: "Verbose Payload Search: kemampuan indexing dan pencarian permohonan via jawaban formulir",
    done: true,
  },
  {
    date: "17 Jan 2026",
    type: "feat",
    text: "Pencarian instan permohonan berdasarkan nama lengkap pemohon",
    done: true,
  },
  {
    date: "14 Jan 2026",
    type: "core",
    text: "Default active filter: in-progress query default untuk mengeliminasi berkas completed",
    done: true,
  },
  {
    date: "10 Jan 2026",
    type: "fix",
    text: "Penyempurnaan mekanisme undo 1 langkah pada pergerakan rantai otoritas",
    done: true,
  },
  {
    date: "06 Jan 2026",
    type: "feat",
    text: "Rollback terarah (Redo): opsi pengembalian berkas mundur 1 langkah atau ke target node spesifik",
    done: true,
  },
  {
    date: "03 Jan 2026",
    type: "feat",
    text: "UI selector penentuan manual Next Approver sekaligus mengeliminasi email blast redundan",
    done: true,
  },

  // DEC 2025
  {
    date: "28 Dec 2025",
    type: "fix",
    text: "Auto sync update: sinkronisasi otomatis mutasi perpindahan departemen via Active Directory (LDAP)",
    done: true,
  },
  {
    date: "22 Dec 2025",
    type: "feat",
    text: "Modul export CSV permohonan terintegrasi dengan filter periode bulan",
    done: true,
  },
  {
    date: "18 Dec 2025",
    type: "feat",
    text: "1-Click Switch Organization: perpindahan workspace instan antar entitas",
    done: true,
  },
  {
    date: "14 Dec 2025",
    type: "fix",
    text: "Fix filter kueri berbasis template flow pada monitoring alur kerja",
    done: true,
  },
  {
    date: "10 Dec 2025",
    type: "ui",
    text: "Fitur adaptive grid view: fleksibilitas tampilan 1 Kolom atau 2 Kolom",
    done: true,
  },
  {
    date: "06 Dec 2025",
    type: "core",
    text: "Visibilitas matriks authorized users di setiap tahapan status, bukan hanya currentStatusIndex",
    done: true,
  },
  {
    date: "02 Dec 2025",
    type: "fix",
    text: "Normalisasi case-sensitive: pencegahan registrasi karakter kapital pada username akun",
    done: true,
  },

  // NOV 2025
  {
    date: "27 Nov 2025",
    type: "feat",
    text: "Implementasi nomor urut Global Index unik pada preview permohonan dan dashboard",
    done: true,
  },
  {
    date: "23 Nov 2025",
    type: "feat",
    text: "Visualisasi matriks tugas persetujuan yang lebih komprehensif pada beranda",
    done: true,
  },
  {
    date: "19 Nov 2025",
    type: "feat",
    text: "Tampilan daftar approver berwenang di tiap status pada mode previewOnly dan execution time",
    done: true,
  },
  {
    date: "15 Nov 2025",
    type: "feat",
    text: "Complex Filter Engine: Kategori, Status, Pemohon, Waktu, Departemen, dan User Scope",
    done: true,
  },
  {
    date: "11 Nov 2025",
    type: "feat",
    text: "Pencarian ganda instan: kueri berdasarkan judul permohonan & nomor Global Index",
    done: true,
  },
  {
    date: "08 Nov 2025",
    type: "feat",
    text: "Implementasi pagination server-side pada dataset permohonan skala besar",
    done: true,
  },
  {
    date: "05 Nov 2025",
    type: "feat",
    text: "Pencarian form global pada antrean halaman proses",
    done: true,
  },
  {
    date: "02 Nov 2025",
    type: "feat",
    text: "Modul self-service reset password kredensial lokal",
    done: true,
  },

  // OCT 2025
  {
    date: "29 Oct 2025",
    type: "feat",
    text: "Pemisah ribuan otomatis (Thousand Separator) pada tipe data teks, angka, dan sel tabel",
    done: true,
  },
  {
    date: "25 Oct 2025",
    type: "fix",
    text: "Fix issue visibilitas form departemen spesifik (WL Cijerah edge-case filter)",
    done: true,
  },
  {
    date: "21 Oct 2025",
    type: "fix",
    text: "Fix mode private form yang tidak ter-render pada katalog permohonan",
    done: true,
  },
  {
    date: "17 Oct 2025",
    type: "feat",
    text: "Cross-Tenant Replication: modul duplikasi flow dan template approval antar organisasi",
    done: true,
  },
  {
    date: "13 Oct 2025",
    type: "fix",
    text: "Fix redirect session timeout pada halaman proses saat pergantian token",
    done: true,
  },
  {
    date: "09 Oct 2025",
    type: "feat",
    text: "Shared Library Template: pustaka master alur kerja siap pakai",
    done: true,
  },
  {
    date: "05 Oct 2025",
    type: "feat",
    text: "Fitur kloning dan duplikasi status tahapan (Copy Status Node)",
    done: true,
  },
  {
    date: "02 Oct 2025",
    type: "ui",
    text: "Reposisi tombol aksi 'Buat Flow Baru' ke header atas dan penambahan live search flow",
    done: true,
  },

  // SEP 2025
  {
    date: "28 Sep 2025",
    type: "sec",
    text: "Automated HTTPS / TLS Hardening menggunakan Certbot Certificate",
    done: true,
  },
  {
    date: "24 Sep 2025",
    type: "feat",
    text: "Penyempurnaan tipe helper text dan validasi tooltip pada form builder",
    done: true,
  },
  {
    date: "20 Sep 2025",
    type: "core",
    text: "Penerapan granular rule: Allowed Specific User to Request untuk eksekutor tertentu",
    done: true,
  },
  {
    date: "16 Sep 2025",
    type: "core",
    text: "Isolasi data level 'Member': hanya dapat melihat permohonan on-progress di departemennya",
    done: true,
  },
  {
    date: "12 Sep 2025",
    type: "core",
    text: "Pemberlakuan level akses 'Viewer': izin pembuatan form dan monitoring seluruh berkas aktif",
    done: true,
  },
  {
    date: "08 Sep 2025",
    type: "ui",
    text: "Tab navigasi cepat status tahapan pada Flow Editor & Create Editor",
    done: true,
  },
  {
    date: "04 Sep 2025",
    type: "feat",
    text: "Penambahan tipe input komponen: Keterangan (Rich Display) dan Textarea multi-baris",
    done: true,
  },
  {
    date: "01 Sep 2025",
    type: "ui",
    text: "Filter tabulasi halaman permohonan: [Departemen Saya] dan [Semua Request]",
    done: true,
  },

  // AUG 2025
  {
    date: "28 Aug 2025",
    type: "sec",
    text: "Restriksi akses: proteksi halaman proses dari akses pengguna bertingkat level Member",
    done: true,
  },
  {
    date: "24 Aug 2025",
    type: "fix",
    text: "Fix scroll jitter issue: perbaikan auto-scroll viewport yang meloncat ke atas saat interaksi klik",
    done: true,
  },
  {
    date: "20 Aug 2025",
    type: "feat",
    text: "Penambahan komponen tipe Select dinamis di dalam kolom tabel bersarang",
    done: true,
  },
  {
    date: "16 Aug 2025",
    type: "fix",
    text: "Validasi status: pemblokiran permanen perintah Rollback terhadap berkas dengan status Rejected",
    done: true,
  },
  {
    date: "13 Aug 2025",
    type: "core",
    text: "Supertenant Controller: registrasi dan provisi organisasi baru terpusat via akun superadmin",
    done: true,
  },
  {
    date: "09 Aug 2025",
    type: "feat",
    text: "Integrasi payload AD: autentikasi penerimaan metadata departemen dan email dari Active Directory",
    done: true,
  },
  {
    date: "06 Aug 2025",
    type: "fix",
    text: "Fix Take-Over wewenang dengan rekonsiliasi pemberitahuan otomatis antar pejabat approval",
    done: true,
  },
  {
    date: "03 Aug 2025",
    type: "fix",
    text: "Penyempurnaan Fulfillment Page dan mutasi state pada manajemen departemen untuk refresh userInfo",
    done: true,
  },

  // JUL 2025 (INITIAL CORE RELEASE)
  {
    date: "31 Jul 2025",
    type: "core",
    text: "LDAP User Inheritance: pewarisan wewenang approval dari personil lama yang telah non-aktif",
    done: true,
  },
  {
    date: "29 Jul 2025",
    type: "feat",
    text: "Konfigurasi SMTP Email mandiri & parameter LDAP host terisolasi per-organisasi",
    done: true,
  },
  {
    date: "27 Jul 2025",
    type: "feat",
    text: "Duplikasi master template alur kerja (Duplicate Flow)",
    done: true,
  },
  {
    date: "25 Jul 2025",
    type: "core",
    text: "Migrasi aturan: restrukturisasi allowedUserToRequest menjadi allowedDepartmentToRequest",
    done: true,
  },
  {
    date: "24 Jul 2025",
    type: "feat",
    text: "Penyusunan urutan fleksibel: reorder naik-turun status tahapan, approval, dan komponen request",
    done: true,
  },
  {
    date: "23 Jul 2025",
    type: "feat",
    text: "Notifikasi email terstruktur dengan tombol aksi langsung Approve dan Reject kepada PIC aktif",
    done: true,
  },
  {
    date: "23 Jul 2025",
    type: "feat",
    text: "Notifikasi email otomatis kepada pemohon saat berkas diputuskan Reject atau di-Rollback",
    done: true,
  },
  {
    date: "22 Jul 2025",
    type: "feat",
    text: "Pemberitahuan email kepada approver yang gilirannya dialihkan (take-over notification)",
    done: true,
  },
  {
    date: "21 Jul 2025",
    type: "core",
    text: "Rilis perdana Core Engine Flow Creation & Dynamic E-Form Builder",
    done: true,
  },
  {
    date: "21 Jul 2025",
    type: "feat",
    text: "Penyimpanan berkas lampiran & upload gambar pada portal Request Edit",
    done: true,
  },
  {
    date: "21 Jul 2025",
    type: "core",
    text: "Relasi kaskade database: otomatisasi penghapusan flowInstance saat master template dihapus",
    done: true,
  },
  {
    date: "21 Jul 2025",
    type: "sec",
    text: "Isolasi data master: pemindahan authorizedUser ke level template bukan di instance",
    done: true,
  },
  {
    date: "21 Jul 2025",
    type: "core",
    text: "Granular permission: penentuan hak akses pengguna yang berhak membuat request flow tertentu",
    done: true,
  },
  {
    date: "21 Jul 2025",
    type: "core",
    text: "Opsi kontrol read-only pada eksekusi tindakan halaman proses",
    done: true,
  },
];
