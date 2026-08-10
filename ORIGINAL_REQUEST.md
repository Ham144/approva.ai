# Original User Request

## Initial Request — 2026-08-10T15:21:38+07:00

Analisis gap dan pengoptimalan otonom komponen frontend LandingPage.jsx Approva.ai (Fitur Ekspor Laporan ROI Financial ke Cetak/Dokumen, Modal Dokumen Legal Privacy Policy / Terms / Security Whitepaper, serta Peningkatan Mikro-interaksi UI).

Working directory: C:\Users\USER\.gemini\antigravity\scratch\approva.ai
Integrity mode: development

## Requirements

### R1. Live ROI Financial Statement PDF / Print Exporter
Menambahkan tombol dan fungsi cetak/ekspor ringkasan laporan hasil Kalkulator ROI (window.print() / formatted summary document layout) agar calon klien dapat menyimpan hasil estimasi penghematan finansial (Rupiah & Jam Manajerial).

### R2. Interactive Legal & Security Whitepaper Modals
Menambahkan modal dialog interaktif untuk link footer: Privacy Policy, Terms of License, dan Security Whitepaper (penjelasan On-Premise encryption, data sovereignty, SHA-256 digital signature, dan audit log).

### R3. Micro-Interactions & Active Scroll Navigation
Menambahkan indikator scroll aktif pada header navigasi, efek salin link (Copy to Clipboard) pada Stranger Mode Public Link, dan animasi feedback yang responsif di seluruh section.

## Acceptance Criteria

### Frontend Functional Verification
- [ ] Tombol cetak/ekspor ROI statement berfungsi dan memicu tampilan laporan siap cetak/simpan.
- [ ] Klik pada Privacy Policy, Terms of License, dan Security Whitepaper membuka modal dialog penjelasan resmi.
- [ ] Fitur Copy Public Link di Skenario Stranger Mode menampilkan toast notifikasi "Link Berhasil Disalin!".
- [ ] Kompilasi vite build frontend berjalan 100% tanpa error (Exit Code 0).
