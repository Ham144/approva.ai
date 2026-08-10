# Detailed UI Integration & Button Wiring Analysis: ROI Financial Exporter (M1)

**Role**: M1 Explorer 3 (UI Integration & Button Wiring Explorer)  
**Target Component**: `frontend/src/pages/LandingPage.jsx`  
**Target Section**: `#roi-calculator` (Lines 912–986)  
**Date**: 2026-08-10  

---

## 1. Executive Summary

This report provides the complete UI design, icon selection, styling specifications, state management wiring, and exact code modification plan for integrating the **ROI Financial Exporter Button & Modal Trigger** into `#roi-calculator` of `LandingPage.jsx`.

The integration allows corporate users and prospective enterprise clients to export a formatted financial ROI report summarizing monthly savings in IDR (`monthlySavingsRp`) and managerial hours saved (`totalHoursSaved`), triggering the executive `RoiStatementModal` with print and PDF download capabilities.

---

## 2. Codebase Inspection of `#roi-calculator`

### 2.1 Current Code Structure (`LandingPage.jsx` lines 912–986)
- **Section ID**: `id="roi-calculator"`
- **Section Container**: Outer section with `max-w-7xl mx-auto`, dark background `#070a11`.
- **Card Container**: Grid layout (`grid-cols-1 lg:grid-cols-2 gap-8`) inside a container with `border border-slate-800 bg-[#0a0f1d] rounded-3xl p-6 sm:p-10 shadow-2xl`.
- **Left Column**: Interactive ROI Sliders:
  - `employeeCount` (Range: 20 to 500, state default: 85)
  - `avgApprovalTimeDays` (Range: 1 to 14, state default: 5)
- **Right Column**: Live Calculation Summary Card:
  - Card container: `p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-center shadow-xl`
  - Big Display Metric: `monthlySavingsRp` in `text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono`
  - Secondary Metrics Grid:
    - `monthlyApprovalCount` (`monthlyApprovalCount` Berkas)
    - `totalHoursSaved` (`Math.round(monthlyApprovalCount * hoursSavedPerApproval)` Jam)
- **Missing Element**: Currently, there is **no CTA button or print/export trigger** inside this summary card.

---

## 3. Button Placement Options & Recommended Placement

### Option A: Primary Action Footer inside Summary Card (RECOMMENDED ⭐)
- **Placement**: Positioned inside the right-hand summary card, directly below the 2-column secondary metrics grid (`pt-4 border-t border-slate-800`).
- **Rationale**: User attention naturally flows from adjusting inputs on the left -> observing calculated metrics on the right -> clicking the export button at the bottom of the summary card. This creates an intuitive, conversion-focused user flow.

### Option B: Section Header Action Bar
- **Placement**: Positioned next to the section title ("Laporan Efisiensi Finansial & ROI") at line 919.
- **Rationale**: Accessible before interaction, but premature since users haven't yet calculated or seen their customized ROI parameters.

### Option C: Dual-Action Button Row (Print Modal vs Direct PDF Export)
- **Placement**: Positioned inside the summary card with two inline buttons side-by-side:
  1. `Export & Preview Laporan` (Primary gradient button -> opens modal)
  2. `Quick Print` (Secondary border button -> direct print)
- **Recommendation**: Unified primary button triggering `RoiStatementModal` is cleaner and gives users full control inside the modal to choose between interactive print (`window.print()`) and styled PDF export (`jsPDF`).

---

## 4. Icon Selection & Visual Hierarchy Strategy

### 4.1 Icon Evaluation
| Lucide Icon | Visual Meaning | Recommendation |
|---|---|---|
| `Printer` | Direct print / physical paper statement | **Primary Icon** (represents standard corporate statement printing) |
| `FileText` | Formal report / summary document | **Secondary / Alternative Icon** (represents document preview) |
| `Download` | File download / PDF export | **Action Icon inside Modal** |

### 4.2 Primary Button Design Specification
- **Icon**: `Printer` (from `lucide-react`) combined with optional `FileText` or `ArrowRight`.
- **Button Label**: `"Export & Cetak Laporan ROI"` or `"Cetak Laporan Finansial ROI"`.
- **Icon Attributes**: `className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform"`

---

## 5. Styling, Typography & Micro-Interactions

### 5.1 Design Tokens (Matching Approva Enterprise Theme)
- **Background**: Gradient `from-[#0078d4] via-blue-600 to-indigo-600` with hover state `hover:from-blue-600 hover:to-indigo-700`.
- **Text Styling**: `text-white font-extrabold text-xs sm:text-sm tracking-wide`.
- **Borders & Shadows**: `shadow-lg shadow-blue-600/30 border border-blue-400/20`.
- **Dimensions & Radius**: `w-full py-3.5 px-5 rounded-xl`.
- **Hover Micro-Interactions**: `transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200`.
- **Focus Ring**: `focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900`.

---

## 6. State Management & Modal Wiring Architecture

### 6.1 State Variable in `LandingPage.jsx`
```javascript
// ROI Modal State
const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);
```

### 6.2 Props Interface Contract (`LandingPage.jsx` ➔ `RoiStatementModal.jsx`)
```javascript
<RoiStatementModal
  isOpen={isRoiModalOpen}
  onClose={() => setIsRoiModalOpen(false)}
  employeeCount={employeeCount}
  avgApprovalTimeDays={avgApprovalTimeDays}
  monthlySavingsRp={monthlySavingsRp}
  monthlyApprovalCount={monthlyApprovalCount}
  totalHoursSaved={Math.round(monthlyApprovalCount * hoursSavedPerApproval)}
/>
```

---

## 7. Line-by-Line Code Changes for `LandingPage.jsx`

### 7.1 Import Additions
1. Update `lucide-react` import list (line 2-51):
   - Add `Printer`, `Download` (Note: `FileText` is already imported).
2. Import `RoiStatementModal` component:
   - `import RoiStatementModal from "../components/RoiStatementModal";`

### 7.2 State Declaration (Line 98)
```javascript
  // ROI Calculator & Export Modal State
  const [employeeCount, setEmployeeCount] = useState(85);
  const [avgApprovalTimeDays, setAvgApprovalTimeDays] = useState(5);
  const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);
```

### 7.3 Section `#roi-calculator` JSX Update (Line 962–986)
```jsx
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-center shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                Potensi Penghematan Per Bulan
              </span>

              <div className="mt-3">
                <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono">
                  Rp {monthlySavingsRp.toLocaleString("id-ID")}
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">/ bulan dalam efisiensi jam manajerial</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-left text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">Pengajuan / Bln:</span>
                <span className="font-bold text-white text-sm font-mono">{monthlyApprovalCount} Berkas</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">Jam Terhemat:</span>
                <span className="font-bold text-emerald-400 text-sm font-mono">{Math.round(monthlyApprovalCount * hoursSavedPerApproval)} Jam</span>
              </div>
            </div>

            {/* ROI Export Button Integration */}
            <div className="pt-2">
              <button
                onClick={() => setIsRoiModalOpen(true)}
                className="group w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#0078d4] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer border border-blue-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <Printer className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                <span>Export / Cetak Laporan ROI</span>
                <FileText className="w-3.5 h-3.5 text-blue-200 opacity-80" />
              </button>
            </div>
          </div>
```

### 7.4 Modal Mount at Bottom of `LandingPage.jsx` (around Line 1260)
```jsx
      {/* ROI FINANCIAL STATEMENT MODAL */}
      {isRoiModalOpen && (
        <RoiStatementModal
          isOpen={isRoiModalOpen}
          onClose={() => setIsRoiModalOpen(false)}
          employeeCount={employeeCount}
          avgApprovalTimeDays={avgApprovalTimeDays}
          monthlySavingsRp={monthlySavingsRp}
          monthlyApprovalCount={monthlyApprovalCount}
          totalHoursSaved={Math.round(monthlyApprovalCount * hoursSavedPerApproval)}
        />
      )}
```

---

## 8. Verification & Acceptance Checklist
- [x] `#roi-calculator` inspected in `LandingPage.jsx`.
- [x] Exact button placement designed inside summary card.
- [x] Lucide icons selected (`Printer`, `FileText`, `Download`).
- [x] Tailwind CSS styling & hover effects specified.
- [x] State variable `isRoiModalOpen` defined and wired.
- [x] Complete code snippets documented for implementation.
