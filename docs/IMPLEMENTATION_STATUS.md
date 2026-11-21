# ARKYVON — implementation status (2026-11-22)

Base: new repository with README and AGPL-3.0. This report does not claim end-to-end platform or physical Android acceptance.

| Capability | Status | Evidence |
| --- | --- | --- |
| CAP-02-001 fixed-step loop | IMPLEMENTED / local unit-test | `src/core/fixed-step-loop.ts`, `tests/kernel.test.mjs` |
| CAP-02-005 seeded RNG | IMPLEMENTED / local unit-test | `src/core/seeded-random.ts`, tests |
| CAP-02-004 scene transitions | PARTIAL | `src/core/scenes.ts`; async loading, interruption and advanced rollback pending |
| CAP-02-012 event commands | PARTIAL | typed bus and command log; serializable public schema pending |
| CAP-02-013 DI and plugin lifecycle | PARTIAL | plugin topological installation, disposal; service scoping pending |
| CAP-10 source asset registry | PARTIAL | hash metadata and DAG; actual asset hashing/cooking/transcoding pending |
| CAP-13 persistence | PARTIAL | versioned envelope and migration hook; IndexedDB transactional saves pending |
| Game manifest | IMPLEMENTED / local unit-test | `src/contracts/project-manifest.ts` |
| Match-3 reference prototype | IMPLEMENTED / local unit-test | `src/game/match-grid.ts`, HTML canvas sample |
| PixiJS/Babylon/Rapier integration | NOT IMPLEMENTED | vendor-neutral interfaces only |
| Visual Developer Studio | NOT IMPLEMENTED | no graphical editor |
| Android builds | NOT IMPLEMENTED | no Gradle/Capacitor project |
| Multiplayer | NOT IMPLEMENTED | no server |
| Existing Chess integration | NOT IMPLEMENTED | no changes to Chess repository |
| Full 391 requirement coverage | PLANNED | design register only, implementation evidence per ID still needed |

## Release gates

All production, Android, accessibility, security, distribution, multiplayer scalability, independent two-game-reuse, and device-performance acceptance gates remain **BLOCKED / NOT TESTED**. A green unit-test run proves only bootstrap-level behavior.

## Next dependency sequence

1. Import authoritative 391 CAP records as machine-readable manifest; reconcile with this status report.
2. Configure dependency governance: exact version pinning, CI install, SBOM, lockfile and license inventory.
3. Implement PixiJS 2D adapter with integration tests and graphics memory profiling.
4. Add Babylon.js 3D adapter and physics via capability negotiation, not global bundle.
5. Validate two distinct real games on actual Web/PWA + Android devices before calling the runtime reusable and production-ready.
