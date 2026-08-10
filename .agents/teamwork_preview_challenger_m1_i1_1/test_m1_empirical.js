/**
 * Empirical Stress-Testing Harness for Milestone M1 (ROI Financial Exporter)
 * Approva.ai - Challenger 1
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("==========================================================");
console.log(" EMPIRICAL STRESS-TEST SUITE FOR MILESTONE M1 (ROI CALCULATOR)");
console.log("==========================================================\n");

// Helper function duplicating LandingPage.jsx ROI calculation logic
function calculateRoi(employeeCount, avgApprovalTimeDays) {
  const hourlyCost = 85000;
  const monthlyApprovalCount = Math.round(employeeCount * 1.8);
  const hoursSavedPerApproval = avgApprovalTimeDays * 1.5;
  const monthlySavingsRp = Math.round(
    monthlyApprovalCount * hoursSavedPerApproval * (hourlyCost * 0.4)
  );
  const totalHoursSaved = Math.round(monthlyApprovalCount * avgApprovalTimeDays * 1.5);
  const manualHours = Math.round(monthlyApprovalCount * avgApprovalTimeDays * 3);
  const approvaHours = Math.round(monthlyApprovalCount * avgApprovalTimeDays * 1.5);

  const manualCost = Math.round(monthlyApprovalCount * avgApprovalTimeDays * 1.5 * 85000);
  const approvaCost = Math.round(monthlyApprovalCount * avgApprovalTimeDays * 1.5 * 85000 * 0.6);
  const annualSavings = monthlySavingsRp * 12;

  return {
    employeeCount,
    avgApprovalTimeDays,
    monthlyApprovalCount,
    hoursSavedPerApproval,
    totalHoursSaved,
    monthlySavingsRp,
    manualHours,
    approvaHours,
    manualCost,
    approvaCost,
    savingsDifference: manualCost - approvaCost,
    annualSavings,
  };
}

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

// Test 1: Minimum Slider Boundaries (20 employees, 1 approval day)
runTest("Boundary: Min Sliders (20 emp, 1 day)", () => {
  const res = calculateRoi(20, 1);
  assert.equal(res.monthlyApprovalCount, 36);
  assert.equal(res.hoursSavedPerApproval, 1.5);
  assert.equal(res.totalHoursSaved, 54);
  assert.equal(res.monthlySavingsRp, 1836000);
  assert.equal(res.annualSavings, 22032000);
  assert.equal(res.manualCost - res.approvaCost, res.monthlySavingsRp);
});

// Test 2: Default Slider State (85 employees, 5 approval days)
runTest("Default State (85 emp, 5 days)", () => {
  const res = calculateRoi(85, 5);
  assert.equal(res.monthlyApprovalCount, 153);
  assert.equal(res.hoursSavedPerApproval, 7.5);
  assert.equal(res.totalHoursSaved, 1148);
  assert.equal(res.monthlySavingsRp, 39015000);
  assert.equal(res.annualSavings, 468180000);
  assert.equal(res.manualCost - res.approvaCost, res.monthlySavingsRp);
});

// Test 3: Maximum Slider Boundaries (500 employees, 14 approval days)
runTest("Boundary: Max Sliders (500 emp, 14 days)", () => {
  const res = calculateRoi(500, 14);
  assert.equal(res.monthlyApprovalCount, 900);
  assert.equal(res.hoursSavedPerApproval, 21);
  assert.equal(res.totalHoursSaved, 18900);
  assert.equal(res.monthlySavingsRp, 642600000);
  assert.equal(res.annualSavings, 7711200000);
  assert.equal(res.manualCost - res.approvaCost, res.monthlySavingsRp);
});

// Test 4: Extreme Zero Boundary (0 employees, 0 approval days)
runTest("Edge Case: Zero Inputs (0 emp, 0 days)", () => {
  const res = calculateRoi(0, 0);
  assert.equal(res.monthlyApprovalCount, 0);
  assert.equal(res.hoursSavedPerApproval, 0);
  assert.equal(res.totalHoursSaved, 0);
  assert.equal(res.monthlySavingsRp, 0);
  assert.equal(res.annualSavings, 0);
  assert.equal(Number.isNaN(res.monthlySavingsRp), false);
});

// Test 5: Enterprise Large Boundary (10,000 employees, 30 approval days)
runTest("Edge Case: Enterprise Large (10000 emp, 30 days)", () => {
  const res = calculateRoi(10000, 30);
  assert.equal(res.monthlyApprovalCount, 18000);
  assert.equal(res.hoursSavedPerApproval, 45);
  assert.equal(res.totalHoursSaved, 810000);
  assert.equal(res.monthlySavingsRp, 27540000000); // 27.54 Miliar Rp
  assert.equal(res.annualSavings, 330480000000); // 330.48 Miliar Rp
  assert.equal(res.manualCost - res.approvaCost, res.monthlySavingsRp);
});

// Test 6: Check exact file existence & critical code features in RoiStatementModal.jsx
runTest("Static Code Audit: RoiStatementModal.jsx", () => {
  const filePath = path.resolve("C:/Users/USER/.gemini/antigravity/scratch/approva.ai/frontend/src/components/RoiStatementModal.jsx");
  assert.equal(fs.existsSync(filePath), true, "File must exist");
  const content = fs.readFileSync(filePath, "utf-8");

  // Check critical imports
  assert.equal(content.includes('import { jsPDF } from "jspdf";'), true);
  assert.equal(content.includes('import autoTable from "jspdf-autotable";'), true);

  // Check window.print call
  assert.equal(content.includes("window.print()"), true);

  // Check @media print CSS
  assert.equal(content.includes("@media print"), true);
  assert.equal(content.includes(".no-print"), true);
  assert.equal(content.includes(".print-area"), true);

  // Check ESC key handler
  assert.equal(content.includes('e.key === "Escape"'), true);

  // Check exact header text requirement
  assert.equal(content.includes("APPROVA.AI - EXECUTIVE FINANCIAL SAVINGS STATEMENT"), true);
});

// Test 7: Static Code Audit: LandingPage.jsx ROI integration
runTest("Static Code Audit: LandingPage.jsx ROI wiring", () => {
  const filePath = path.resolve("C:/Users/USER/.gemini/antigravity/scratch/approva.ai/frontend/src/pages/LandingPage.jsx");
  assert.equal(fs.existsSync(filePath), true, "File must exist");
  const content = fs.readFileSync(filePath, "utf-8");

  // Check RoiStatementModal import
  assert.equal(content.includes('import RoiStatementModal from "../components/RoiStatementModal";'), true);

  // Check state
  assert.equal(content.includes("const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);"), true);

  // Check trigger button
  assert.equal(content.includes("Cetak / Ekspor Laporan Finansial (PDF)"), true);
  assert.equal(content.includes("setIsRoiModalOpen(true)"), true);

  // Check component invocation with props
  assert.equal(content.includes("<RoiStatementModal"), true);
  assert.equal(content.includes("isOpen={isRoiModalOpen}"), true);
  assert.equal(content.includes("employeeCount={employeeCount}"), true);
  assert.equal(content.includes("avgApprovalTimeDays={avgApprovalTimeDays}"), true);
  assert.equal(content.includes("monthlySavingsRp={monthlySavingsRp}"), true);
});

console.log("\n==========================================================");
console.log(` SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log("==========================================================");

process.exit(failed === 0 ? 0 : 1);
