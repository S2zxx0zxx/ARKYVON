# ADR-0001 — ARKYVON foundation and license gate

Status: Accepted for bootstrap (2026-11-22). This is not a commercial-distribution approval.

## Facts observed

The newly initialized upstream repository was limited to README.md and GNU AGPL-3.0 LICENSE on main. **Do not replace the license or assert that generated games may be released as proprietary without legal assessment.** Users and downstream game developers must review the effect of AGPL-3.0 on their use, distribution, combinations with proprietary content and network services. This ADR does not offer legal advice.

## Decision

- Establish a TypeScript-first vendor-neutral headless runtime with no browser access in gameplay code.
- Game state and simulation use fixed steps; render adapters and physics adapters are plugin dependencies, not part of the headless kernel.
- The browser prototype intentionally uses only Canvas 2D as a diagnostic scaffold. It is not the production renderer or a substitute for PixiJS.
- Stage PixiJS, Babylon.js, Rapier, Havok and other OSS adoption behind licensing, dependency-pin, security and target-device acceptance gates. Do not represent an uninstalled OSS tool as already integrated.
- The project generator must not overwrite existing directories; untrusted names are validated.
- Existing Chess and planned Bubble projects are separate acceptance consumers; the included match grid is only a reference sample, not the completed Bubble product.

## Remaining decisions

- Current AGPL coverage and copyright ownership review; determine desired licensing strategy explicitly.
- Product-specific Android, browser and low-end device budget matrix.
- Dependency versions, SBOM, upstream licensing audit, PixiJS/Babylon integration proof.
- Performance measurement on actual devices; shipping gate must remain blocked until verified.
