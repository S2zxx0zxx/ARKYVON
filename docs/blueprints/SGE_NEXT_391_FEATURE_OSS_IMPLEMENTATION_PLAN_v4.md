# SGE NEXT — OSS-First Implementation Master Plan v4.0

> **Status: Design only.** This document is a technical execution proposal covering all **391 existing CAP IDs** from `SGE_NEXT_MASTER_BLUEPRINT_v3.md`. No code, tool installation, repository merge, physical-device test, load test or license due-diligence run is implied by the plan.
>
> Prepared: 2026-11-22 · Baseline input: immutable v3.0 (75,039 bytes) · Source file SHA-256: `05488f8ef767be373bc365ec196db2ef620f26bfe67df1743efaabaf3f50f3e7`
>
> Permanent process rule: **Reuse the upstream implementation, adapt at the boundary, compose integrations, build only unique SGE-specific glue and behavior.** Do not scrape/copy indiscriminately, claim 391 separate packages, or fork full engines unless evidenced constraints justify it.

## Executive implementation decision

- Initial supported workflows: offline-first 2D games and 3D scenes for Web/PWA + Android; heavy-3D native path remains a feasibility decision. Preserve existing TypeScript/Babylon Chess; Bubble is the independent second consumer.
- Ship **engine kernel** (game loops, lifecycle, schemas, contracts) separately from **game SDK** (gameplay/genre plugins), **Studio** (editor-only), **Asset Factory** (build-time), **Quality Lab** (test tools), **Release Factory** and **optional** online services.
- Runtime process receives only explicitly selected plugins; no 3D bundle in a 2D-only game; no server required for offline game.
- Hold third-party libraries on pinned versions; record exact license in automated BOM/notice; conduct latest-version security and Android WebView compatibility review before installing.
- `Havok @babylonjs/havok` MIT runtime package is usable through Babylon plugin, but do not assume the upstream underlying Havok engine's full source is open for arbitrary copying. Verify package-specific terms at install.
- External GPL tools such as Blender or Tiled may run as separate authoring processes; **do not incorporate their GPL code into a proprietary runtime without legal review**. Content generated with a tool is not automatically licensed the same as the tool; each sourced asset has separate rights.
- Generated project assets, designs and gameplay mechanics need manual approval; software automation cannot guarantee fun, quality or a bug-free release.

## The six interfaces that prevent 'library spaghetti'

1. `IGameRuntime`: fixed-step state loop, scene lifecycle, plugin loading, contracts.
2. `IRenderer2D` / `IRenderer3D`: own backend-specific resource handles and capability negotiation.
3. `IPhysicsWorld`: separate 2D/3D implementations, explicit timestep and collision matrix.
4. `IAssetRegistry` / `IAssetCooker`: immutable asset IDs, recipe DAG, hashes, platform variants and provenance.
5. `IGameProject`: manifest, rules, UI, content version, save compatibility and output targets.
6. `ITestHarness` / `IReleaseGate`: deterministic fixtures, devices, release artifact and evidence ledger.

**Invariant:** No game rules import PixiJS/Babylon/Havok directly; no renderer plugin can decide authoritative game state; no asset crosses import trust boundary without validation; no release gate passes merely because compilation succeeded.

## Open-source adoption rules (binding)

1. Detect the feature's role: runtime, editor, build tool, game-specific, online service or policy.
2. Search for **one maintained primary** candidate, one fallback, and evidence of platform+version compatibility.
3. Screen license + notice + transitive licenses + source provenance + security advisories; avoid unlicensed asset packs.
4. Prototype with one game scene; compare API stability, bundle bytes, load/frame time, memory and portability.
5. Wrap behind a typed SGE contract and pin package; preserve existing upstream history rather than copy/paste.
6. Conformance/unit/property tests, cleanup/disposal tests, crash/recovery tests and relevant real-device benchmarks.
7. Mark each CAP with status `PROPOSED → DESIGNED → IMPLEMENTED → VERIFIED → RELEASED`; blocked is separate. Claims require links to actual CI/build/device evidence.
8. Re-evaluate an upstream replacement via ADR, migration adapters and a two-game canary. Avoid speculative rewrites.

**Package adoption scorecard** (weighted, to be populated only with measured/researched evidence): platform 25, API compatibility 15, maintenance 15, performance 15, licensing/security 15, feature completeness 10, integration cost 5; reject on mandatory license or platform gate regardless of score.

## OSS selection register (verified background, exact installed versions not yet assessed)

| Capability | Primary candidate | Candidate role / decision | License evidence / caveat |
|---|---|---|---|
| 2D rendering | PixiJS | Use rendering graph/sprite assets directly; SGE adapter | MIT; https://pixijs.com/ |
| 3D rendering | Babylon.js | Use cameras/materials/animation; SGE adapter | Apache-2.0; https://github.com/BabylonJS/Babylon.js |
| 2D+3D physics | Rapier | 2D physics initial; evaluate 3D as alternate | Apache-2.0; https://rapier.rs/ |
| Babylon physics | `@babylonjs/havok` | Optional 3D WASM plugin | Published MIT; https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin/ |
| ECS | bitECS | Candidate, benchmark before lock | Site says MIT; https://bitecs.dev/ |
| Audio | howler.js | Shared 2D audio adapter | MIT; https://github.com/goldfire/howler.js |
| Storage | Dexie.js | IndexedDB wrapper, versioned saves | Apache-2.0; https://github.com/dexie/Dexie.js |
| Graph editor | React Flow (`@xyflow/react`) | Visual node UX, not runtime executor | MIT; https://reactflow.dev/ |
| Visual scripting | Rete.js | Optional graph editing; compile allowlisted actions | Core MIT; individual packages audit; https://retejs.org/ |
| Level editing | LDtk | Import JSON / spawn level scenes | MIT; https://github.com/deepnight/ldtk |
| Extra level editor | Tiled | External editor + import only | GPL editor; https://github.com/mapeditor/tiled |
| Asset authoring | Blender | External modeling/rigging/animations | GPL; external app not engine runtime; https://blender.org |
| 3D asset optimize | glTF Transform | Offline CLI/library in cooker | MIT; https://github.com/donmccurdy/glTF-Transform |
| GPU textures | Khronos KTX-Software | External KTX2/Basis cooking pipeline | Repository components have license matrix; audit; https://github.com/KhronosGroup/KTX-Software |
| Multiplayer | Colyseus | Optional authoritative Node.js server | MIT; https://github.com/colyseus/colyseus |
| Android wrapper | Capacitor | Web runtime packaging; WebView tests required | MIT; https://capacitorjs.com/docs/android |
| Test runner | Vitest | Unit, contract and simulation tests | MIT; https://vitest.dev/ |
| UI E2E | Playwright | Cross-browser flows / screenshots | Apache-2.0; https://playwright.dev/ |
| Asset audio transcode | FFmpeg | Standalone binary for build pipeline only | Mixed LGPL/GPL depending on build and libraries; record exact binary license |

**Not to mix without proof:** Godot and O3DE are architecture/tooling references and possible alternative platforms, not automatically embedded into a Pixi+Babylon runtime. Combining two independent renderers on the same screen requires an explicit layering/interop spike. Heavy native racing/fighting may need a separate backend or specialized engine adapter; this cannot be assumed equivalent to a WebView build.

## Delivery sequence / release proofs

| Wave | Deliverable | Necessary proof |
|---|---|---|
| A | Governance, contracts, toolchain & license register | 391 IDs traced; CI/lint; ADRs; package license scan |
| B | Headless runtime, input, saves, QA skeleton | seeded replay and pause-resume; sample game green |
| C | 2D/3D renderer/physics/audio and Asset Factory | reference scene budgets; hash-consistent rebuilds; device fallback |
| D | Reusable SDK, UI, animation, Chess + Bubble | zero engine-core changes needed for second game; gameplay parity |
| E | Visual Studio + Game Wizard | scene/prefab edit→save→preview→build, undo/redo and safe scripting |
| F | Web/PWA + Android release factory | offline install/start, signed AAB, version upgrades, asset rollbacks |
| G | Optional online/multiplayer and specialist features | authoritative validation, reconnect, load profile & operation cost |
| H | LiveOps, performance optimization, maintenance | staged deploy, rollback, telemetry consent and response drill |

**Quality threshold selection:** target 60 FPS only on a defined supported-device tier, 30 FPS fallback where appropriate; record p95/p99 and memory. Never advertise 20K CCU before end-to-end load testing, nor free production hosting forever.

## 391-feature execution matrix — exact v3.0 CAP IDs

Every row records: **strategy**, **specific engineering approach**, **upstream/tool chain**, **initial delivery wave**, and **acceptance evidence requirement**. This is an actionable planning ledger, *not* a release status report.

Legend: **R** reuse; **A** adapt through a stable interface; **C** compose multiple components/workflows; **B** build SGE-specific implementation. All rows remain `PROPOSED / NOT BUILT`.

### Domain 01 — Product contracts / governance (16 CAPs)

**Primary OSS/tools:** Zod + Markdown + JSON Schema; Git · **Initial wave:** A — governance.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-01-001` | Game product brief | **Compose** | Create a typed game-brief YAML/MD template with tracked approval and alternatives. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-002` | audience and genre profile | **Compose** | Capture personas, genre references and skill levels in project metadata; keep research links. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-003` | target devices and input modes | **Compose** | Generate device/input matrix from project manifest; include accessible alternatives. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-004` | platform and minimum hardware policy | **Build** | Define supported hardware floor and platform budget contract with recorded exceptions. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-005` | game loop hypothesis | **Build** | Specify measurable player input→simulation→feedback→reward loop and cancellation conditions. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-006` | core mechanic specification | **Build** | Write versioned game-rules RFC with state diagrams, example inputs and game-specific oracles. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-007` | fun-factor playtest protocol | **Compose** | Create repeatable playtest protocol, questions, recordings and result rubric; require human testers. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-008` | PRD and TRD templates | **Compose** | Use Markdown/JSON Schema templates with validation and version-controlled approvals. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-009` | architecture decision records | **Build** | Maintain ADR index with rejected choices, migration plan and performance rationale. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-010` | dependency and risk register | **Compose** | Create dependency risk register from SBOM, open issues and explicit owner/action fields. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-011` | feature scope and non-goals | **Build** | Implement scope-baseline and non-goal registry; every change gets a diff review. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-012` | per-game acceptance contracts | **Compose** | Turn game goals into executable test IDs with device, metric and quality thresholds. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-013` | game lifecycle and ownership map | **Build** | Define roles and production gate owners even for a single-developer studio. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-014` | budget and operating-cost ceilings | **Compose** | Specify per-game byte, RAM, GPU, API and optional hosting budgets; enforce via reports. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-015` | release-readiness checklist | **Compose** | Generate preflight release checklist from manifest + QA/asset/license checks. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |
| `CAP-01-016` | open-gap and assumption register | **Build** | Track unknowns and newly discovered gaps as versioned backlog records, never silently discard. | A | Document/schema lint + explicit reviewer sign-off; trace to G00–G02. |

### Domain 02 — Engine kernel (19 CAPs)

**Primary OSS/tools:** TypeScript; bitECS (evaluation); Web APIs · **Initial wave:** B — kernel.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-02-001` | Main loop and fixed-step simulation | **Build** | Implement accumulator-based fixed-step update loop, capped catch-up and pause policy. | B | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-02-002` | render interpolation | **Adapt** | Draw through a renderer-independent interpolation API using previous/current state snapshots. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-003` | scheduler and cancellation | **Build** | Build clock-aware cancellable task scheduler with AbortSignal and disposed-scene cleanup. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-004` | scene lifecycle and transitions | **Build** | Define enter/exit/suspend/resume lifecycle with ownership and async cancellation. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-005` | deterministic random seed interface | **Build** | Inject seeded PRNG interface into game rules; ban uncontrolled random calls in simulation. | B | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-02-006` | simulation time versus wall time | **Build** | Separate monotonic simulation tick clock from wall clock and server clock. | B | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-02-007` | foreground/background/visibility lifecycle | **Compose** | Connect Page Visibility and Capacitor lifecycle to save, resume, audio and render throttling. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-008` | finite state machines | **Adapt** | Use a small state-machine library or typed FSM adapter with transition guards. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-009` | ECS or composition framework | **Adapt** | Benchmark bitECS against simple composition; ship one selected abstraction, not two overlapping ECSs. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-010` | entity identifiers and lifecycle | **Build** | Implement stable entity IDs/generation counters and explicit spawn/dispose semantics. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-011` | component serialization | **Compose** | Use versioned component schemas and compact serialization with migration fixtures. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-012` | event bus and commands | **Build** | Create typed event/command interfaces, subscriptions scoped to scene and idempotent handlers. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-013` | dependency injection and service registry | **Build** | Build small injected service registry with cycle detection and explicit lifetime scopes. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-014` | object pooling and memory budgets | **Adapt** | Provide pooled objects and per-system allocation counters; use only where benchmarks justify. | B | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-02-015` | worker messaging where supported | **Compose** | Use Worker messages with schema validation, transferables and main-thread fallback. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-016` | fault containment | **Build** | Contain recoverable scene/plugin faults behind error boundaries; preserve diagnostic context. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-017` | feature and capability detection | **Adapt** | Normalize navigator/GPU/OS capability probes into testable feature profiles. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-018` | restart and crash recovery | **Compose** | Restore last validated save/checkpoint on restart, detect crash loops and offer safe mode. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-02-019` | structured error codes | **Build** | Publish stable structured error taxonomy with actionable diagnostics and sensitive-data redaction. | B | Contract test + invalid-input fixture + representative integration/device smoke. |

### Domain 03 — Renderers (20 CAPs)

**Primary OSS/tools:** PixiJS 2D; Babylon.js 3D; WebGL2 baseline · **Initial wave:** C — graphics.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-03-001` | 2D scene graph | **Adapt** | Wrap PixiJS containers/sprites in IScene2D while isolating Pixi-specific objects. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-002` | 2D sprite atlas and batching | **Reuse** | Use PixiJS texture atlas/batching, texture-manifest importer and draw-call budget tests. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-003` | 2D lighting and masking | **Adapt** | Expose Pixi filters/masks and optional light plugin behind capability-aware quality presets. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-004` | text and bitmap font renderers | **Adapt** | Integrate Pixi Text/bitmap fonts with font fallback and locale coverage tests. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-005` | 3D camera and projection | **Adapt** | Map Babylon camera classes onto ICamera3D with predictable coordinates and controls. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-006` | mesh and material pipeline | **Adapt** | Use Babylon mesh/material APIs; import validated glTF/GLB through asset IDs. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-007` | physically based materials where suitable | **Reuse** | Use Babylon PBR materials and environment maps, disabled on unsupported low tier. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-008` | skeletal animation rendering | **Reuse** | Use Babylon skeletal rendering through animation tracks from glTF assets. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-009` | shadows and reflection tiers | **Adapt** | Configure Babylon shadow/reflection presets per hardware profile and measure GPU cost. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-010` | scene culling and occlusion | **Reuse** | Use Babylon frustum/occlusion tools; instrument false-visibility and culling costs. | C | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-03-011` | level of detail and impostors | **Adapt** | Build asset-LOD selectors on top of Babylon mesh optimization/instance support. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-012` | particles and instancing | **Adapt** | Use Pixi/Babylon particles and GPU instancing with pooled emitters and lifetime caps. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-013` | post-processing and color grading | **Adapt** | Expose Babylon render effects through an optional quality-tier post-processing graph. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-014` | shader library and compilation cache | **Compose** | Maintain reviewed shader variants with build-time lint/compilation, cached keys and fallback. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-015` | GPU context lost/recovery | **Build** | Handle WebGL lost/restored events; reload GPU resources from immutable CPU-side asset IDs. | C | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-03-016` | renderer backend abstraction | **Build** | Define IRenderer/IRenderScene interfaces and enforce backend conformance tests. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-017` | fallback graphics capabilities | **Build** | Select WebGL2 default or WebGPU when verified, with graceful feature fallback. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-018` | dynamic resolution | **Adapt** | Adapt render target scale and LOD from smoothed frame-time, with hysteresis. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-019` | screenshot and golden image capture | **Compose** | Capture consistent screenshots via Playwright plus renderer-side deterministic capture hooks. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-03-020` | render debug overlays | **Build** | Build toggleable overlays for draw calls, textures, meshes, GPU/CPU frame timings. | C | Visual golden + interactive smoke + low-end Android and browser fallback test. |

### Domain 04 — Physics (17 CAPs)

**Primary OSS/tools:** Rapier 2D; Babylon Havok 3D (optional) · **Initial wave:** C — physics.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-04-001` | 2D and 3D physics adapters | **Adapt** | Define IPhysicsWorld adapters for Rapier 2D and Babylon Havok 3D; instantiate per game. | C | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-04-002` | rigid body and collision layers | **Adapt** | Map colliders, layers and material properties into backend-neutral entity components. | C | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-04-003` | trigger volumes and sensor events | **Adapt** | Bridge physics trigger start/stop events to typed game events without duplicate delivery. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-04-004` | shape queries and raycasts | **Adapt** | Expose raycast/shape-cast query contracts with deterministic filtering and result order. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-04-005` | continuous collision detection | **Reuse** | Enable CCD only on fast objects and compare tunneling vs solver cost in fixtures. | C | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-04-006` | joints and constraints | **Adapt** | Represent joints/constraints as serializable definitions mapped to backend objects. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-04-007` | character controller | **Compose** | Integrate engine character controller with game movement states and slope/step contracts. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-04-008` | vehicle dynamics plugin | **Build** | Build specialized vehicle dynamics plugin only after arcade-vs-sim handling design is locked. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-04-009` | rope and cloth optional plugins | **Compose** | Keep cloth/rope experimental; evaluate supported external solvers, never force into base build. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-04-010` | fixed timestep policy | **Build** | Advance physics from fixed-step scheduler and reject mismatched simulation delta. | C | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-04-011` | broadphase and collision profiling | **Compose** | Export collider counts, broadphase timing and costly contacts into profiling panel. | C | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-04-012` | physics debugging | **Adapt** | Expose debug wireframes/contacts in studio using physics backend debug data. | C | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-04-013` | state snapshots | **Build** | Define physics snapshot format and restore constraints; flag non-reproducible state. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-04-014` | collision filtering rules | **Adapt** | Implement declarative category masks, collision matrices and no-contact rules. | C | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-04-015` | simulation replay | **Compose** | Record commands and state hashes, compare representative physics replays per backend. | C | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-04-016` | numerical stability tests | **Compose** | Run fuzz and extreme-value cases against timestep, scale, mass and contact stability. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-04-017` | client/server physics compatibility constraints | **Build** | Document and test that client prediction cannot be assumed server-deterministic across runtimes. | C | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |

### Domain 05 — Input (15 CAPs)

**Primary OSS/tools:** Pointer/Gamepad/Keyboard APIs; Capacitor haptics · **Initial wave:** B — kernel.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-05-001` | Touch, gesture and multitouch | **Adapt** | Normalize pointer/touch events through browser Pointer Events and gesture recognizers. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-05-002` | mouse and keyboard | **Adapt** | Map keyboard/mouse to semantic game actions, not hardcoded physical keys. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-05-003` | gamepad mappings and hotplug | **Adapt** | Use Gamepad API polling and device hotplug handling with local profiles. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-05-004` | virtual joystick | **Build** | Implement customizable virtual stick with dead zone, capture and multi-touch priority. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-05-005` | action remapping and binding profiles | **Build** | Store per-game action bindings with conflict detection, defaults and import/export. | B | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-05-006` | sensitivity and dead zones | **Build** | Provide calibrated dead-zone, sensitivity and acceleration curves by input modality. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-05-007` | hold/repeat/debounce semantics | **Build** | Define tap/hold/repeat/debounce semantics in simulation ticks and UI time separately. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-05-008` | portrait and landscape input mapping | **Compose** | Transform device touch coordinates through viewport, letterbox and rotation matrix. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-05-009` | keyboard focus navigation | **Adapt** | Route accessibility focus and key navigation through game UI/action mapping. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-05-010` | screen safe areas | **Compose** | Use CSS env(safe-area-inset-*) plus Capacitor insets where supported. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-05-011` | mobile haptics | **Adapt** | Expose optional Android haptic service with browser vibration fallback and disable setting. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-05-012` | low-latency input sampling | **Build** | Timestamp and queue raw actions before fixed-step simulation; measure event-to-response latency. | B | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-05-013` | input recording and replay | **Build** | Serialize action frames with mapping version for deterministic replay and bug reports. | B | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-05-014` | accessibility input alternatives | **Compose** | Add switch/keyboard/touch alternative bindings to input accessibility settings. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-05-015` | device-specific controls compatibility | **Compose** | Run test cases on real Android devices, Bluetooth gamepads and mobile browsers. | B | Contract test + invalid-input fixture + representative integration/device smoke. |

### Domain 06 — Audio (15 CAPs)

**Primary OSS/tools:** howler.js; Web Audio API · **Initial wave:** C — graphics.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-06-001` | Audio buses and per-channel volume | **Adapt** | Use howler.js/Web Audio buses and save separate SFX/music/voice gain settings. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-06-002` | one-shot and looping effects | **Reuse** | Use howler.js playback, pooling and loop controls for common sound effects. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-06-003` | 2D/3D spatial sound | **Compose** | Use Web Audio panners or Babylon audio spatialization where suitable, with stereo fallback. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-06-004` | music crossfades | **Build** | Implement beat-independent music crossfade controller respecting app lifecycle. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-06-005` | ducking and prioritization | **Build** | Add priority/ducking policy so dialogue and UI cues remain audible under overload. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-06-006` | preload and streaming | **Adapt** | Preload short SFX with howler; stream long tracks and cap decoded audio memory. | C | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-06-007` | web autoplay recovery | **Compose** | Catch autoplay restrictions and unlock audio only after an allowed user gesture. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-06-008` | pause/resume and focus behavior | **Build** | Pause/resume audio on focus changes and lifecycle events, avoiding duplicate playbacks. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-06-009` | voice-over and dialogue synchronization | **Compose** | Sync voice cue timestamps to dialogue script and skip/seek state. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-06-010` | subtitles and captions | **Build** | Bind authored subtitle cues to audio timelines with locale-aware text formatting. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-06-011` | silence and reduced-sound modes | **Build** | Expose silence, mute, background-only and reduced-sound user preferences. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-06-012` | audio memory budgets | **Compose** | Budget decoded audio RAM by device tier and unload idle buffers. | C | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-06-013` | audio quality tiers | **Adapt** | Choose compression and sample-rate variants in asset cooker for device capabilities. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-06-014` | latency profiling | **Compose** | Measure request-to-audible latency and audio decode stalls on Android/Web. | C | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-06-015` | media codec validation | **Compose** | Validate browser/device codecs with test samples and define fallback formats. | C | Contract test + invalid-input fixture + representative integration/device smoke. |

### Domain 07 — Animation (17 CAPs)

**Primary OSS/tools:** PixiJS; Babylon.js; keyframe/tween adapters · **Initial wave:** D — gameplay.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-07-001` | Sprite-sheet animation | **Adapt** | Use Pixi sprite atlas frame animation with metadata-controlled timing and looping. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-002` | keyframe timelines | **Adapt** | Use keyframe timeline data mapped to Pixi/Babylon animation tracks. | D | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-07-003` | tweening and easing | **Adapt** | Use small tween library or native interpolation behind cancellable timeline handles. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-004` | skeletal animation | **Reuse** | Use Babylon skeletal animation and rigged glTF; keep a separate 2D bone adapter optional. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-005` | blend trees | **Build** | Provide reusable transition/blending graphs and per-entity animation parameters. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-006` | animation state graph | **Build** | Define typed animation states, transitions, interruptions and recovery guards. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-007` | layer masks | **Adapt** | Expose 3D bone masks through Babylon animation group/transform overrides where supported. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-008` | additive animations | **Compose** | Layer authored additive pose clips with declared skeletal compatibility checks. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-009` | procedural animation hooks | **Build** | Offer procedural animation hooks with deterministic inputs and performance budgets. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-010` | event markers and hit frames | **Build** | Emit authored attack/hit/audio event markers exactly once per simulation step. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-011` | inverse kinematics optional | **Compose** | Provide optional IK plugin based on available Babylon/Rapier tooling, benchmark first. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-012` | camera moves and shakes | **Adapt** | Generate camera shake and smooth camera tracks from reusable tween profiles. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-013` | cutscene and dialogue sequencer | **Build** | Compose cutscene timeline, game commands, dialogue and skip/restore checkpoints. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-014` | transitions and VFX timelines | **Compose** | Schedule VFX, sound and transition tracks off a synchronized timeline controller. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-07-015` | animation import and retargeting policy | **Compose** | Validate skeleton/clip mapping, naming and retarget compatibility before import. | D | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-07-016` | animation deterministic tests where relevant | **Compose** | Replay animation-critical events and compare timing across frame-rate variants. | D | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-07-017` | reduced-motion alternatives | **Build** | Provide reduced-motion substitution (static cues/fades) without hiding gameplay information. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |

### Domain 08 — Gameplay SDK (20 CAPs)

**Primary OSS/tools:** Typed SGE game-specific modules; Zod · **Initial wave:** D — gameplay.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-08-001` | Gameplay tags and attributes | **Build** | Define typed gameplay tags and stat schema, explicitly separated from ECS internals. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-002` | character stats and health | **Build** | Compose HP/energy/stamina components and rule-tested heal/damage boundaries. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-003` | abilities and cooldowns | **Build** | Build event-driven ability executor with cooldown ticks, cost validation and cancel rules. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-004` | damage and status effects | **Build** | Implement authoritative damage pipeline, stacking rules and time-bounded status effects. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-005` | inventory and equipment | **Build** | Define item IDs, inventory capacity, equip slots and migration-safe schemas. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-006` | progression/XP and skill trees | **Build** | Create XP curves, unlock prerequisites and data-defined skill trees with cycle checks. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-007` | achievements and challenges | **Build** | Define achievement predicates/events and offline persistence without rewarding replay duplicates. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-008` | scoring and leaderboards interface | **Compose** | Expose local score calculator and optional server-backed leaderboard interface. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-009` | quests and objectives | **Build** | Model quests as state machines with auditable trigger/complete/cancel transitions. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-010` | level and checkpoint systems | **Compose** | Integrate checkpoint definitions into scene transitions and save transaction boundaries. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-011` | tutorial/onboarding frameworks | **Compose** | Build reusable tutorial step actions, UI targets and completion persistence. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-012` | rewards and unlocks | **Build** | Define verified reward events, claims ledger and idempotent unlock grants. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-013` | economy abstractions and validation | **Build** | Use signed/authoritative economy decisions online; offline sandbox economy separately. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-014` | world objects and interactions | **Build** | Expose interactable component, distance/action policy and timed interactions. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-015` | gameplay event scripting | **Compose** | Compile validated visual scripting actions to allowlisted gameplay commands. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-016` | balance data and tuning tables | **Build** | Store typed balancing tables with schema, ranges, changelog and A/B-safe versioning. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-017` | difficulty curves and adaptive difficulty safeguards | **Build** | Implement explicit difficulty presets; adaptive logic requires fairness and opt-out review. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-018` | procedural generation with seeds | **Adapt** | Provide seeded generation primitives, validators and saveable generation manifests. | D | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-08-019` | game-specific rule plugins | **Build** | Implement Board/Puzzle/Racing/Fighting rule plugins as independent game modules. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-08-020` | narrative/dialogue graph | **Compose** | Compose narrative graph, branching variables and localization-friendly dialogue nodes. | D | Gameplay rule oracle + randomized boundary tests + headless game session. |

### Domain 09 — AI and bots (14 CAPs)

**Primary OSS/tools:** FSM/behavior trees; pathfinding; game-specific bot adapters · **Initial wave:** G — specialized.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-09-001` | Finite state machines | **Adapt** | Reuse core FSM service with bot-specific transition rules and bounded action loops. | G | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-09-002` | behavior trees | **Build** | Implement typed behavior-tree nodes and deterministic tick budget per NPC. | G | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-09-003` | utility AI | **Build** | Implement weighted utility scoring functions with reproducible selection and tie-breaking. | G | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-09-004` | A* and navigation graph | **Adapt** | Use small A* path library or custom compact graph search, benchmark path count. | G | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-09-005` | grid pathfinding | **Adapt** | Import grid navigation from LDtk maps with blocked-cell and diagonal rules. | G | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-09-006` | 3D navmesh adapter | **Adapt** | Integrate Babylon navigation/recast adapter only for 3D games that need it. | G | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-09-007` | obstacle avoidance | **Build** | Implement local avoidance steering with explicit crowd/performance limits. | G | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-09-008` | target selection and perception | **Build** | Model sensing/target choice as filtered queries with cooldown and fairness rules. | G | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-09-009` | scripted opponent bots | **Compose** | Use game-specific bots (e.g. chess search rules) behind IBotController, not one generic AI. | G | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-09-010` | difficulty preset and fairness controls | **Build** | Expose reaction/difficulty profiles without secretly increasing bot information access. | G | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-09-011` | bot simulation harness | **Compose** | Run thousands of headless seeded bot matches, deadlock detection and outcome distribution. | G | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-09-012` | offline-capable deterministic bots where required | **Build** | Require a seeded offline bot profile where replays/saves depend on reproducibility. | G | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-09-013` | diagnostic behavior viewer | **Compose** | Render behavior tree/FSM trace events in Studio without gameplay side effects. | G | Gameplay rule oracle + randomized boundary tests + headless game session. |
| `CAP-09-014` | content-driven NPC parameters | **Build** | Move bot perception weights, ranges and priorities into validated content files. | G | Gameplay rule oracle + randomized boundary tests + headless game session. |

### Domain 10 — Asset Factory (25 CAPs)

**Primary OSS/tools:** glTF Transform; KTX tools; validators; Sharp; FFmpeg audited · **Initial wave:** C — assets.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-10-001` | Source asset registry and immutable IDs | **Build** | Assign asset UUID, source hash, dimensions and owner in versioned manifest registry. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-002` | provenance and redistribution license ledger | **Compose** | Store origin URLs, license text, author, allowed redistribution and review outcome per asset. | C | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-10-003` | import hooks and format validation | **Compose** | Use specialized importers with MIME/magic checks, size/decompression limits and sandboxed paths. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-004` | audio transcode | **Compose** | Invoke pinned FFmpeg executable out-of-process with build-specific license audit. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-005` | sprite sheets and atlas packing | **Adapt** | Use atlas packer and Pixi loader metadata to generate sprite sheets reproducibly. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-006` | KTX2/Basis and supported texture formats | **Compose** | Cook KTX2/Basis formats with Khronos KTX tools and device capability manifests. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-007` | glTF/GLB validation | **Compose** | Run glTF validator and glTF Transform before allowing imported 3D assets. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-008` | geometry simplification and mesh LODs | **Compose** | Use glTF Transform/meshoptimizer to generate measurable LOD and geometry budgets. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-009` | sprite and image resolution variants | **Compose** | Use Sharp/image tools for DPI tiers, alpha preservation and layout visual checks. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-010` | font subsetting and localization bundles | **Compose** | Subset fonts with license verification; include all localized glyph coverage test fixtures. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-011` | content-addressed cache | **Build** | Build SHA-256 content-addressed asset cache keyed by full transform toolchain version. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-012` | dependency graph and cycle detection | **Build** | Build DAG of asset inputs, recipes and outputs; reject cycles and missing dependencies. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-013` | per-platform cooking | **Build** | Generate target-specific asset variants with reproducible cooking options. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-014` | incremental rebuild based on file hashes | **Build** | Compare input, recipe and transitive dependency hashes before reprocessing assets. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-015` | asset deduplication | **Build** | Deduplicate identical output blobs across games without merging ownership metadata. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-016` | memory/download budget calculation | **Compose** | Estimate compressed download, decoded RAM and GPU VRAM from cooked asset metadata. | C | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-10-017` | lazy loading bundles | **Adapt** | Expose Pixi/Babylon lazy bundles through a common priority-aware streaming API. | C | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-10-018` | remote content manifest | **Build** | Create versioned optional remote-content manifest; offline base game must remain playable. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-019` | checksum and signature verification | **Build** | Verify content checksums and optional signed manifests before activating remote bundles. | C | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-10-020` | asset hot-reload in editor | **Compose** | Watch local asset changes, recook affected DAG nodes and refresh Studio scene safely. | C | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-10-021` | missing asset fallback | **Build** | Provide deliberate missing asset placeholders with structured error, never silent success. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-022` | archive and restore | **Build** | Archive original sources and recipes with restore-testable content hashes. | C | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-10-023` | content patch rollback | **Build** | Keep previous content manifest and provide atomic activation/rollback mechanism. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-024` | asset accessibility metadata | **Build** | Attach alt text, motion/flashing and audio-caption metadata to imported content. | C | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-10-025` | copyright review gate | **Compose** | Require recorded copyright/attribution/redistribution clearance before publication. | C | Automated compliance/security scan plus versioned human policy/license review and negative tests. |

### Domain 11 — Developer Studio (27 CAPs)

**Primary OSS/tools:** React/Vite; React Flow; Rete.js; LDtk/Tiled import · **Initial wave:** E — studio.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-11-001` | Project dashboard and template wizard | **Compose** | Build React/Vite project home using validated game-template manifests and starter previews. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-002` | scene tree and hierarchy | **Adapt** | Use hierarchy tree component backed by scene node IDs; support selection and stable ordering. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-003` | scene canvas and viewport | **Compose** | Embed Pixi/Babylon preview viewport in Studio, independent from production runtime bundling. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-004` | inspector and property editing | **Compose** | Generate field editors from Zod/JSON Schema with validation and hot-apply commands. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-005` | drag/drop with undo-redo | **Build** | Implement transactional editor command stack with inverse operations and undo serialization. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-006` | prefab editor with variants | **Build** | Define reusable prefab schema, variant inheritance, override provenance and circular-ref checks. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-007` | level and tilemap editor | **Compose** | Import LDtk/Tiled layouts; build only the minimal on-canvas placement tools missing. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-008` | collision/hitbox editor | **Compose** | Overlay physics shapes in viewport with snapping and hitbox asset validation. | E | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-11-009` | timeline and cinematic editor | **Compose** | Use timeline UI over SGE animation tracks; scrub frames without altering game-clock state. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-010` | particle/VFX authoring UI | **Compose** | Provide particle preset authoring with strict GPU/particle budget preview. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-011` | visual state machine editor | **Adapt** | Use React Flow for graph UI and compile edges to typed state-machine definitions. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-012` | visual scripting with sandboxed nodes | **Compose** | Use Rete.js nodes with allowlisted command set; prohibit arbitrary untrusted eval. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-013` | character and ability editor | **Build** | Build domain inspector for characters, stats, abilities and constraint violations. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-014` | missions/storyboard editor | **Compose** | Use graph editor and storyboard board mapped to mission/dialogue schemas. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-015` | UI responsive preview | **Compose** | Mount portrait/landscape device frames with safe-area and font-scale presets. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-016` | theme design tokens | **Build** | Expose centralized design tokens and live theme editor with per-game overrides. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-017` | asset browser and preview | **Compose** | Create searchable asset registry with previews, license flags, sizes and dependency references. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-018` | live runtime debug view | **Adapt** | Connect local runtime debug bridge to event/state snapshots; no remote secrets in Studio. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-019` | input mapping editor | **Compose** | Generate input-binding UI from action schema, include conflict and accessibility warnings. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-020` | performance panel | **Compose** | Display sampled FPS, frame-time percentiles, heap/texture budgets and recent regressions. | E | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-11-021` | build & release panel | **Compose** | Invoke CI/local CLI build manifests, streaming logs and explicit release approvals. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-022` | project dependency graph | **Compose** | Visualize asset and plugin DAG from manifests, surface cycles and incompatible constraints. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-023` | plugin manager | **Build** | Build signed/allowlisted plugin registry and version compatibility inspector. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-024` | built-in docs and samples | **Compose** | Embed generated MDX/typed API docs and runnable starter examples. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-025` | crash report viewer | **Compose** | Read consent-safe crash reports and source maps with symbol access permissions. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-026` | accessibility preview | **Compose** | Overlay touch target, contrast, safe-area and reduced-motion checks in UI preview. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-11-027` | source diff awareness | **Build** | Make editor changes atomic, diffable and code-reviewable; refuse overwrite conflicts. | E | Visual golden + interactive smoke + low-end Android and browser fallback test. |

### Domain 12 — UI/UX (22 CAPs)

**Primary OSS/tools:** SGE UI tokens; Pixi/DOM overlays; ICU messages · **Initial wave:** D — gameplay.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-12-001` | HUD and UI layout primitives | **Compose** | Provide renderer-neutral HUD components and adapter-specific mounting strategies. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-002` | responsive typography and scaling | **Compose** | Implement font scale tokens, viewport units and layout tests for long translations. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-003` | safe-area-aware layout | **Compose** | Use safe-area insets and orientation profiles to place interactive elements. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-004` | 2D overlays on 3D worlds | **Adapt** | Use Babylon 3D→2D projection and Pixi/DOM overlay mounting contract. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-005` | loading/splash/first-run flows | **Build** | Define reusable splash, welcome, first-run and consent-ready navigation states. | D | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-12-006` | navigation and back-stack | **Build** | Implement navigation history with predictable Back/pause overlay and state retention. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-007` | UI themes and reusable components | **Compose** | Package UI primitives/themes as versioned components, keep visual identity per game. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-008` | screen transitions | **Adapt** | Implement interruptible screen transitions with reduced-motion alternatives. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-009` | notifications and toast semantics | **Build** | Prioritize game alerts in safe-screen region; deduplicate and time out appropriately. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-010` | forms and input focus | **Compose** | Validate form fields, keyboard focus, soft keyboard resize and recovery behavior. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-011` | gamepad UI navigation | **Build** | Convert gamepad directional inputs to focus graph with visible selection indicator. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-012` | color contrast and color-blind palettes | **Compose** | Run contrast checks and supply alternative color-blind-safe semantic palettes. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-013` | remappable controls | **Compose** | Expose remapping UI backed by input manager profiles, reject unresolvable conflicts. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-014` | subtitle sizing and backgrounds | **Build** | Define subtitle safe area, text size and background contrast controls. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-015` | reduced motion and flashing safeguards | **Compose** | Honor reduced-motion and photosensitivity settings; provide effects intensity presets. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-016` | left-handed control profiles | **Build** | Provide mirrored virtual input layout presets and per-user persistence. | D | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-12-017` | touch target sizing | **Compose** | Enforce touch target policy and measure actual hit regions on phone screenshots. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-018` | localization and pseudolocalization | **Compose** | Use ICU/message-format localization adapters with pseudo-locale visual regression tests. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-019` | RTL readiness | **Build** | Support RTL layout mirroring where semantics permit; test mixed numerals/text. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-020` | offline and connection states | **Build** | Define visible connection states and offline-first flows without dead-end buttons. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |
| `CAP-12-021` | error/empty/loading states | **Build** | Publish typed async UI state conventions and retry/failure actions for every screen. | D | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-12-022` | accessibility settings persistence | **Compose** | Persist accessibility preferences within profile saves and apply before first gameplay frame. | D | Visual golden + interactive smoke + low-end Android and browser fallback test. |

### Domain 13 — Persistence (18 CAPs)

**Primary OSS/tools:** Dexie/IndexedDB; typed schemas · **Initial wave:** B — kernel.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-13-001` | Save schema versioning | **Build** | Create game-specific versioned JSON/binary save schema and migration registry. | B | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-13-002` | atomic writes and validation | **Build** | Write staged value, validate and atomically activate IndexedDB record pointer. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-13-003` | local persistence and quotas | **Adapt** | Use Dexie over IndexedDB with quota estimation, eviction policy and failure states. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-13-004` | autosave and checkpoints | **Build** | Trigger autosaves at safe gameplay boundaries and rate-limit writes under load. | B | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-13-005` | game snapshot and event log | **Build** | Define snapshot plus append-only event format and retention compaction rules. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-13-006` | migration and rollback policy | **Build** | Provide forward-only migration and fallback compatibility policy with fixtures. | B | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-13-007` | import/export backup | **Compose** | Export/import portable archives with schema, checksum, source-game metadata and review. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-13-008` | corrupted save fallback | **Build** | Detect malformed saves, quarantine broken data and recover last known good record. | B | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-13-009` | profile separation | **Build** | Namespace all local data by game/profile; reject accidental cross-game reads. | B | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-13-010` | guest account persistence | **Build** | Support anonymous profile IDs with optional later consent-based account linking. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-13-011` | offline conflict policy | **Build** | Define explicit conflict resolution for offline edits and cloud sync timestamps. | B | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-13-012` | optional cloud-save adapter | **Adapt** | Define optional cloud storage adapter without requiring login for offline single-player. | B | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-13-013` | encryption of sensitive data | **Compose** | Encrypt only actual sensitive fields with managed keys; do not confuse hashing with encryption. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-13-014` | privacy-driven deletion | **Build** | Implement full profile deletion for local stores/cache and optional remote systems. | B | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-13-015` | integrity checks | **Compose** | Store content hashes and integrity markers; treat client-controlled integrity as non-authoritative. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-13-016` | deterministic replay schema | **Build** | Serialize action frames/seeds with versioned replay format and compatibility gate. | B | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-13-017` | settings sync contracts | **Build** | Store settings as typed patchable data; sync only on opt-in. | B | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-13-018` | asset catalog version compatibility | **Build** | Bind saves to asset/content-version ranges; test missing/downgraded content recovery. | B | Contract test + invalid-input fixture + representative integration/device smoke. |

### Domain 14 — Networking (23 CAPs)

**Primary OSS/tools:** Colyseus; optional PostgreSQL/Redis · **Initial wave:** G — online.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-14-001` | Guest-first offline mode | **Build** | Make networking an optional plugin; ship offline single-player without a server request. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-002` | authoritative command validation | **Adapt** | Validate player actions through authoritative Colyseus room command handlers. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-003` | matchmaking and lobby | **Adapt** | Use Colyseus room discovery or lobby service; expose stable matchmaking API. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-004` | room lifecycle | **Adapt** | Map session create/join/leave/close into room lifecycle and cleanup hooks. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-005` | secure join tokens | **Build** | Issue short-lived signed join tickets with narrow room and role permissions. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-006` | connection lifecycle and reconnection | **Adapt** | Use reconnect tokens, heartbeat and explicit session-expiry policies. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-007` | rate limits and anti-abuse | **Compose** | Compose request/command rate limiting, abuse counters and quarantine controls server-side. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-008` | clock sync | **Build** | Measure client/server offset and latency without trusting client-supplied wall time. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-009` | turn-based command sequence and idempotency | **Build** | Assign per-player sequence IDs and idempotency receipts to turn commands. | G | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-14-010` | state snapshots and delta sync | **Adapt** | Use Colyseus state schema/delta transport behind SGE network snapshot adapter. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-011` | lag compensation and prediction for twitch games | **Build** | Implement optional client prediction, reconciliation and lag compensation game-by-game. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-012` | session rejoin/recovery | **Compose** | Persist room resume metadata and recover from disconnect, TTL expiration and process loss. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-013` | cross-device state consistency | **Build** | Version server-state snapshots and reject incompatible cross-device clients gracefully. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-014` | region placement and latency | **Compose** | Choose server regions from measured latency/cost; avoid premature multi-region state. | G | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-14-015` | persistence for durable match results | **Compose** | Persist settled match outcomes in durable DB with duplicate-safe transactions. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-016` | DB/Redis coordination only as necessary | **Compose** | Use Redis only when room distribution/presence demands it; never for durable match truth. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-017` | queue backpressure and circuit breakers | **Build** | Bound outbound queues, drop nonessential updates and protect server with circuit breakers. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-018` | replay and dispute audit | **Build** | Save authoritative input/event traces for disputes with privacy/retention controls. | G | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-14-019` | anti-cheat threat model | **Build** | Threat-model score, teleport, cooldown, speed and message tampering per game. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-020` | bot/AFK and disconnect policy | **Build** | Define AFK timers, bot substitution and graceful disconnect victory rules. | G | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-14-021` | party and invite flows | **Compose** | Compose party lobby + invite code with expiring, rate-limited token management. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-022` | spectator mode optional | **Adapt** | Use room read-only observers with explicit per-game visibility policy if enabled. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |
| `CAP-14-023` | chat and moderation optional | **Compose** | Gate optional text chat behind moderation, reporting and data-retention controls. | G | Authoritative server integration + duplicate/packet-loss/rejoin/abuse scenarios under load. |

### Domain 15 — Build and Release (23 CAPs)

**Primary OSS/tools:** pnpm; Vite; Workbox; Capacitor/Gradle · **Initial wave:** F — release.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-15-001` | Reusable game CLI scaffolds | **Build** | Create `sge create/build/test/dev` CLI with versioned generator templates. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-002` | reproducible lockfiles | **Reuse** | Use pnpm lockfile and frozen installs; reject non-reproducible dependency drift. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-003` | hermetic build configuration | **Compose** | Pin Node/Java toolchain versions and normalized build environments. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-004` | per-game feature manifests | **Build** | Define typed game.manifest with only required features and supported platforms. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-005` | conditional dependency bundling | **Compose** | Build runtime entrypoints via manifest-driven dynamic imports, no giant global bundle. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-006` | tree shaking and code splitting | **Adapt** | Use Vite/Rollup tree-shaking and bundle analysis with per-entry budgets. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-007` | asset cooking and packaging | **Compose** | Orchestrate asset DAG cooking and include only referenced bundles in outputs. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-008` | Web/PWA export and service workers | **Adapt** | Use Vite + Workbox for PWA, cache versioning and offline update strategy. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-009` | Android project scaffolding | **Adapt** | Generate Capacitor app shell and Android Gradle project per game identity. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-010` | signed APK and AAB build | **Compose** | Drive Gradle signed APK/AAB builds from secure CLI profiles; emit verifier report. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-011` | keystore backup and secrets handling | **Build** | Keep signing keys outside repo; document encrypted backup and disaster recovery. | F | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-15-012` | Android target API compatibility | **Compose** | Validate Android target SDK and Play requirements using Android SDK build tools. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-013` | ABI and 16 KB page-size policy for native libraries | **Compose** | Inspect any native binaries for ABI and page-size compatibility as policies evolve. | F | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-15-014` | texture format targeting optional | **Compose** | Choose texture pack variants per GPU support; test fallback path before optional targeting. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-015` | CDN and cache-control policy | **Build** | Generate immutable asset URLs, service-worker cache policy and safe CDN invalidation. | F | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-15-016` | hashes and software bill of materials | **Compose** | Generate SHA-256 hashes, SBOM, license/notice file and artifact provenance manifest. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-017` | source-map and debug symbol handling | **Compose** | Separate development source maps from public builds; store symbols with access controls. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-018` | release channels and staged rollout | **Build** | Support alpha/beta/stable channels and signed staged deployment manifests. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-019` | app-version and content-version contract | **Build** | Maintain independent binary version, SDK version and cooked-content version matrices. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-020` | rollback and disaster recovery | **Build** | Implement reversible PWA content activation and Android staged rollout playbooks. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-021` | platform store metadata generation | **Build** | Generate store text/screenshots/checklists from game metadata but require human review. | F | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-15-022` | release notes and changelog | **Compose** | Generate semver changelogs from structured changes and release approval records. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |
| `CAP-15-023` | versioned API compatibility | **Build** | Enforce SDK API compatibility and migration policy via automated client fixtures. | F | Clean isolated build; hashes/signing/install/smoke/rollback; repeat-build comparison. |

### Domain 16 — Quality Lab (27 CAPs)

**Primary OSS/tools:** Vitest; fast-check; Playwright; device harness · **Initial wave:** B onward — quality.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-16-001` | Unit and property-based tests | **Compose** | Use Vitest and fast-check for units, invariants, edge cases and shrinking failures. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-002` | deterministic simulation golden tests | **Build** | Replay seeded inputs into headless simulation and assert state hash golden fixtures. | B onward | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-16-003` | genre rule test oracles | **Build** | Build independent game-rule test oracle for Chess legality, puzzle clearing and scoring. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-004` | integration and contract tests | **Compose** | Use Vitest API contracts and cross-package integration fixture games. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-005` | UI and navigation E2E | **Adapt** | Use Playwright for real browser flow, menus, controls, saves and error paths. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-006` | visual snapshot comparison | **Adapt** | Compare Playwright screenshots against approved golden images at fixed device profiles. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-007` | physics and collision fuzz tests | **Compose** | Fuzz Rapier/Havok collision scenes and check crashes, penetrations and stability bounds. | B onward | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-16-008` | asset validation and missing asset tests | **Compose** | Run import validators on valid, malformed, oversized and missing assets. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-009` | save migration/property tests | **Build** | Property-test migration across all supported save schema versions and failed writes. | B onward | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-16-010` | crash recovery and offline tests | **Compose** | Use Playwright/Android harness for airplane mode, app kill, offline start and recovery. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-011` | device and browser matrix | **Compose** | Test Chromium, Firefox, WebKit plus required Android browsers/WebViews on coverage matrix. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-012` | real Android background/thermal testing | **Compose** | Execute real Android lifecycle, thermal throttling and resumed-scene tests. | B onward | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-16-013` | FPS frame time percentiles | **Build** | Collect P50/P95/P99 update, render and total frame times over representative scenes. | B onward | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-16-014` | heap and GPU memory tests | **Compose** | Measure heap growth, retained textures and GPU memory proxies in soak scenarios. | B onward | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-16-015` | startup and bundle-size budgets | **Compose** | Fail budgets on initial bytes, load critical path and start-to-interactive time. | B onward | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-16-016` | power and thermal measurements | **Compose** | Measure battery drain/thermal via supported Android profiling tools and fixed test procedure. | B onward | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-16-017` | long-soak and repeated-session tests | **Build** | Run repeat sessions and long soaks with scene transitions, save/write churn and restart. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-018` | network fault/packet-loss/latency simulation | **Compose** | Inject packet loss, latency, reordering and disconnects in network test harness. | B onward | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-16-019` | multiplayer load and chaos tests | **Compose** | Drive Colyseus load generator with realistic room sizes, join bursts and latency SLOs. | B onward | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-16-020` | vulnerability and secret scan | **Compose** | Scan dependency tree, secrets and known vulnerabilities with documented triage rules. | B onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-16-021` | license compliance and SBOM checks | **Compose** | Generate SBOM/licenses/NOTICE and block forbidden or unresolved dependency findings. | B onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-16-022` | accessibility audit | **Compose** | Use axe-core plus manual controller/screen-reader checks on supported UI surfaces. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-023` | localization/pseudoloc checks | **Compose** | Automate pseudolocales and visual truncation/RTL checks for every UI state. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-024` | tampering and anti-cheat scenarios | **Build** | Test invalid commands, spoofed scores, replayed purchases and tampered content manifests. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-025` | feature-flag rollback tests | **Build** | Exercise old/new config transitions, rejected remote updates and rollback correctness. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-026` | release candidate smoke test | **Compose** | Smoke a signed release candidate on clean device, offline device and PWA before rollout. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |
| `CAP-16-027` | human gameplay signoff | **Build** | Require recorded human gameplay assessment, defects disposition and actual signoff. | B onward | Test harness proves it catches a deliberately injected regression; archive artifact/evidence. |

### Domain 17 — Live operations (21 CAPs)

**Primary OSS/tools:** OpenTelemetry-style schemas, optional backend/alerts · **Initial wave:** H — liveops.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-17-001` | Crash and ANR monitoring | **Compose** | Use Android vitals/optional self-hosted telemetry only with explicit app policy and consent. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-002` | consent-aware telemetry | **Build** | Define privacy-minimal event collection with consent and local opt-out persistence. | H | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-17-003` | opt-out/retention controls | **Build** | Enforce retention and user deletion; do not log unique identifiers by default. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-004` | frame-time analytics | **Build** | Aggregate frame times by renderer, GPU tier and game version without raw personal data. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-005` | load error dashboards | **Compose** | Create asset/load failure dashboards from sanitized local/opt-in telemetry. | H | Run representative benchmark/device matrix, record p50/p95/p99 or size/RAM budget and regression delta. |
| `CAP-17-006` | feature flag and safe configuration | **Build** | Use versioned safe feature flags and defaults bundled inside the game. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-007` | analytics event schema and quality | **Build** | Define event schema, invariants and deduplicated delivery for analytics quality. | H | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-17-008` | funnel/cohort analysis optional | **Compose** | Build optional anonymous funnel/cohort summaries with minimum aggregation thresholds. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-009` | game balancing and event calendar | **Build** | Version balance tables and event-calendar content with human playtest approval. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-010` | versioned remote configuration | **Build** | Validate signed remote-config schemas and prevent unsupported-client rollout. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-011` | rollback/pause switches | **Build** | Provide rollout pause, safe config defaults and rollback switch per game. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-012` | content delivery and patch integrity | **Compose** | Reuse Asset Factory signature/manifest activation for optional remote patches. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-013` | leaderboards and seasonal events | **Compose** | Compose verified seasonal scoreboards with optional server-authoritative leaderboard. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-014` | incident response playbooks | **Build** | Document severity categories, rollback procedure, owner contacts and incident timeline. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-015` | cost telemetry | **Compose** | Measure hosting, bandwidth, storage and room compute per game with cost alerts. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-016` | operational alerts | **Compose** | Trigger alerts from defined SLO thresholds rather than noisy individual events. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-017` | backup/restore drills | **Compose** | Regularly restore backups to scratch environment and compare checksums/fixture data. | H | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-17-018` | player support workflow | **Build** | Create in-game help/export bug report flow with optional attachment consent. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-019` | issue triage and crash grouping | **Compose** | Normalize errors and versions, group issues and link each to regression test. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-020` | release impact monitoring | **Build** | Compare crash, performance and startup metrics by staged rollout cohort. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |
| `CAP-17-021` | deprecation and end-of-life plan | **Build** | Define archive/read-only/end-of-life obligations and notify players on retirements. | H | Telemetry/event schema validation, opt-out and rollback drill with versioned evidence. |

### Domain 18 — Distribution (16 CAPs)

**Primary OSS/tools:** Play Console/Android tools; optional billing/ads · **Initial wave:** F onward — policy.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-18-001` | Store listing assets and descriptions | **Compose** | Generate store listing copy, screenshots and icons from approved per-game metadata. | F onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-18-002` | privacy policy and data safety mapping | **Build** | Maintain privacy/data flow matrix; manually verify store data-safety declarations. | F onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-18-003` | age rating and audience policy | **Build** | Record audience, rating, kid/family constraints and game-specific content warnings. | F onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-18-004` | IP/license and trademark checks | **Compose** | Run attribution, copyright, trademark and asset-rights checklist before public shipping. | F onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-18-005` | attribution generator | **Build** | Generate NOTICE/credits from approved asset + dependency licenses; review exceptions. | F onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-18-006` | parental/families compliance where applicable | **Build** | Gate family-oriented releases on current platform policies and lawful consent requirements. | F onward | Store/policy checklist plus clean-device installation and human approval. |
| `CAP-18-007` | optional ads adapter and consent | **Adapt** | Provide optional ads interface; no ads SDK in games that don't explicitly enable it. | F onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-18-008` | optional in-app billing and purchase restore | **Adapt** | Provide optional Play Billing integration only when monetization is requested. | F onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-18-009` | entitlement validation on authoritative backend | **Build** | Verify server-side purchase entitlement and idempotent restore, never trust UI state. | F onward | Store/policy checklist plus clean-device installation and human approval. |
| `CAP-18-010` | regional pricing config | **Build** | Maintain currency/region pricing configurations with explicit published price reconciliation. | F onward | Store/policy checklist plus clean-device installation and human approval. |
| `CAP-18-011` | transparent offline-first monetization modes | **Build** | Allow free offline game without user account/ads where business model permits. | F onward | Store/policy checklist plus clean-device installation and human approval. |
| `CAP-18-012` | Play store release validations | **Compose** | Validate Android package identity, SDK, signing, app bundle, policy and testing tracks. | F onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-18-013` | ASO/SEO metadata | **Compose** | Generate ASO keywords/localized listings with editorial review, avoid misleading claims. | F onward | Store/policy checklist plus clean-device installation and human approval. |
| `CAP-18-014` | customer support and reporting paths | **Build** | Publish support/contact, crash report and issue escalation workflows. | F onward | Store/policy checklist plus clean-device installation and human approval. |
| `CAP-18-015` | subscription/refund handling if applicable | **Compose** | Handle refunds, purchase restores, webhook state and entitlement revocation when billing enabled. | F onward | Store/policy checklist plus clean-device installation and human approval. |
| `CAP-18-016` | business analytics and payout reconciliation | **Compose** | Reconcile store statements and payouts with purchase ledger before revenue reporting. | F onward | Store/policy checklist plus clean-device installation and human approval. |

### Domain 19 — Developer Experience (20 CAPs)

**Primary OSS/tools:** TypeScript; pnpm; ESLint; Prettier; docs generator · **Initial wave:** A onward — devex.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-19-001` | Public engine SDK contracts | **Build** | Publish stable TypeScript public API and generate compatibility fixtures on every release. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-002` | plugin manifest and version ranges | **Build** | Version plugin manifests and validate semantic ranges before loading a plugin. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-003` | template registry and examples | **Build** | Keep template catalog with tags, required features and verified sample output. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-004` | API docs and type generation | **Compose** | Generate API docs/types from TS source and typed schemas on CI. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-005` | local developer setup and one-command run | **Build** | Create one-command local bootstrap with prereq checks, helpful error messages and offline mode. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-006` | ADRs and design docs | **Build** | Link design docs, ADRs and package ownership to code changes and release notes. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-007` | searchable troubleshooting | **Compose** | Index docs, structured error IDs and FAQ for deterministic troubleshooting. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-008` | code generators | **Compose** | Generate plugins/scenes/game boilerplate from validated templates, then run formatter/tests. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-009` | lint/format/static analysis | **Reuse** | Use ESLint, Prettier and TypeScript strict checks with package boundary policies. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-010` | dependency compatibility matrix | **Build** | Maintain matrix of runtime, renderer, browser, OS and plugin version compatibility. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-011` | upgrade migration notes | **Build** | Publish explicit SDK upgrade steps, codemods and migration test fixtures. | A onward | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-19-012` | backward compatibility and deprecations | **Build** | Define deprecation window, fallback behavior and semver break verification. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-013` | curated third-party plugin allowlist | **Build** | Curate approved third-party plugins with audits, rights and update ownership. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-014` | plugin capability/permission sandbox | **Build** | Define plugin permissions, isolate Studio code where possible, prohibit untrusted runtime eval. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-015` | changelog and semver | **Compose** | Generate changelog and artifact version tags from gated release metadata. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-016` | sample and starter games | **Compose** | Ship Chess, Bubble and small renderer/physics fixture starter games. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-017` | plugin conformance tests | **Build** | Run plugin conformance suite against lifecycle, permissions, disposal and ABI contracts. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-018` | technical debt register | **Build** | Track refactor work and high-risk shortcuts as explicit technical-debt ledger entries. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-019` | governance and owner approvals | **Build** | Require owner approval for architecture, supply-chain and release policy modifications. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |
| `CAP-19-020` | issue tracker with acceptance evidence | **Build** | Connect issue IDs, acceptance tests and artifacts to CAP IDs for evidence traceability. | A onward | Contract test + invalid-input fixture + representative integration/device smoke. |

### Domain 20 — Security (16 CAPs)

**Primary OSS/tools:** Pinned deps, license tools, signatures, trust-boundary tests · **Initial wave:** A onward — security.

| ID | Existing requirement | Strategy | Concrete mechanism to implement | Initial wave | Required proof |
|---|---|---|---|---|---|
| `CAP-20-001` | Least privilege and secret management | **Compose** | Use OS secret stores/CI secrets, minimal-scoped tokens and no secrets in clients. | A onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-20-002` | signed builds and provenance | **Compose** | Emit signed provenance, attestations where supported and reproducible artifact metadata. | A onward | Threat-model negative tests plus dependency/permission audit and reviewer evidence. |
| `CAP-20-003` | pinned third party dependencies | **Reuse** | Pin package lockfile, hashes and trusted source registry with upgrade approval. | A onward | Threat-model negative tests plus dependency/permission audit and reviewer evidence. |
| `CAP-20-004` | patch response and security advisories | **Build** | Define vulnerability response SLA, monitoring and patch release checklist. | A onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-20-005` | dependency review and license scanning | **Compose** | Use dependency audit, SBOM, license checker and manual high-risk supply-chain review. | A onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-20-006` | network transport encryption | **Reuse** | Require HTTPS/TLS for game API and WebSocket traffic with transport verification. | A onward | Threat-model negative tests plus dependency/permission audit and reviewer evidence. |
| `CAP-20-007` | authoritative score and purchase validation | **Build** | Recalculate score/turn/purchase effects on authoritative backend with duplicate protection. | A onward | Threat-model negative tests plus dependency/permission audit and reviewer evidence. |
| `CAP-20-008` | safe parsers for untrusted asset bundles | **Build** | Parse user bundles in bounded sandbox with path traversal, zip bomb and MIME safeguards. | A onward | Threat-model negative tests plus dependency/permission audit and reviewer evidence. |
| `CAP-20-009` | editor plugin permission boundaries | **Build** | Declare editor-plugin permissions; prevent arbitrary workspace/network access by default. | A onward | Threat-model negative tests plus dependency/permission audit and reviewer evidence. |
| `CAP-20-010` | user-generated content sanitization | **Build** | Sanitize/validate imported user text and assets; disallow executable script data by default. | A onward | Threat-model negative tests plus dependency/permission audit and reviewer evidence. |
| `CAP-20-011` | telemetry consent and deletion | **Build** | Enforce explicit telemetry consent, retention and deletion from local/cloud sinks. | A onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-20-012` | private data lifecycle controls | **Build** | Partition private data by profile/account; maintain deletion/access request procedures. | A onward | Threat-model negative tests plus dependency/permission audit and reviewer evidence. |
| `CAP-20-013` | release signature and manifest validation | **Compose** | Verify artifact signature, immutable manifest ID and allowed runtime version before activation. | A onward | Automated compliance/security scan plus versioned human policy/license review and negative tests. |
| `CAP-20-014` | secure cloud save authorization | **Build** | Verify cloud save authorization per user/game; log and test cross-tenant access denial. | A onward | Seeded fixture, invalid-input/property test, save/restart or replay parity as applicable. |
| `CAP-20-015` | supply chain incident playbook | **Build** | Write compromise response, key rotation, dependency quarantine and rollback steps. | A onward | Threat-model negative tests plus dependency/permission audit and reviewer evidence. |
| `CAP-20-016` | account and moderation abuse controls when activated | **Compose** | Activate anti-abuse/account/moderation controls only when online/social features launch. | A onward | Threat-model negative tests plus dependency/permission audit and reviewer evidence. |

## Layer-by-layer integration contracts (what we do NOT build)

### 2D runtime vs 3D runtime

- 2D games: PixiJS scene + SGE game rules + chosen plugins; no Babylon bundle by default.
- 3D games: Babylon scenes + 3D physics where required; no separate Pixi context unless UI benchmark and interop design justify.
- Renderer-independent game-state events cross boundary via typed DTOs, **not** mesh/pointer references.
- State updates happen in fixed ticks; render interpolation depends on renderer. GPU lost-state fallback depends on WebView/browser capabilities and asset source availability.

### Asset pipeline detailed transaction

`Author source → legal provenance → magic/size/type validation → import descriptor → dependency DAG → deterministic cook recipe → content hash → per-device variants → asset size/RAM/GPU budget → signed manifest if remote → test → activate or roll back`. Store source art separately from cooked outputs. Only recook changed DAG nodes.

### Studio workflow

`Wizard creates game manifest → choose template → import/edit scenes → set game-specific rules → assign prefabs/assets → preview → diagnostics/QA → export`. The wizard does not generate arbitrary accurate characters, levels or fun automatically. Visual scripting is compiled from a small allowlist to approved game commands, not untrusted JS execution.

### Automated game-production workflow

`G00 concept → G01 feasibility → G02 PRD/TRD → G03 art direction → G04 scaffold → G05 author content → G06 cook → G07 implement rules → G08 integrate → G09 tests/perf → G10 release candidate → G11 staged publish → G12 monitor → G13 maintain/EOL`. Human decisions: fun, art, store/rights, release approval. Automated: schemas, build, asset transformations, tests, packaging and reports.

## Risk and remaining decisions

- `U01`: Confirm local OS/CPU/RAM/GPU, Android real devices and benchmark profiles before performance targets.
- `U02`: Choose ECS/composition via actual `bitECS` vs simple state benchmark; no premature lock.
- `U03`: Confirm existing Chess repository implementation and external assets/licenses; no behavior-breaking rewrite.
- `U04`: Determine 3D target: modest WebView 3D vs heavy native 3D; choose adapter only after hardware spike.
- `U05`: Validate WebGPU/WebGL2 support on target Android WebViews; do not promise identical fidelity.
- `U06`: Check exact source/package license and asset redistribution rights at lockfile level, including GPL external tools.
- `U07`: Confirm where persisted master file and future implementation ledger are written and versioned; Library MD is design truth, repo is implementation truth.
- `U08`: Decide multiplayer scope per game; no default cloud backend for offline games.
- `U09`: Decide offline versus remotely delivered content with store policy and tamper model.
- `U10`: Define measurable product and art quality gate with human playtest and acceptance criteria.
- `U11`: Set per-game memory, startup and size budgets after sample-device profiling.
- `U12`: Define signing/secrets policy and Play Console readiness only for actual releases.
- `U13`: Measure fixed-timestep replay compatibility; never assume cross-platform physics determinism.
- `U14`: Decide telemetry, privacy and consent per game before enabling analytics or LiveOps.

## Source of truth / handoff

- Baseline (unchanged): `SGE_NEXT_MASTER_BLUEPRINT_v3.md`.
- This file: **v4.0 OSS-first implementation execution companion**, mapping **all 391 existing IDs**; no replacements or deletions.
- Update both the library documentation index and actual repository backlog only after verified future implementation. Each CAP should store: `status`, `PR/commit`, `automated test ID`, `device result`, `license review`, `release artifact`, `last verified date`.
- A future response should **not** assume an engine was built because this blueprint exists.

## Research source URLs (checked 2026-11-22)

- PixiJS overview: https://pixijs.com/2d ; Babylon.js repo: https://github.com/BabylonJS/Babylon.js
- Rapier physics: https://www.rapier.rs/docs/ ; Havok runtime docs: https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin/
- bitECS: https://bitecs.dev/ ; howler.js: https://github.com/goldfire/howler.js
- Dexie: https://github.com/dexie/Dexie.js ; React Flow: https://github.com/xyflow/xyflow ; Rete.js licensing: https://retejs.org/docs/licensing/
- glTF Transform: https://github.com/donmccurdy/glTF-Transform ; KTX: https://github.com/KhronosGroup/KTX-Software
- LDtk: https://github.com/deepnight/ldtk ; Tiled license: https://github.com/mapeditor/tiled/blob/master/LICENSE.GPL
- Blender licensing: https://www.blender.org/about/license/ ; Colyseus: https://github.com/colyseus/colyseus
- Capacitor: https://capacitorjs.com/docs/android ; Vitest: https://vitest.dev/ ; Playwright: https://github.com/microsoft/playwright
- O3DE inspiration: https://www.docs.o3de.org/docs/user-guide/assets/ ; Godot design reference: https://docs.godotengine.org/en/stable/about/list_of_features.html
