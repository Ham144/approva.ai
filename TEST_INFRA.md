# E2E Test Infra: Approva.ai Frontend Optimization

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | R1. ROI Financial Statement Export | R1 | 5 | 5 | ✓ |
| 2 | R2. Interactive Legal & Security Modals | R2 | 5 | 5 | ✓ |
| 3 | R3. Micro-Interactions & Active Scroll Nav | R3 | 5 | 5 | ✓ |

## Test Architecture
- Test runner: Custom Node.js assertion harness executing in `frontend/test/e2e_suite.js`.
- Invocations: `node frontend/test/e2e_suite.js` (runs full test suite across Tiers 1-4).
- Expected: All 38 tests pass with exit code 0.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Executive ROI Export & Print Workflow | R1, R3 | Medium |
| 2 | Enterprise Legal & Security Due Diligence Audit | R2, R3 | Medium |
| 3 | Vendor Share Public Link Copy & Interaction | R3 | Low |
| 4 | Complete Landing Page Client Journey | R1, R2, R3 | High |
| 5 | Full Production Vite Build & Bundle Integrity | R1, R2, R3 | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature (15 total)
- Tier 2: ≥5 per feature (15 total)
- Tier 3: pairwise coverage of major feature interactions (3 total)
- Tier 4: ≥5 realistic application scenarios (5 total)
- **Total test cases**: 38 test cases
