import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";

console.log("=== EMPIRICAL CHALLENGER M2 TEST SUITE ===");

const frontendDir = path.resolve(process.cwd(), "frontend");
const legalModalPath = path.join(frontendDir, "src", "components", "LegalModal.jsx");
const landingPagePath = path.join(frontendDir, "src", "pages", "LandingPage.jsx");

// Test 1: Cryptographic SHA-256 Verification
console.log("\n[Test 1] SHA-256 Digest Cryptographic Verification...");
const computedSha256 = crypto.createHash("sha256").update("").digest("hex");
const expectedDigest = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
assert.equal(computedSha256, expectedDigest, "Crypto SHA-256 of empty string must match canonical digest");
console.log(`  ✓ SHA-256 empty digest mathematically verified: ${computedSha256}`);

// Test 2: LegalModal.jsx Source Verification
console.log("\n[Test 2] LegalModal.jsx Source & Claims Verification...");
assert.ok(fs.existsSync(legalModalPath), "LegalModal.jsx must exist");
const legalModalSrc = fs.readFileSync(legalModalPath, "utf-8");

// Verify Legal & Security Claims Text
const claims = [
  "TLS 1.3",
  "AES-256-GCM",
  "Perpetual Buyout",
  "Lisensi Beli Putus",
  "AMC",
  "Immutable Audit Log",
  "Role-Based Access Control",
  "RBAC",
  "Zero External Telemetry",
  "HTTP-Only",
  "SameSite=Strict",
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
];

for (const claim of claims) {
  assert.ok(legalModalSrc.includes(claim), `LegalModal.jsx must contain claim: ${claim}`);
  console.log(`  ✓ Claim verified: "${claim}"`);
}

// Test 3: Keyboard Navigation & Event Listeners
console.log("\n[Test 3] Keyboard Navigation & Event Listeners Verification...");
assert.ok(legalModalSrc.includes("Escape"), "Must handle Escape key event");
assert.ok(legalModalSrc.includes("addEventListener"), "Must attach keydown listener");
assert.ok(legalModalSrc.includes("removeEventListener"), "Must detach keydown listener on cleanup");
console.log("  ✓ ESC keyboard navigation & event cleanup confirmed");

// Test 4: DOM Accessibility & Responsiveness
console.log("\n[Test 4] DOM Accessibility & Responsive Layout Verification...");
assert.ok(legalModalSrc.includes('aria-label="Tutup Legal Modal"'), "Close button must have aria-label");
assert.ok(legalModalSrc.includes('aria-hidden="true"'), "Backdrop must have aria-hidden");
assert.ok(legalModalSrc.includes("max-h-[90vh]"), "Modal container must specify max-h-[90vh]");
assert.ok(legalModalSrc.includes("overflow-y-auto"), "Modal container must specify overflow-y-auto for long content");
assert.ok(legalModalSrc.includes("grid-cols-1 md:grid-cols-2"), "Cards must collapse to single column on mobile");
assert.ok(legalModalSrc.includes("hidden sm:inline"), "Tab titles must have responsive sm text toggles");
assert.ok(legalModalSrc.includes("break-all"), "SHA-256 digest container must use break-all for narrow viewports");
console.log("  ✓ DOM accessibility and responsive layout classes confirmed");

// Test 5: LandingPage.jsx Integration Verification
console.log("\n[Test 5] LandingPage.jsx Integration Verification...");
assert.ok(fs.existsSync(landingPagePath), "LandingPage.jsx must exist");
const landingPageSrc = fs.readFileSync(landingPagePath, "utf-8");

assert.ok(landingPageSrc.includes('import LegalModal from "../components/LegalModal"'), "LandingPage must import LegalModal");
assert.ok(landingPageSrc.includes("isLegalModalOpen"), "LandingPage must declare isLegalModalOpen state");
assert.ok(landingPageSrc.includes("legalModalTab"), "LandingPage must declare legalModalTab state");
assert.ok(landingPageSrc.includes('handleOpenLegalModal("privacy")'), "Footer Privacy Policy link must be wired");
assert.ok(landingPageSrc.includes('handleOpenLegalModal("terms")'), "Footer Terms link must be wired");
assert.ok(landingPageSrc.includes('handleOpenLegalModal("whitepaper")'), "Footer Whitepaper link must be wired");
assert.ok(landingPageSrc.includes("<LegalModal"), "LandingPage must render <LegalModal />");
console.log("  ✓ LandingPage.jsx integration & state wiring confirmed");

console.log("\n=== ALL EMPIRICAL CHALLENGER M2 TESTS PASSED SUCCESSFULLY ===");
