# Analysis Report: Footer Wiring & State Integration Explorer (M2)

**Explorer**: M2 Explorer 3 (Footer Wiring & State Integration Explorer)  
**Target File**: `frontend/src/pages/LandingPage.jsx`  
**Target Milestone**: M2 (Interactive Legal & Security Modals)  
**Date**: 2026-08-10  

---

## 1. Executive Summary

This report presents the exact state variable definitions, event handler wiring, import statements, and rendering placement required in `frontend/src/pages/LandingPage.jsx` to enable interactive legal and security whitepaper modals via the footer links (`Privacy Policy`, `Terms of License`, `Security Whitepaper`).

---

## 2. Codebase Line Inspection

- **Import Block**: Line 55 currently imports `RoiStatementModal`.
- **State Initialization Block**: Lines 98–101 define state for `employeeCount`, `avgApprovalTimeDays`, and `isRoiModalOpen`.
- **Enterprise Footer Links**: Lines 1144–1148 currently render static `href="#"` links:
  ```jsx
  <div className="flex gap-6 font-mono text-[11px]">
    <a href="#" className="hover:text-slate-300">Privacy Policy</a>
    <a href="#" className="hover:text-slate-300">Terms of License</a>
    <a href="#" className="hover:text-slate-300">Security Whitepaper</a>
  </div>
  ```
- **Modal Rendering Block**: Lines 1274–1282 render `<RoiStatementModal />` right before the closing `</div>` of `LandingPage`.

---

## 3. Exact Integration Design

### A. Component Import
Add import for `LegalModal` adjacent to `RoiStatementModal` at line 56:
```jsx
import LegalModal from "../components/LegalModal";
```

### B. State Variables & Helper Function
Add state variables and helper handler inside `LandingPage` function body:
```jsx
  // Interactive Legal & Security Whitepaper Modal State
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState("privacy"); // 'privacy' | 'terms' | 'whitepaper'

  const handleOpenLegalModal = (tab = "privacy") => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };
```

### C. Footer Links Event Wiring
Replace static `href="#"` links with `onClick` handlers that invoke `handleOpenLegalModal` with the corresponding tab identifier (`privacy`, `terms`, or `whitepaper`) and call `e.preventDefault()` to prevent scroll-to-top hash jumps:

```jsx
        <div className="flex gap-6 font-mono text-[11px]">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleOpenLegalModal("privacy");
            }}
            className="hover:text-slate-300 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleOpenLegalModal("terms");
            }}
            className="hover:text-slate-300 transition-colors"
          >
            Terms of License
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleOpenLegalModal("whitepaper");
            }}
            className="hover:text-slate-300 transition-colors"
          >
            Security Whitepaper
          </a>
        </div>
```

### D. Modal Component Instance Rendering
Render `<LegalModal />` adjacent to `<RoiStatementModal />` at the bottom of `LandingPage.jsx`:
```jsx
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
```

---

## 4. Proposed Patch File (`landing_page_legal_modal.patch`)

```patch
--- a/frontend/src/pages/LandingPage.jsx
+++ b/frontend/src/pages/LandingPage.jsx
@@ -53,6 +53,7 @@ import { useNavigate } from "react-router-dom";
 import { useUserInfo } from "../store";
 import RoiStatementModal from "../components/RoiStatementModal";
+import LegalModal from "../components/LegalModal";
 
 const LandingPage = () => {
   const navigate = useNavigate();
@@ -98,6 +99,14 @@ const LandingPage = () => {
   const [employeeCount, setEmployeeCount] = useState(85);
   const [avgApprovalTimeDays, setAvgApprovalTimeDays] = useState(5);
   const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);
+
+  // Interactive Legal & Security Whitepaper Modal State
+  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
+  const [legalModalTab, setLegalModalTab] = useState("privacy");
+
+  const handleOpenLegalModal = (tab = "privacy") => {
+    setLegalModalTab(tab);
+    setIsLegalModalOpen(true);
+  };
 
   // ROI Calculations
   const hourlyCost = 85000;
@@ -1144,9 +1153,33 @@ const LandingPage = () => {
           <span>© 2026 Enterprise Dynamic E-Form & Approval Control Platform.</span>
         </div>
         <div className="flex gap-6 font-mono text-[11px]">
-          <a href="#" className="hover:text-slate-300">Privacy Policy</a>
-          <a href="#" className="hover:text-slate-300">Terms of License</a>
-          <a href="#" className="hover:text-slate-300">Security Whitepaper</a>
+          <a
+            href="#"
+            onClick={(e) => {
+              e.preventDefault();
+              handleOpenLegalModal("privacy");
+            }}
+            className="hover:text-slate-300 transition-colors"
+          >
+            Privacy Policy
+          </a>
+          <a
+            href="#"
+            onClick={(e) => {
+              e.preventDefault();
+              handleOpenLegalModal("terms");
+            }}
+            className="hover:text-slate-300 transition-colors"
+          >
+            Terms of License
+          </a>
+          <a
+            href="#"
+            onClick={(e) => {
+              e.preventDefault();
+              handleOpenLegalModal("whitepaper");
+            }}
+            className="hover:text-slate-300 transition-colors"
+          >
+            Security Whitepaper
+          </a>
         </div>
       </footer>
 
@@ -1280,6 +1313,12 @@ const LandingPage = () => {
         monthlyApprovalCount={monthlyApprovalCount}
         totalHoursSaved={Math.round(monthlyApprovalCount * avgApprovalTimeDays * 1.5)}
       />
+
+      <LegalModal
+        isOpen={isLegalModalOpen}
+        onClose={() => setIsLegalModalOpen(false)}
+        initialTab={legalModalTab}
+      />
     </div>
   );
 };
```
