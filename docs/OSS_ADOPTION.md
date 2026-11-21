# Open-source adoption gate (proposed — no external runtime packages integrated yet)

The foundation deliberately has no render or physics dependency until the adapter contracts and platform budgets are validated. This is *not* a claim that PixiJS, Babylon.js, Rapier, Havok, Colyseus or a studio editor have already been installed.

| Upstream | Intended use | Licensing checkpoint | Status |
| --- | --- | --- | --- |
| PixiJS | Optional 2D renderer | MIT, exact package and transitive inventory | CANDIDATE |
| Babylon.js | Optional 3D renderer | Apache-2.0, exact packages | CANDIDATE |
| Rapier | Optional physics 2D/3D | Apache-2.0, WASM device proof | CANDIDATE |
| Babylon Havok | Optional 3D physics | Published wrapper package and upstream engine terms independently review | CANDIDATE |
| bitECS | Optional ECS | MIT, benchmark against existing composition | CANDIDATE |
| howler.js | Audio playback | MIT, mobile browser behavior | CANDIDATE |
| Dexie.js | IndexedDB saves | Apache-2.0, migration and transaction tests | CANDIDATE |
| glTF Transform | Build-time glTF content cooking | MIT, input validation, source provenance | CANDIDATE |
| LDtk | External level editor / importer | MIT, source content ownership | CANDIDATE |
| Colyseus | Separate optional multiplayer service | MIT, authority and load tests | CANDIDATE |

**Rules:** Prefer upstream managed dependencies over copied source or forks. Maintain pinned versions, SBOM, notices and CVE review. Never assume downloaded art, fonts or sounds permit redistribution. Do not combine GPL editor code into game runtime without an explicit licensing review. All packages must pass representative real-device acceptance before being considered approved.

The repository itself currently carries **AGPL-3.0**, unchanged. This is a separate license decision for contributors and distributed games; resolve with the rights holder before commercial distribution.
