# ARKYVON

**Create Worlds. Build Beyond.**

ARKYVON is an OSS-first, TypeScript-first game-engine ecosystem under active development. This repository currently contains a **headless engine foundation and a small browser match-grid prototype**. It is **not** a completed 2D/3D game engine or production-ready game studio.

## What works in this bootstrap

- Fixed-step simulation with pause/resume, monotonic-clock checks and catch-up cap
- Seeded deterministic random interface and command log
- Typed event bus, plugin dependency resolution and rollback
- Scene lifecycle, input queue and strict game-project manifest validation
- Versioned saves with migration/validation; asset registry with dependency ordering
- First-stage asset cooker: content SHA-256, source magic/size checks, required SPDX license field, deterministic output index and safe path checks; **no texture compression yet**
- Vendor-neutral render and physics contracts
- Testable match-3 game-model example and Canvas-only browser prototype
- Small game-manifest scaffold generator; offline unit test suite

## Run locally

```bash
npm install --no-audit --no-fund
npm test
node tools/create-game.mjs my-new-game 2d
# Optional: node tools/asset-cooker.mjs <source-root> <out-dir> <asset-manifest.json>
python3 -m http.server 8080
```

After `npm test` creates `dist/`, visit `http://localhost:8080/examples/bubble/` for the sample. Host from the repository root so `/dist` imports resolve. Node 22+ is required. For production, bundle/minify a per-game package; do not ship this development layout.

## Roadmap and provenance

See `docs/ADR-0001-runtime-and-licensing.md` and `docs/IMPLEMENTATION_STATUS.md` for verified versus pending features. Read `docs/blueprints/SGE_NEXT_MASTER_BLUEPRINT_v3.md` and `docs/blueprints/SGE_NEXT_391_FEATURE_OSS_IMPLEMENTATION_PLAN_v4.md` (original design snapshots), plus `docs/capability-register.json` for per-feature planning/implementation status. Preserve original CAP IDs. Import and reconcile those registers without claiming all 391 features implemented.

## License note

The repository's existing `LICENSE` is **GNU AGPL-3.0**. It has been preserved. The implications of combining the engine with separately distributed games require explicit review before adopting a commercial game release strategy. Third-party engine dependencies and creative assets have separate licensing conditions.
