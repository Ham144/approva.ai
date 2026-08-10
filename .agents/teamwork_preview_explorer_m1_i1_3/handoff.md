# Handoff Report: UI Integration & Button Wiring Explorer (M1)

## 1. Observation
- **Inspected File**: `C:\Users\USER\.gemini\antigravity\scratch\approva.ai\frontend\src\pages\LandingPage.jsx`
- **Target Section**: `#roi-calculator` (Lines 912–986).
- **Current State**: `#roi-calculator` features an interactive ROI slider section with a right-hand calculated summary card displaying `monthlySavingsRp`, `monthlyApprovalCount`, and `totalHoursSaved`. However, lines 962–985 do NOT contain any export button or CTA trigger for printing/saving reports.
- **Lucide React Imports**: Line 27 imports `FileText`, but `Printer` and `Download` are missing from the `lucide-react` import statement (lines 2–51).
- **Modal Component**: `RoiStatementModal.jsx` will be located at `frontend/src/components/RoiStatementModal.jsx` with contract props specified in `PROJECT.md`.

## 2. Logic Chain
1. **User Goal**: Prospective clients need a clear, visible call-to-action button in `#roi-calculator` to save/export their calculated ROI summary.
2. **Placement Logic**: Placing the export button at the bottom of the summary card (line 984) ensures that after users adjust parameters (left column) and view metrics (right column), they immediately see the CTA button to export the report.
3. **Styling & Micro-interactions**: The button should adopt the primary Approva gradient (`from-[#0078d4] via-blue-600 to-indigo-600`), enterprise glowing shadow (`shadow-blue-600/30`), hover elevation (`hover:-translate-y-0.5`), and Lucide `Printer` + `FileText` icons to signal financial statement printing.
4. **State Wiring**: A state variable `isRoiModalOpen` initialized to `false` in `LandingPage.jsx` will toggle to `true` on button click, rendering `<RoiStatementModal />` with calculated props (`employeeCount`, `avgApprovalTimeDays`, `monthlySavingsRp`, `monthlyApprovalCount`, `totalHoursSaved`).

## 3. Caveats
- **Read-Only Scope**: As an explorer, no direct source code edits were performed on `LandingPage.jsx`. All changes are fully designed, documented, and ready for the implementer agent.
- **Modal Component Presence**: The implementation of `RoiStatementModal.jsx` itself is delegated to Explorer 1 / Implementer 1. The interface contract defined in `PROJECT.md` is strictly adhered to.

## 4. Conclusion
The UI integration and button wiring plan for the ROI Financial Exporter is complete. All necessary code snippets (imports, state initialization, button JSX, and modal instantiation) are documented in `analysis.md` and ready for implementation.

## 5. Verification Method
1. **Inspect Analysis Report**: Review `C:\Users\USER\.gemini\antigravity\scratch\approva.ai\.agents\teamwork_preview_explorer_m1_i1_3\analysis.md`.
2. **Code Verification**:
   - Check `LandingPage.jsx` line 2-51 for `Printer` icon import.
   - Verify `isRoiModalOpen` state hook declaration.
   - Verify button placement inside `#roi-calculator` right-side summary card.
   - Verify prop mapping to `<RoiStatementModal />`.
3. **Build & Runtime Verification**: Once implemented, run `pnpm --prefix frontend build` to confirm zero compilation errors.
