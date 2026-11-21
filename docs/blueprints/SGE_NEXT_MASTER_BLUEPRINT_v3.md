# SGE NEXT — MASTER BLUEPRINT & CONTINUITY RECORD v3.0

> **Single source of truth for future sessions.** This file preserves the complete 22 Nov 2026 SGE NEXT v2.0 research and 391-capability inventory **verbatim below**, with a v3.0 continuation/decision-control layer above it. No game engine has been implemented by creating this document.
>
> **Created:** 2026-11-22 (Asia/Kolkata)  
> **Project:** SGE NEXT (working name; branding not registered or finalized)  
> **Document status:** proposed architecture + immutable carry-forward baseline; not a code audit, not a production acceptance report  
> **Priority:** zero-paid-software-first, real scalability and correctness, end-to-end game lifecycle  
> **Original v2.0 source SHA-256:** `70cd87c5178f542aedd929915aae7664cb103d1341ad8da03c300267d5c9a5d0`  
> **Authoritative source for implementation status:** future verified repositories/PRs, tests, real-device benchmarks and release artifacts—not this plan alone.

## Start here whenever the project continues

This is **not** a request to invent a new engine design from scratch. Read this entire MD (or at minimum its decisions, capability ledger, open issues and release gates). Check the *latest* connected repositories, code and actual implementation status before proposing or changing code. Track new decisions in the changelog; never erase past requirements without a documented replacement. If file and actual repo conflict, mark a discrepancy, inspect evidence and reconcile; do not claim either is complete without proof.

### User's non-negotiable goals (locked as intent)

1. Build **one independently controlled, professional-grade reusable game ecosystem** for many future games, not a single-game framework or just a graphical mockup.
2. Reuse and continuously improve common modules across new games; do not rewrite menus, animations, audio, input, saving, packaging and QA for each game.
3. Support both **2D and 3D** through modular adapters. Initial distribution: **Web/PWA and Android**, with responsive UX and offline-first support where possible.
4. Prefer **₹0 paid software** and genuine open-source technology, but select libraries by security, license, maintenance, stability and performance—not by quantity. No blind repo scraping or indiscriminate copying.
5. Treat the full path **concept → PRD/TRD → art/storyboards/characters/skills/VFX → content → implementation → optimization → testing → publishing → analytics/live updates → maintenance/EOL** as one repeatable production lifecycle.
6. Strong polish: animated characters/level-ups, responsive controls/UI, sound, visuals and distinct game brands. Core game-specific creative work is still human-designed/reviewed.
7. Enforce scale as **two separate dimensions**: many independently versioned games, and optional large multiplayer concurrency validated by load tests and operational budget.
8. Protect existing work—especially the **TypeScript/Babylon Chess game**. Audit repo before migrating; preserve current behaviour/visual identity. **Bubble Puzzle** is the second genuine distinct engine reuse proof.
9. Never claim "perfect accuracy", "no bugs", "100% future coverage", "20k CCU supported" or "free forever" without proper evidence. User wants exact, non-speculative status and no unnecessary paid services.
10. Every capability must be traceable: source, priority, status, dependency, tests, platform and acceptance evidence. Unknowns go into a new requirements/risks register, never silently omitted.

## Frozen architectural design baseline (choices vs experiments)

| Area | Proposed baseline | Caveat / proof required |
|---|---|---|
| Core | TypeScript-first modular runtime, composition/ECS, fixed-step simulation, state/scene/input lifecycle | Exact ECS strategy and measurable determinism need tests |
| 2D | PixiJS renderer adapter | Only load in games requiring 2D; verify target WebViews |
| 3D | Babylon.js renderer adapter | GPU profiles/thermal tests before claiming heavy 3D viability |
| 2D physics | Rapier plugin | Not mandatory for rules-only Chess/Puzzle games |
| 3D physics | Babylon/Havok adapter | Physics determinism and platform compatibility not assumed |
| Performance extensions | Rust + WASM only when benchmarking proves benefit | Premature dual-language complexity is prohibited |
| Studio | React/Vite visual editor plus local CLI | Editor is separate from game binary; no huge editor as P0 runtime dependency |
| Android | Capacitor initially | Browser/WebView wrapper != native 3D performance; later native/ Godot adapter conditional |
| Browser | Progressive Web App, WebGL2 baseline, WebGPU feature-detection | WebGPU unavailable or unstable on some devices |
| Asset factory | Hashed provenance, licenses, import recipes, dependent incremental cooking, optimized platform variants | Original editable masters retained, copyright/security checks before use |
| Game SDK | Versioned plugins, manifests, templates, UI themes, genre-neutral foundation | Genre-specific algorithms/characters/levels remain game projects |
| Automated QA | Unit, simulation, replay, visual, E2E, browser/Android hardware tests, performance/soak/security | Human playtests and release approvals still required |
| Multiplayer | Optional Colyseus authoritative adapter + separate backend plane | Scale, latency, ops cost and security need workload-specific load testing |
| Operations | Per-game releases, staged rollout, signed artifacts, rollback, telemetry | Google Play policies/fees and infra cost may change |

**Do not switch these implementation choices silently.** New evidence can justify ADR-recorded changes with migration implications and tests.

## Scope and implementation truth

- **391 unique `CAP-xx-xxx` requirements** across **20 engineering domains** verified by parsing the preserved v2.0 source; each is **PROPOSED / acceptance PENDING** there.
- **14 lifecycle gates** `G00–G13` are defined. They are design gates, not completed certifications.
- **8 delivery stages** `A–H` define sequence and their proof requirements; not implementation milestones reached.
- **14 explicit unknowns** `U01–U14` remain open in the v2.0 plan, pending repo/device/legal/product validation.
- **Initial games:** (1) Chess migration/adapter without rewriting upfront, (2) Bubble Puzzle as independent second test, (3) optional platformer/vehicle physics fixture.
- **Done now:** architecture study and master planning documentation. **Not done/verified:** repo inspection, engine source implementation, working Studio, performance measurement, certified Android builds, gameplay parity, load scaling, production release.

### 20-domain coverage index (source-preserved)

| # | Domain | Requirements | Status |
|---|---|---:|---|
| 01 | Product Governance | 16 | Proposed / acceptance pending |
| 02 | Runtime Core | 19 | Proposed / acceptance pending |
| 03 | Rendering | 20 | Proposed / acceptance pending |
| 04 | Physics | 17 | Proposed / acceptance pending |
| 05 | Input | 15 | Proposed / acceptance pending |
| 06 | Audio | 15 | Proposed / acceptance pending |
| 07 | Animation | 17 | Proposed / acceptance pending |
| 08 | Gameplay SDK | 20 | Proposed / acceptance pending |
| 09 | AI/NPC | 14 | Proposed / acceptance pending |
| 10 | Asset Factory | 25 | Proposed / acceptance pending |
| 11 | Developer Studio | 27 | Proposed / acceptance pending |
| 12 | UI/UX | 22 | Proposed / acceptance pending |
| 13 | Persistence | 18 | Proposed / acceptance pending |
| 14 | Networking | 23 | Proposed / acceptance pending |
| 15 | Build & Release | 23 | Proposed / acceptance pending |
| 16 | Quality Lab | 27 | Proposed / acceptance pending |
| 17 | LiveOps | 21 | Proposed / acceptance pending |
| 18 | Distribution & Monetization | 16 | Proposed / acceptance pending |
| 19 | Developer Experience | 20 | Proposed / acceptance pending |
| 20 | Security | 16 | Proposed / acceptance pending |
| **Total** | | **391** | **Proposal only** |

## Explicit core subsystems: completeness review map

The 391-capability registry below is authoritative; this cross-cutting map prevents entire processes being mistaken for one library import.

**Runtime and lifecycle:** scheduler, fixed-step update/render interpolation, ECS and scene graph boundaries, state machines, event/command bus, dependency injection, cancellation, disposal, foreground/background, resilience, profiling and reproducible replay.

**Graphics, physics and animation:** 2D/3D render adapters, cameras, sprite batching/atlases, PBR/material/shaders, lighting/shadows, GPU fallback, LOD, occlusion, particles, VFX/kill effects, skeleton rigs/animation blends, animation state machines, visual timelines and cutscenes; input/touch/gamepads, collisions, controlled simulation, vehicles, character movement.

**Game-specific content:** unique story/bible, level and mission design, 2D/3D characters, class roles, skills, cooldowns, level-up sequences, damage/buffs, inventory, rewards, economy, victory/defeat, balancing, puzzles, replay and AI difficulty. Feature types become templates; actual content cannot be deduced correctly by the engine without design input.

**UI/UX and content accessibility:** branded splash/welcome/tutorial, onboarding, HUD, home/settings/pause/results, transitions, safe area, viewport/orientation, color and typography tokens, localization, readable touch targets, screen reader/reduced motion consideration, device density and offline feedback.

**Asset content life cycle:** creator/source/provenance, license/attribution, raw editable asset, import validation, malware/untrusted-file policy, size/format, device-specific compression, dependency graph, stable asset IDs, immutable bundles, catalog/version signing, cache invalidation and rollback.

**Studio and developer workflow:** scene tree, transforms, inspectors, prefab system, property editing, undo/redo transactions, drag-and-drop and snapping, tile/world editing, animation timeline, live preview, visual debug overlays, templates, CLI, docs, plugin registry, SDK and schema migrations.

**Quality/Security/Release:** tests against game rules, state recovery, offline/PWA service-worker updates, package signing, version compatibility, SBOM and licenses, real Android hardware, FPS p50/p95/p99/thermal, memory/VRAM, app size and startup, crash/ANR, E2E, accessibility, data safety, compliance, staged rollout, rollbacks and telemetry.

**Future scale:** authoritative match rooms and validations, matchmaking, anti-abuse, timeouts/reconnect, packet loss, client prediction/reconciliation where required, separation of match server from durable DB, observability, autoscaling and cost limits. No platform-wide DB or multiplayer dependency for standalone offline games.

## Studio automation — exact promises and limits

**Game Factory may generate:** folder/repo skeleton, engine manifest, dependency lock, templates, responsive design tokens, screen/state placeholders, asset folders/provenance metadata, save schemas, sample tests, Android/Web build configs, release checklist, QA matrix and CI pipelines.

**It cannot truthfully guarantee:** a complete original fun game, polished characters or story without artist/creator input, unbreakable interactions, universal high FPS, all Android GPU support, IP-cleared assets without provenance, zero server costs, store acceptance or instantaneous automatic upgrades across already released games.

**Upgrade contract:** central engine publishes a semver package; each game pins a tested version; dependabot-like upgrade proposal can be automated; CI + visual + device tests gate adoption; release each game independently with rollout and recovery. Engine fixes **do not** magically hot-update previously published games.

## Quality budgets and design gates (proof not assumptions)

- Prefer 60 FPS only on a named device target; 16.67 ms total frame interval at 60 FPS and configurable 30 FPS fallback. Do not invent a universal game size, startup time, RAM threshold or 20,000 CCU result.
- Define budgets for startup, network download, runtime memory/VRAM, storage use, battery/thermal, frame time, input latency, crash rate and error recovery **per genre and supported device class**.
- Separate reproducible simulation logic from nondeterministic physics/rendering; verify cross-platform parity before making deterministic claims.
- Engine releases gate on API contracts, reproducible builds, license/security checks, representative benchmark games, save/content migrations and reference-game regressions.
- Game releases additionally gate on game-specific logic, playtesting, platform physical-device testing, accessibility, privacy/payment/compliance (only if applicable), store policies and release rollback.

## How to continue this project in future chats (handoff playbook)

1. **Load this exact master MD** from ChatGPT Library or from the user-provided artifact. Do not substitute a recalled synopsis for the full source when implementing.
2. Identify whether the task is architecture-only, repo review, or implementation. **Inspect the latest GitHub branches, PRs, workflows and dependencies before editing**; do not assume past PRs are still open, merged or green.
3. State what is **PROPOSED vs IMPLEMENTED vs VERIFIED**, with tests and evidence. Never convert requirements to complete based only on chat text or generated files.
4. Find matching `CAP-xx-xxx` rows, `Gxx` lifecycle gate, `Uxx` open decisions, and user requirements. If something is truly missing, add a new ID and source/rationale first.
5. Record changes as ADRs with alternatives, pros/cons, platform constraints, license checks, migration and rollback; do not overwrite original decisions or delete backlog without reconciliation.
6. For a feature, define interfaces, unit/integration/E2E tests, real-device acceptance, performance budget and dependency graph before coding.
7. Implement in bounded feature branches/PRs as appropriate; report exact tests passing, known blocks, pending manual actions and deployment requirements.
8. Update this MD's status ledger, changelog and links to artifacts after work. If user explicitly asks to replace the library copy, apply supported library update tools with conflict precautions.
9. On each continuation, use the latest checked actual state over stale plan text. Maintain provenance and clear unresolved status.
10. Treat "always remember" as a **retrieval and maintenance workflow**, not a technically guaranteed perfect model memory.

## Version & decision log

| Date | Revision | Decision / evidence | Status |
|---|---|---|---|
| 2026-11-22 | Early design | Custom reusable engine supporting many new games, not automatic perfect results | User goal |
| 2026-11-22 | v1 | Seven-layer modular architecture, PixiJS/Babylon.js, offline Web/Android, studio/SDK | Superseded in detail by v2, intent retained |
| 2026-11-22 | v2.0 | Cross-referenced real-world Unreal/Unity/Godot/O3DE/Bevy patterns; 20 domains, 391 capabilities, G00–G13, stages A–H, U01–U14 | Full preserved design below |
| 2026-11-22 | v3.0 | Added permanent project continuity, exact scope/status reconciliation, source hash and update protocol | Documentation created; code unchanged |

## Conflict resolution / change policy

- Only mark a capability verified with **specific reproducible evidence** and test IDs. A proposal, file or mockup is not a verified runtime.
- Never sacrifice existing Chess compatibility, privacy/security, device performance or content provenance for faster delivery without a documented trade-off and explicit user approval.
- If target device constraints conflict with desired visual fidelity, support graphics tiers and evidence-based trade-offs instead of silently degrading gameplay.
- New or previously overlooked features go into a dated addendum/register with unique IDs, priority and tests; there is no credible "nothing can ever be missed" certification.
- For external components, verify current official license, attribution, maintenance state, package version and security. This document's technology choices are proposals pending version-specific verification.

---

# Preserved v2.0 blueprint — complete original content

> The following block is the full unmodified SGE NEXT v2.0 markdown authored in the prior planning turn. It preserves the 391 individually numbered requirements, lifecycle gates, research sources, contracts, unknowns and implementation phases. New v3.0 summary above does not replace any entry.

# SGE NEXT v2.0 — Professional Game Engine & Production Platform

**Type:** researched architecture and full-scope design blueprint (not an implemented engine)  
**Date:** 2026-11-22  
**Operating model:** zero-paid-software-first; offline-first; Web/PWA + Android initially; optional multiplayer and other platforms later.  
**Primary migration constraint:** do **not** rewrite the existing TypeScript/Babylon Chess runtime as a prerequisite. Extract compatible shared systems behind stable interfaces first.  
**Confidence:** Architecture proposal based on official engine/platform documentation. Specific library versions, APIs, performance budgets and licensing are to be verified in implementation PRs.

> Scope honesty: no blueprint can truthfully guarantee that every future game, bug, platform, legal requirement or genre-specific mechanic has already been anticipated. The explicit register below plus a mandatory gap-discovery and acceptance process is the mechanism for managing unknowns without pretending they do not exist.

## 1. Research baseline and engineering findings

- **Unreal Engine** provides modular gameplay frameworks, asset manager/cooking, build/packaging automation, functional tests and multi-session Gauntlet validation. This demonstrates that content, packaging and test automation are first-class engine subsystems.
- **Unity** exposes reusable packages, Addressables/content dependency management, build automation and production workflows. It treats source content, import transformations, versioning and publishing as connected processes.
- **Godot** uses scenes/nodes/resources plus import/export pipelines and cross-platform deployment, illustrating reusable scene composition without rewriting low-level systems.
- **O3DE** has modular Gems, a unified Asset Processor, networking extensions and testing, demonstrating plugin boundaries and platform-specific content cooking.
- **Bevy** illustrates composable plugin-first ECS/schedule patterns.
- **Android** requires real-device profiling: frame pacing, background lifecycle, memory, thermal throttling, Play policies and target API/ABI constraints.

**Research sources:**
- Unreal gameplay architecture: https://dev.epicgames.com/documentation/unreal-engine/gameplay-framework-in-unreal-engine
- Unreal asset management: https://dev.epicgames.com/documentation/unreal-engine/asset-management-in-unreal-engine
- Unreal build automation: https://dev.epicgames.com/documentation/en-us/unreal-engine/building-multi-platform-games-in-unreal-engine
- Unreal automation testing: https://dev.epicgames.com/documentation/unreal-engine/automation-test-framework-in-unreal-engine
- Unity pipeline: https://docs.unity.com/en-us/unity-production-pipeline/overview
- O3DE concepts: https://docs.o3de.org/docs/welcome-guide/key-concepts/
- Godot stable docs: https://docs.godotengine.org/en/stable/
- Bevy plugins: https://bevy.org/learn/quick-start/getting-started/plugins/
- Android frame and thermal: https://developer.android.com/games/optimize/power
- Chrome WebGPU: https://developer.chrome.com/docs/web-platform/webgpu/overview/
- Multiplayer: https://docs.colyseus.io/

## 2. Product architecture / runtime policy

**One product suite, separate products inside:** Engine Runtime + Developer Studio + Asset Factory + Game SDK/Template Registry + Quality Lab + Build/Release Factory + optional Multiplayer/LiveOps + Observability/Governance.

**Primary runtime:** TypeScript-first, ECS/composition-based kernel, fixed-step simulation, optional 2D PixiJS adapter and 3D Babylon.js adapter. Renderer, physics, persistence and network remain behind interface boundaries. Use **WebGL2/WebGPU capability detection and fallback**; never require WebGPU on every Android browser/WebView. No eager dependency on both renderers. Rust/WASM only for demonstrated bottlenecks.  
**2D physics:** Rapier 2D plugin when physical collisions are needed; pure rule engines (Chess/Bubble) should not require full physics.  
**3D physics:** Babylon/Havok adapter for current compatibility; use reproducible versions and test behavior; alternative provider only via interface.  
**Android first:** Capacitor export as the initial Web-based build path, not a promise of native AAA performance; test WebView GPU/thermal compatibility. When heavy native 3D performance is required, evaluate a Godot/native backend as a **separate implementation**, not automatic 1:1 portability of existing TS runtime.  
**Multiplayer:** Colyseus adapter with authoritative server logic; turn-based rules and latency-sensitive game netcode have distinct implementations.

**No universal gameplay compatibility guarantee:** JSON manifests, asset schemas, UI tokens, content pipelines, logging protocols and server APIs can be shared across runtime backends. Existing TypeScript gameplay code is not automatically runnable inside a native/Godot engine; portability requires explicit bridging, rewriting, or a WASM-compatible core.

### 2.1 Runtime invariants
1. Fixed simulation step independent from render frame-rate; interpolation only for presentation.
2. Commands are validated before state mutations; gameplay state authoritative in its intended context.
3. Scenes, entities, resources and subscriptions have predictable ownership and disposal.
4. Every asynchronous operation has timeout, cancellation, error and recovery policies.
5. Runtime features are declared explicitly in the game manifest and optional modules remain tree-shakeable.
6. Saves and content catalogs are versioned separately from engine runtime and application builds.
7. Engine APIs carry semver and migration notes; no hidden breakage by automatic engine upgrades.
8. Offline mode remains functional for games not requiring online state.
9. Renderer/physics/platform SDK usage stays behind contracts; render adapters are not embedded in game rules.
10. A new game can be built from templates without modifying engine kernel source code.

## 3. End-to-end production lifecycle

| Gate | Lifecycle | Mandatory tangible output | Automated vs human check |
|---|---|---|---|
| G00 | Intake & concept | genre, audience, reference analysis, differentiation, non-goals | template auto, creative approval human |
| G01 | Discovery | core game-loop prototype, feasibility spikes, devices, budget | prototype smoke auto, fun approval human |
| G02 | PRD & TRD | mechanics, states, UI flows, architecture, data/contracts | schema validation auto, design approval human |
| G03 | Art/UX direction | palettes, style guide, storyboard, characters, accessibility | asset and layout tests auto, artwork approval human |
| G04 | Game project setup | pinned SDK, template, feature manifest, platform targets | one-command scaffold auto |
| G05 | Content creation | levels, sprites, models, voice, audio, animations | creator input human; previews automatic |
| G06 | Asset cooking | hashes, license ledger, transforms, compression, device variants | DAG dependency pipeline auto |
| G07 | Gameplay implementation | rules, controls, progression, saves, UI, multiplayer if required | CI and simulation tests auto |
| G08 | Integration | screens, camera, FX, audio, stores, accessibility | E2E/smoke auto + human feel testing |
| G09 | Quality/performance | device matrix, frame budgets, memory, load, security, legal | gates auto + physical device/human signoff |
| G10 | Release candidate | signed artifacts, SBOM, privacy and store declarations | build auto; publish approval human |
| G11 | Staged release | PWA deploy / Play rollout, rollback mechanism, support channels | scripts auto, staged approval human |
| G12 | Live operations | vitals, crashes, trends, content updates, abuse and cost | dashboards/alerts auto, incidents reviewed |
| G13 | Maintenance/EOL | dependency upgrades, save migrations, archival, deprecation | regression auto, release policy human |

A failed gate creates a BLOCKED issue with evidence; it never silently advances to READY. P0 failures block ship. Creative/artistic judgment and third-party store approvals cannot be guaranteed automatically.

## 4. Capability ledger

Legend: **P0** = foundation/mandatory baseline; **P1** = professional feature suite; **P2** = optional at runtime but designed at interfaces; **P3** = future specialist extensions. Entries are **planned** unless separately evidenced by source code and tests. Not every entry needs to be in every game binary.

### 01. P0: GOV — Product, game definition, governance
- [ ] **CAP-01-001** — Game product brief (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-002** — audience and genre profile (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-003** — target devices and input modes (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-004** — platform and minimum hardware policy (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-005** — game loop hypothesis (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-006** — core mechanic specification (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-007** — fun-factor playtest protocol (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-008** — PRD and TRD templates (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-009** — architecture decision records (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-010** — dependency and risk register (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-011** — feature scope and non-goals (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-012** — per-game acceptance contracts (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-013** — game lifecycle and ownership map (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-014** — budget and operating-cost ceilings (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-015** — release-readiness checklist (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-01-016** — open-gap and assumption register (status: PROPOSED; acceptance: PENDING)

### 02. P0: CORE — Runtime and execution
- [ ] **CAP-02-001** — Main loop and fixed-step simulation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-002** — render interpolation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-003** — scheduler and cancellation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-004** — scene lifecycle and transitions (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-005** — deterministic random seed interface (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-006** — simulation time versus wall time (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-007** — foreground/background/visibility lifecycle (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-008** — finite state machines (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-009** — ECS or composition framework (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-010** — entity identifiers and lifecycle (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-011** — component serialization (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-012** — event bus and commands (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-013** — dependency injection and service registry (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-014** — object pooling and memory budgets (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-015** — worker messaging where supported (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-016** — fault containment (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-017** — feature and capability detection (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-018** — restart and crash recovery (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-02-019** — structured error codes (status: PROPOSED; acceptance: PENDING)

### 03. P0/P1: RENDER — 2D/3D graphics
- [ ] **CAP-03-001** — 2D scene graph (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-002** — 2D sprite atlas and batching (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-003** — 2D lighting and masking (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-004** — text and bitmap font renderers (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-005** — 3D camera and projection (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-006** — mesh and material pipeline (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-007** — physically based materials where suitable (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-008** — skeletal animation rendering (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-009** — shadows and reflection tiers (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-010** — scene culling and occlusion (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-011** — level of detail and impostors (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-012** — particles and instancing (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-013** — post-processing and color grading (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-014** — shader library and compilation cache (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-015** — GPU context lost/recovery (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-016** — renderer backend abstraction (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-017** — fallback graphics capabilities (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-018** — dynamic resolution (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-019** — screenshot and golden image capture (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-03-020** — render debug overlays (status: PROPOSED; acceptance: PENDING)

### 04. P1: PHYS — Simulation, movement and collisions
- [ ] **CAP-04-001** — 2D and 3D physics adapters (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-002** — rigid body and collision layers (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-003** — trigger volumes and sensor events (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-004** — shape queries and raycasts (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-005** — continuous collision detection (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-006** — joints and constraints (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-007** — character controller (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-008** — vehicle dynamics plugin (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-009** — rope and cloth optional plugins (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-010** — fixed timestep policy (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-011** — broadphase and collision profiling (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-012** — physics debugging (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-013** — state snapshots (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-014** — collision filtering rules (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-015** — simulation replay (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-016** — numerical stability tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-04-017** — client/server physics compatibility constraints (status: PROPOSED; acceptance: PENDING)

### 05. P0: INPUT — Controls and usability
- [ ] **CAP-05-001** — Touch, gesture and multitouch (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-002** — mouse and keyboard (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-003** — gamepad mappings and hotplug (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-004** — virtual joystick (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-005** — action remapping and binding profiles (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-006** — sensitivity and dead zones (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-007** — hold/repeat/debounce semantics (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-008** — portrait and landscape input mapping (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-009** — keyboard focus navigation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-010** — screen safe areas (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-011** — mobile haptics (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-012** — low-latency input sampling (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-013** — input recording and replay (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-014** — accessibility input alternatives (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-05-015** — device-specific controls compatibility (status: PROPOSED; acceptance: PENDING)

### 06. P0/P1: AUDIO — Sound, dialogue, media
- [ ] **CAP-06-001** — Audio buses and per-channel volume (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-002** — one-shot and looping effects (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-003** — 2D/3D spatial sound (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-004** — music crossfades (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-005** — ducking and prioritization (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-006** — preload and streaming (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-007** — web autoplay recovery (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-008** — pause/resume and focus behavior (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-009** — voice-over and dialogue synchronization (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-010** — subtitles and captions (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-011** — silence and reduced-sound modes (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-012** — audio memory budgets (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-013** — audio quality tiers (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-014** — latency profiling (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-06-015** — media codec validation (status: PROPOSED; acceptance: PENDING)

### 07. P1: ANIM — Motion and cinematic systems
- [ ] **CAP-07-001** — Sprite-sheet animation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-002** — keyframe timelines (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-003** — tweening and easing (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-004** — skeletal animation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-005** — blend trees (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-006** — animation state graph (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-007** — layer masks (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-008** — additive animations (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-009** — procedural animation hooks (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-010** — event markers and hit frames (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-011** — inverse kinematics optional (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-012** — camera moves and shakes (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-013** — cutscene and dialogue sequencer (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-014** — transitions and VFX timelines (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-015** — animation import and retargeting policy (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-016** — animation deterministic tests where relevant (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-07-017** — reduced-motion alternatives (status: PROPOSED; acceptance: PENDING)

### 08. P1: GAME — Genre-neutral gameplay SDK
- [ ] **CAP-08-001** — Gameplay tags and attributes (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-002** — character stats and health (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-003** — abilities and cooldowns (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-004** — damage and status effects (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-005** — inventory and equipment (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-006** — progression/XP and skill trees (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-007** — achievements and challenges (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-008** — scoring and leaderboards interface (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-009** — quests and objectives (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-010** — level and checkpoint systems (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-011** — tutorial/onboarding frameworks (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-012** — rewards and unlocks (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-013** — economy abstractions and validation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-014** — world objects and interactions (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-015** — gameplay event scripting (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-016** — balance data and tuning tables (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-017** — difficulty curves and adaptive difficulty safeguards (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-018** — procedural generation with seeds (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-019** — game-specific rule plugins (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-08-020** — narrative/dialogue graph (status: PROPOSED; acceptance: PENDING)

### 09. P1/P2: AI — NPC and decision tools
- [ ] **CAP-09-001** — Finite state machines (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-002** — behavior trees (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-003** — utility AI (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-004** — A* and navigation graph (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-005** — grid pathfinding (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-006** — 3D navmesh adapter (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-007** — obstacle avoidance (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-008** — target selection and perception (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-009** — scripted opponent bots (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-010** — difficulty preset and fairness controls (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-011** — bot simulation harness (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-012** — offline-capable deterministic bots where required (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-013** — diagnostic behavior viewer (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-09-014** — content-driven NPC parameters (status: PROPOSED; acceptance: PENDING)

### 10. P0: ASSET — Source-to-runtime content factory
- [ ] **CAP-10-001** — Source asset registry and immutable IDs (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-002** — provenance and redistribution license ledger (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-003** — import hooks and format validation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-004** — audio transcode (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-005** — sprite sheets and atlas packing (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-006** — KTX2/Basis and supported texture formats (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-007** — glTF/GLB validation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-008** — geometry simplification and mesh LODs (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-009** — sprite and image resolution variants (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-010** — font subsetting and localization bundles (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-011** — content-addressed cache (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-012** — dependency graph and cycle detection (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-013** — per-platform cooking (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-014** — incremental rebuild based on file hashes (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-015** — asset deduplication (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-016** — memory/download budget calculation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-017** — lazy loading bundles (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-018** — remote content manifest (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-019** — checksum and signature verification (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-020** — asset hot-reload in editor (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-021** — missing asset fallback (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-022** — archive and restore (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-023** — content patch rollback (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-024** — asset accessibility metadata (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-10-025** — copyright review gate (status: PROPOSED; acceptance: PENDING)

### 11. P1/P2: STUDIO — Visual developer editor
- [ ] **CAP-11-001** — Project dashboard and template wizard (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-002** — scene tree and hierarchy (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-003** — scene canvas and viewport (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-004** — inspector and property editing (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-005** — drag/drop with undo-redo (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-006** — prefab editor with variants (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-007** — level and tilemap editor (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-008** — collision/hitbox editor (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-009** — timeline and cinematic editor (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-010** — particle/VFX authoring UI (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-011** — visual state machine editor (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-012** — visual scripting with sandboxed nodes (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-013** — character and ability editor (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-014** — missions/storyboard editor (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-015** — UI responsive preview (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-016** — theme design tokens (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-017** — asset browser and preview (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-018** — live runtime debug view (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-019** — input mapping editor (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-020** — performance panel (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-021** — build & release panel (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-022** — project dependency graph (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-023** — plugin manager (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-024** — built-in docs and samples (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-025** — crash report viewer (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-026** — accessibility preview (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-11-027** — source diff awareness (status: PROPOSED; acceptance: PENDING)

### 12. P0/P1: UIUX — Presentation and accessibility
- [ ] **CAP-12-001** — HUD and UI layout primitives (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-002** — responsive typography and scaling (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-003** — safe-area-aware layout (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-004** — 2D overlays on 3D worlds (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-005** — loading/splash/first-run flows (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-006** — navigation and back-stack (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-007** — UI themes and reusable components (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-008** — screen transitions (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-009** — notifications and toast semantics (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-010** — forms and input focus (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-011** — gamepad UI navigation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-012** — color contrast and color-blind palettes (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-013** — remappable controls (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-014** — subtitle sizing and backgrounds (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-015** — reduced motion and flashing safeguards (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-016** — left-handed control profiles (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-017** — touch target sizing (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-018** — localization and pseudolocalization (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-019** — RTL readiness (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-020** — offline and connection states (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-021** — error/empty/loading states (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-12-022** — accessibility settings persistence (status: PROPOSED; acceptance: PENDING)

### 13. P0: DATA — Storage, serialization, versions
- [ ] **CAP-13-001** — Save schema versioning (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-002** — atomic writes and validation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-003** — local persistence and quotas (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-004** — autosave and checkpoints (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-005** — game snapshot and event log (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-006** — migration and rollback policy (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-007** — import/export backup (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-008** — corrupted save fallback (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-009** — profile separation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-010** — guest account persistence (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-011** — offline conflict policy (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-012** — optional cloud-save adapter (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-013** — encryption of sensitive data (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-014** — privacy-driven deletion (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-015** — integrity checks (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-016** — deterministic replay schema (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-017** — settings sync contracts (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-13-018** — asset catalog version compatibility (status: PROPOSED; acceptance: PENDING)

### 14. P2: NET — Multiplayer and backends
- [ ] **CAP-14-001** — Guest-first offline mode (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-002** — authoritative command validation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-003** — matchmaking and lobby (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-004** — room lifecycle (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-005** — secure join tokens (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-006** — connection lifecycle and reconnection (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-007** — rate limits and anti-abuse (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-008** — clock sync (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-009** — turn-based command sequence and idempotency (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-010** — state snapshots and delta sync (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-011** — lag compensation and prediction for twitch games (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-012** — session rejoin/recovery (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-013** — cross-device state consistency (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-014** — region placement and latency (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-015** — persistence for durable match results (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-016** — DB/Redis coordination only as necessary (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-017** — queue backpressure and circuit breakers (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-018** — replay and dispute audit (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-019** — anti-cheat threat model (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-020** — bot/AFK and disconnect policy (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-021** — party and invite flows (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-022** — spectator mode optional (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-14-023** — chat and moderation optional (status: PROPOSED; acceptance: PENDING)

### 15. P0/P1: BUILD — Platform and release factory
- [ ] **CAP-15-001** — Reusable game CLI scaffolds (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-002** — reproducible lockfiles (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-003** — hermetic build configuration (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-004** — per-game feature manifests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-005** — conditional dependency bundling (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-006** — tree shaking and code splitting (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-007** — asset cooking and packaging (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-008** — Web/PWA export and service workers (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-009** — Android project scaffolding (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-010** — signed APK and AAB build (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-011** — keystore backup and secrets handling (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-012** — Android target API compatibility (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-013** — ABI and 16 KB page-size policy for native libraries (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-014** — texture format targeting optional (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-015** — CDN and cache-control policy (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-016** — hashes and software bill of materials (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-017** — source-map and debug symbol handling (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-018** — release channels and staged rollout (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-019** — app-version and content-version contract (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-020** — rollback and disaster recovery (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-021** — platform store metadata generation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-022** — release notes and changelog (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-15-023** — versioned API compatibility (status: PROPOSED; acceptance: PENDING)

### 16. P0: QA — Quality engineering, security and reliability
- [ ] **CAP-16-001** — Unit and property-based tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-002** — deterministic simulation golden tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-003** — genre rule test oracles (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-004** — integration and contract tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-005** — UI and navigation E2E (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-006** — visual snapshot comparison (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-007** — physics and collision fuzz tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-008** — asset validation and missing asset tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-009** — save migration/property tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-010** — crash recovery and offline tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-011** — device and browser matrix (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-012** — real Android background/thermal testing (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-013** — FPS frame time percentiles (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-014** — heap and GPU memory tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-015** — startup and bundle-size budgets (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-016** — power and thermal measurements (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-017** — long-soak and repeated-session tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-018** — network fault/packet-loss/latency simulation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-019** — multiplayer load and chaos tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-020** — vulnerability and secret scan (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-021** — license compliance and SBOM checks (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-022** — accessibility audit (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-023** — localization/pseudoloc checks (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-024** — tampering and anti-cheat scenarios (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-025** — feature-flag rollback tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-026** — release candidate smoke test (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-16-027** — human gameplay signoff (status: PROPOSED; acceptance: PENDING)

### 17. P1/P2: OPS — Live game operations
- [ ] **CAP-17-001** — Crash and ANR monitoring (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-002** — consent-aware telemetry (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-003** — opt-out/retention controls (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-004** — frame-time analytics (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-005** — load error dashboards (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-006** — feature flag and safe configuration (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-007** — analytics event schema and quality (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-008** — funnel/cohort analysis optional (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-009** — game balancing and event calendar (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-010** — versioned remote configuration (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-011** — rollback/pause switches (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-012** — content delivery and patch integrity (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-013** — leaderboards and seasonal events (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-014** — incident response playbooks (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-015** — cost telemetry (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-016** — operational alerts (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-017** — backup/restore drills (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-018** — player support workflow (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-019** — issue triage and crash grouping (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-020** — release impact monitoring (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-17-021** — deprecation and end-of-life plan (status: PROPOSED; acceptance: PENDING)

### 18. P1/P2: BUS — Distribution, policy and monetization
- [ ] **CAP-18-001** — Store listing assets and descriptions (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-002** — privacy policy and data safety mapping (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-003** — age rating and audience policy (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-004** — IP/license and trademark checks (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-005** — attribution generator (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-006** — parental/families compliance where applicable (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-007** — optional ads adapter and consent (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-008** — optional in-app billing and purchase restore (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-009** — entitlement validation on authoritative backend (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-010** — regional pricing config (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-011** — transparent offline-first monetization modes (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-012** — Play store release validations (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-013** — ASO/SEO metadata (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-014** — customer support and reporting paths (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-015** — subscription/refund handling if applicable (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-18-016** — business analytics and payout reconciliation (status: PROPOSED; acceptance: PENDING)

### 19. P0/P1: DEVEX — Documentation, templates, extensibility
- [ ] **CAP-19-001** — Public engine SDK contracts (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-002** — plugin manifest and version ranges (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-003** — template registry and examples (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-004** — API docs and type generation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-005** — local developer setup and one-command run (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-006** — ADRs and design docs (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-007** — searchable troubleshooting (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-008** — code generators (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-009** — lint/format/static analysis (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-010** — dependency compatibility matrix (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-011** — upgrade migration notes (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-012** — backward compatibility and deprecations (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-013** — curated third-party plugin allowlist (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-014** — plugin capability/permission sandbox (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-015** — changelog and semver (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-016** — sample and starter games (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-017** — plugin conformance tests (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-018** — technical debt register (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-019** — governance and owner approvals (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-19-020** — issue tracker with acceptance evidence (status: PROPOSED; acceptance: PENDING)

### 20. P0/P1: SEC — Data and supply-chain trust
- [ ] **CAP-20-001** — Least privilege and secret management (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-002** — signed builds and provenance (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-003** — pinned third party dependencies (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-004** — patch response and security advisories (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-005** — dependency review and license scanning (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-006** — network transport encryption (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-007** — authoritative score and purchase validation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-008** — safe parsers for untrusted asset bundles (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-009** — editor plugin permission boundaries (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-010** — user-generated content sanitization (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-011** — telemetry consent and deletion (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-012** — private data lifecycle controls (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-013** — release signature and manifest validation (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-014** — secure cloud save authorization (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-015** — supply chain incident playbook (status: PROPOSED; acceptance: PENDING)
- [ ] **CAP-20-016** — account and moderation abuse controls when activated (status: PROPOSED; acceptance: PENDING)
## 5. Authoritative data contracts

### Game manifest (conceptual schema)
```json
{
  "schemaVersion": 1,
  "gameId": "example-bubble",
  "engineCompatibility": ">=1.0 <2.0",
  "platforms": ["web", "android"],
  "display": {"orientations": ["portrait"], "safeArea": true},
  "rendering": {"type": "2d", "preferredBackend": "webgl2", "fallback": "canvas"},
  "features": ["scene", "input", "audio", "save", "ui", "accessibility"],
  "contentCatalog": "catalog-v1.json",
  "saveSchema": 1,
  "offline": true,
  "online": {"required": false},
  "releaseChannel": "development"
}
```
This is **illustrative**, not an agreed production JSON schema. The final schema must have generated types, runtime validation and migration tests.

### Compatibility dimensions
- Engine version / game version / content catalog version / save schema / backend protocol version / Android target API.
- Asset ID → source hashes → import recipe → platform variants → cooked bundle hashes → release manifest.
- Game-specific release pins an exact compatible engine version. Upgrades happen in PRs with deterministic regression and device acceptance; no unapproved silent wholesale migration.
- Build hashes, test evidence, renderer profile and release owner are stored in the release manifest.

## 6. Asset factory: precise flow

`Source asset + creator/license provenance → validation → canonical intermediate asset → variants + platform compression → dependency resolution → content-addressed cache → cooked immutable bundle → signed/checksummed catalog → package/CDN → runtime verifier → staged rollout`.

Each asset record includes: owner/source link; license and redistribution restrictions; attribution requirements; modification history; language/locale; target dimensions/LODs; pixel/GPU formats; estimated VRAM and download bytes; dependency references; SHA-256; provenance/copyright review state. Failed checks quarantine assets. Use glTF/GLB and KTX2 when appropriate, not for every 2D UI icon. Keep original master files. Ignore assets only after a game-specific usage decision.

## 7. Automated Game Factory

`New Game` wizard requests game ID, genre, target platform/device profiles, offline/online mode, art theme, input scheme, monetization/privacy needs. It generates:
1. Game skeleton with pinned engine packages and typed manifest.
2. Screen/routes and state graph template; game mechanic plugin interface (not fabricated mechanics).
3. Design-token theme and responsive UI templates.
4. Content folders, import rules, budget settings and asset provenance records.
5. Save/load schema and migration harness.
6. Unit/visual/E2E/device test skeletons and goldens.
7. Web/PWA and Android build profiles with explicit secrets setup.
8. PRD/TRD/storyboard/asset checklist, release checklist and gap ledger.
9. CI job definitions and local preflight pipeline.
10. Build and release manifests showing what was verified and what remains blocked.

**Automatable:** scaffolding, integration adapters, asset compression, dependency tracking, codegen, builds, static checks, deterministic simulation tests, smoke tests, performance measurement, report creation and approved content deployments.  
**Requires human or game-specific input:** original mechanics, truly good UX, character art/story, fun, new combat or racing algorithms, brand/trademark validation, copyright judgment, real-device acceptance, gameplay balance, paid infrastructure and store approval.

## 8. Quality gates and measurable budgets

These are initial **proposed targets** to profile and revise per genre/device. They are not benchmark claims.

- Target game frame-rate: 60 FPS on explicitly supported hardware; fallback 30 FPS tiers; track p50/p95/p99 frame times, not only averages.
- At 60 FPS total frame time budget ≈16.67 ms, including input/sim/render/presentation; background/hitch performance tested.
- Bundle bytes, total compressed/uncompressed assets, peak JS heap, GPU memory, start-to-interactive and input latency are **per-game/per-device** budgets, decided before gameplay scope approval, not magic universal numbers.
- Golden rules: Chess legality/endgame/repetition/clocks/save replay; Bubble deterministic matching/cascades/score/difficulty; Racing collision and vehicle handling under agreed physics tolerance.
- Soak tests: repeated play sessions, pause/resume, device rotation, loss of audio focus, airplane mode/network reconnect, low storage, power save mode, WebGL/GPU context loss.
- Multiplayer: authoritative message validation, malicious/duplicate/out-of-order commands, latency/packet loss, reconnect, persistence, split brain, room capacity, DB/Redis bottlenecks, queue cost; target CCU and quality metrics require independent load-test evidence.
- Release candidate has no unresolved P0; signed reproducible artifact; passed policy/privacy/license checks; real Android smoke; browser compatibility; rollback and support paths.

## 9. Architecture & project repository

```text
sge-next/
  apps/
    studio/                   # visual editor separate from game runtime
    dev-portal/               # docs, samples, SDK registry
    playground/               # 2D/3D cross-feature test fixtures
  engine/
    kernel/                   # scheduler, lifecycle, state, capabilities
    ecs/                      # optional composition and entities
    contracts/                # typed interfaces and manifest schemas
    render-2d-pixi/
    render-3d-babylon/
    physics-2d-rapier/
    physics-3d-havok/
    input/ audio/ animation/ ui/
    save/ assets/ telemetry/ accessibility/
  gameplay/
    progression/ abilities/ quests/ narrative/
    board-game/ puzzle/ vehicle/ combat/ ai/
  platform/
    web-pwa/ android-capacitor/
    backend-optional/ multiplayer-colyseus/
  tools/
    new-game-cli/ asset-cooker/ bundle-analyzer/
    test-orchestrator/ screenshot-diff/ release-factory/
  templates/
    board-game/ puzzle/ platformer/ driving/ fighting/
  games/                     # OPTIONAL: example fixtures, not mandatory all products
    engine-conformance/
  tests/
    contract/ simulation/ render/ browser/ android/ load/
  docs/
    ADR/ PRD/ TRD/ RUNBOOKS/ COVERAGE-REGISTER/
  governance/
    licenses/ dependency-audit/ release-policy/ incident-playbooks/
```

**Engine projects vs game projects:** Engine source can be a single monorepo. Production games may be in separate repositories and depend on versioned engine artifacts to prevent one game’s release from requiring changes to all others. No coupling through shared mutable DB tables unless explicitly modeled.

## 10. Migration and reference games

- Existing Chess: preserve 2D rules, Babylon/Havok 3D and current deployed/branch behavior. Start with API compatibility + adapter, snapshot tests and baseline benchmark. Refactor only proven reusable parts and validate after each extraction. Do not claim readiness based solely on browser CI.
- New Bubble Puzzle: create with common template, input, save, 2D render, VFX and asset pipeline. Implement matching/cascade rules independently; use as proof that engine is genuinely reusable across distinct genres.
- Third validation: platformer or small driving benchmark for physics. A full racing/fighting title should not be used as the first proof of core architecture.
- Define 'real reuse': source is consumed as versioned engine package in 2+ games; no copy-paste forks; game-specific interfaces remain explicit.

## 11. Delivery stages with proof gates

| Stage | Milestone | Acceptance criteria |
|---|---|---|
| A | Research & contract freeze | all domains inventoried, ADRs, constraints, unknowns/risks, license and target device decisions |
| B | Runtime kernel + CLI | deterministic tick, lifecycle, inputs, events, saves, types, one example run on Web and Android |
| C | Render + asset factory | 2D and 3D conformance scenes; incremental asset cook; platform profiles; memory budgets |
| D | Reference-game parity | Chess compatibility, Bubble as second real game; no regressions against audited baselines |
| E | Studio & SDK | production-ready editor transactions/undo, inspectors, previews, templates, extension validation |
| F | Quality Lab & distribution | CI, visual/golden, performance, real-device, Play policy, versioned release and rollback |
| G | Optional online platform | authoritative matches, reconnect, DB/Redis policy, telemetry and cost-limited load tests |
| H | Long-term governance | semver, migrations, public docs, measured reuse rate, support and maintenance cadence |

Stages may overlap technically, but **promotion through acceptance gates is sequential**. Initial scope budget is $0 paid software, not $0 effort or guaranteed $0 cloud/store operations.

## 12. Explicit backlog of unknowns and decisions

| ID | Unresolved issue | How to resolve |
|---|---|---|
| U01 | Existing Chess repo's current exact APIs, tests and licensing | connected GitHub repo-first audit before implementation |
| U02 | Representative Windows/Linux development machine specs | benchmark and supported local tooling selection |
| U03 | Minimum Android phone GPU/RAM and browser matrix | 3-class device benchmark and Android WebView verification |
| U04 | Engine runtime under browser-only vs native backend policy | test heavy 3D representative benchmark before native decision |
| U05 | Input and audio latency requirements per genre | measurable gameplay prototype |
| U06 | Multiplayer target CCU, regions, tick rate and cost ceiling | architecture workload calculation and staged load tests |
| U07 | Analytics, monetization and user-data requirements | per-game privacy and business decisions |
| U08 | Engine distribution/licensing and public contributions | open-source governance decision and legal/license review |
| U09 | Source asset licensing and permitted third-party downloads | provenance-led allowlist and usage inspection |
| U10 | Performance budgets per game and tier | baseline device measurements before choosing thresholds |
| U11 | UI editor depth vs zero-budget effort | milestone definition and external tool importers first |
| U12 | Plugins requiring elevated editor/system permissions | plugin threat model and sandboxing specification |
| U13 | Native packaging and future Android policy changes | official policy check for each new release |
| U14 | Real-time physics determinism across platforms | physics replay / reconciliation proof; no false deterministic promise |

## 13. Coverage governance (how not to miss hidden work)

Every capability/requirement has: stable ID, source and rationale, owner, lifecycle phase, dependencies, priority, implementation PR, test ID, target platforms, pass/fail evidence, status (`PROPOSED → PLANNED → IMPLEMENTED → VERIFIED → RELEASED`, or `BLOCKED/REJECTED`), review date and risks. Use a machine-readable index generated from the ledger. Before new genre/platform work, expand the register via requirements elicitation, architecture review, failure-mode review and reference-game benchmark comparisons. Never label every capability complete merely because it was listed.

Mandatory release check: schema-validated requirements coverage; no orphan features, unowned assets, unverified runtime adapters, unlicensed content, missing API contracts or unreconciled P0 defects. New unanticipated cases create new IDs rather than silently disappear.

## 14. Final decision

Create **SGE NEXT as a TypeScript-first, composable, 2D/3D-capable developer ecosystem** with a proven open-source rendering/physics basis; browser/PWA and Android support; local-first tools; per-game independent versioned builds; a content-addressed asset factory; playable reference games; and automated proof gates. Do not write brand-new graphics drivers or invent core physics from scratch. Keep an optional later native backend and multiplayer plane modular. Prioritize production-grade reliability over an unchecked checklist of features.

**Definition of success:** Two independent genres built through one SDK without copy/pasting core systems; tested mobile/Web build, repeatable asset pipeline, per-game QA reports, version-safe engine upgrades and independently publishable releases. Expanding to 100 games is a capacity objective, not a guaranteed throughput claim.
