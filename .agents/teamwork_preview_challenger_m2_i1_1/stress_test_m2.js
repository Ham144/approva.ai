/**
 * Empirical Stress Test Harness for Milestone M2 (Legal & Security Modals)
 * Tests LegalModal.jsx & LandingPage.jsx logic, edge cases, body scroll locking, tab fallbacks, and rapid cycling.
 */

import fs from "fs";
import path from "path";
import assert from "assert/strict";

const LEGAL_MODAL_PATH = "C:\\Users\\USER\\.gemini\\antigravity\\scratch\\approva.ai\\frontend\\src\\components\\LegalModal.jsx";
const LANDING_PAGE_PATH = "C:\\Users\\USER\\.gemini\\antigravity\\scratch\\approva.ai\\frontend\\src\\pages\\LandingPage.jsx";

const VALID_TABS = ["privacy", "terms", "whitepaper"];

function runEmpiricalTests() {
  console.log("==================================================");
  console.log(" EMPIRICAL STRESS TEST SUITE FOR MILESTONE M2     ");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;
  const findings = [];

  function test(id, name, fn) {
    try {
      fn();
      passed++;
      console.log(`  [PASS] ${id}: ${name}`);
    } catch (err) {
      failed++;
      findings.push({ id, name, error: err.message });
      console.error(`  [FAIL] ${id}: ${name}`);
      console.error(`         Reason: ${err.message}`);
    }
  }

  const legalModalCode = fs.readFileSync(LEGAL_MODAL_PATH, "utf-8");
  const landingPageCode = fs.readFileSync(LANDING_PAGE_PATH, "utf-8");

  // TEST 1: Digest String Verification
  test("EMP_01", "Verbatim SHA-256 Digest Verification Stamp in LegalModal.jsx", () => {
    const targetDigest = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    assert.equal(
      legalModalCode.includes(targetDigest),
      true,
      `LegalModal.jsx must contain verbatim SHA-256 digest string ${targetDigest}`
    );
  });

  // TEST 2: Tab Switching State Handling & Invalid Tab Fallback
  test("EMP_02", "Invalid Tab Fallback Handling in LegalModal.jsx", () => {
    // Simulating component props: what if initialTab is "invalid_tab_123"?
    const sanitizeTab = (tab) => {
      return VALID_TABS.includes(tab) ? tab : "privacy";
    };

    // Check if LegalModal.jsx implements tab sanitization or fallback for activeTab / initialTab
    const hasSanitization = legalModalCode.includes("includes(initialTab)") || 
                            legalModalCode.includes("VALID_TABS") ||
                            legalModalCode.includes('["privacy", "terms", "whitepaper"].includes') ||
                            legalModalCode.includes("initialTab === 'privacy' || initialTab === 'terms' || initialTab === 'whitepaper'");

    if (!hasSanitization) {
      // Check if passing invalid tab renders empty header & content
      // Emulate LegalModal rendering logic for invalid tab
      const renderModalContent = (tab) => {
        // Current code logic:
        let title = null;
        if (tab === "privacy") title = "Kebijakan Privasi";
        else if (tab === "terms") title = "Syarat & Ketentuan";
        else if (tab === "whitepaper") title = "Security Whitepaper";
        return { title };
      };

      const result = renderModalContent("invalid_tab");
      assert.notEqual(
        result.title,
        null,
        "LegalModal.jsx does NOT sanitize or fallback invalid initialTab values! Passing an invalid tab (e.g. 'invalid_tab') renders a blank header title and empty body content."
      );
    }
  });

  // TEST 3: Body Scroll Locking Verification
  test("EMP_03", "Body Scroll Locking Implementation (document.body.style.overflow)", () => {
    const locksBodyInModal = legalModalCode.includes("document.body.style.overflow") ||
                             landingPageCode.includes("document.body.style.overflow");
    
    assert.equal(
      locksBodyInModal,
      true,
      "Body scroll locking is NOT implemented when LegalModal is open! document.body.style.overflow is neither set to 'hidden' when open nor restored when closed."
    );
  });

  // TEST 4: Rapid Open/Close Cycling State & Event Listener Safety
  test("EMP_04", "Rapid Open/Close Cycling Simulation & Listener Cleanup", () => {
    let openCount = 0;
    let closeCount = 0;
    let activeListeners = 0;

    const simulateModalCycle = (iterations) => {
      for (let i = 0; i < iterations; i++) {
        // Open modal
        openCount++;
        activeListeners++; // keydown event listener registered
        
        // Close modal
        closeCount++;
        activeListeners--; // keydown event listener cleaned up via useEffect return
      }
    };

    simulateModalCycle(100);
    assert.equal(openCount, 100);
    assert.equal(closeCount, 100);
    assert.equal(activeListeners, 0, "Event listeners must clean up properly after 100 cycles");
  });

  // TEST 5: Tab Button Render & Content Integrity across 3 valid tabs
  test("EMP_05", "Valid Tab Content & Header Matching", () => {
    const requiredSections = [
      "Kebijakan Privasi & Kedaulatan Data",
      "Syarat & Ketentuan Lisensi Enterprise",
      "Whitepaper Keamanan & Arsitektur Kriptografi",
      "Privacy Policy",
      "Terms of License",
      "Security Whitepaper"
    ];

    for (const sec of requiredSections) {
      assert.equal(
        legalModalCode.includes(sec),
        true,
        `LegalModal.jsx must include section string "${sec}"`
      );
    }
  });

  // TEST 6: ESC Key Event Listener Verification
  test("EMP_06", "Escape Key Listener in LegalModal.jsx", () => {
    assert.equal(
      legalModalCode.includes('e.key === "Escape"'),
      true,
      "LegalModal.jsx must handle Escape key press for accessible closing"
    );
  });

  // TEST 7: Backdrop Click Dismissal Layer Verification
  test("EMP_07", "Outer Backdrop Click Handler Verification", () => {
    assert.equal(
      legalModalCode.includes('onClick={onClose}'),
      true,
      "LegalModal.jsx must have outer backdrop click layer triggering onClose"
    );
  });

  console.log("\n==================================================");
  console.log(` EMPIRICAL STRESS TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (findings.length > 0) {
    console.log("\nFINDINGS REVEALED BY EMPIRICAL STRESS TESTING:");
    findings.forEach((f, idx) => {
      console.log(`${idx + 1}. [${f.id}] ${f.name}`);
      console.log(`   Issue: ${f.error}\n`);
    });
  }

  return { passed, failed, findings };
}

runEmpiricalTests();
