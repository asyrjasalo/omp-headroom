# Pi Coding Agent Conversion

**Date:** 2026-09-02
**Status:** approved (per user "Dual peer" choice)
**Scope:** dual-peer OMP + Pi support

## Goal
omp-headroom v0.1.4 currently targets `@oh-my-pi/pi-coding-agent` (the OMP fork by `can1357`). The user wants the same plugin to also work with the **Pi** coding agent (`@earendil-works/pi-coding-agent` 0.84.4, by Mario Zechner), and to be tested against a live Pi session.

## Decision: dual peer
- Keep `@oh-my-pi/pi-coding-agent` as peer (back-compat for existing OMP users).
- Add `@earendil-works/pi-coding-agent ^0.84.0` as peer.
- Both OMP and Pi discover the package via their own manifest keys (`omp.extensions`, `pi.extensions`) pointing at distinct thin entry files that share one core factory.

## Architecture
```
src/headroom-core.ts    factory(pi, host) — duck-typed pi, host = 'omp' | 'pi'
src/index.ts            OMP entry: imports ExtensionAPI from @oh-my-pi/pi-coding-agent;
                        default export = (pi) => core(pi, 'omp')
src/pi-entry.ts         Pi entry: imports ExtensionAPI from @earendil-works/pi-coding-agent;
                        default export = (pi) => core(pi, 'pi')
src/host.ts             exports HEADROOM_HOST symbol (host tag plumbing)

package.json:
  omp.extensions:   ./src/index.ts        (existing — OMP users)
  pi.extensions:    ./src/pi-entry.ts     (new — Pi users)

tests/                 unchanged; tests pass stubs without HEADROOM_HOST symbol → host = 'omp'
```

Host detection via `Symbol.for("headroom.host")` set by entry files. Factory reads it as a fallback to `'omp'`. Tests keep working unmodified.

## API differences mapped (the 4 forks)

| Surface                              | OMP                                                 | Pi 0.84.4                                            | Adapter action                                                                          |
| ------------------------------------ | --------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `pi.setLabel?.("Headroom")`          | static, no args                                     | `setLabel(entryId, label)` (per-entry, requires id) | host==='omp' → call; host==='pi' → skip                                                  |
| `pi.on("session.compacting", ...)`   | dotted name, returns `{ context, preserveData }`     | `session_before_compact` snake, returns `{ compaction?: CompactionResult }` (typebox) | host==='omp' → register as-is; host==='pi' → **skip handler** (feature gap — OMP-shaped return doesn't fit Pi's `SessionBeforeCompactResult`) |
| `pi.on("widget_layout", ...)`        | OMP-only event                                      | absent                                               | host==='omp' → register; host==='pi' → skip                                              |
| `ctx.ui.setWidget(key, body, opts)`  | full 5-row box at `rightEditor`                     | Pi: no `setWidget` (has `setStatus`, `setFooter`)    | host==='omp' → full widget render; host==='pi' → simplified 1-line status via `setStatus` |
| `pi.registerTool({ parameters: zod })` | OMP tools use zod                                  | Pi tools use typebox (`TSchema`)                    | host==='omp' → register both tools; host==='pi' → **skip** `registerTool` calls (feature gap — manual `headroom_compress`/`headroom_retrieve` tools unavailable on Pi) |
| All others (`on("session_start")`, `on("session_compact")`, `on("message_end")`, `on("before_provider_request")`, `registerCommand`, `registerFlag`, `pi.exec`, `pi.getFlag`, `ctx.ui.notify/confirm`, `ctx.sessionManager.*`) | identical | identical | no adapter needed |

## Feature matrix on Pi

| Feature                                    | OMP | Pi |
| ------------------------------------------ | --- | -- |
| Automatic `before_provider_request` compression | ✓ | ✓ |
| `registerFlag("headroom", ...)` toggle      | ✓ | ✓ |
| `/headroom` slash commands                  | ✓ | ✓ (same handler signature) |
| Widget (5-row box)                          | ✓ | partial (1-line status via `setStatus`) |
| `headroom_compress` / `headroom_retrieve` tools (manual) | ✓ | ✗ — feature gap |
| `/headroom compact` (headroom-assisted OMP compaction) | ✓ | ✗ — feature gap |
| OMP `session.compacting` fidelity augmentation | ✓ | ✗ — feature gap |
| `setLabel("Headroom")` static label         | ✓ | ✗ |
| Native OMP `session_compact` counting       | ✓ | ✓ (via Pi's `session_compact` event) |

Feature gaps are documented; manual tools and Headroom-assisted compaction depend on OMP-shaped return shapes that don't fit Pi's event contract. Out of scope to port unless the user requests it later.

## Package.json changes

```diff
  "peerDependencies": {
-   "@oh-my-pi/pi-coding-agent": "^16.4.4 || ^17.0.0"
+   "@oh-my-pi/pi-coding-agent": "^16.4.4 || ^17.0.0",
+   "@earendil-works/pi-coding-agent": "^0.84.0"
  },
+ "pi": { "extensions": ["./src/pi-entry.ts"] },
  "omp": { "extensions": ["./src/index.ts"] },
```

Dev deps: `@earendil-works/pi-coding-agent: 0.84.4` (already in working tree).

## Verification

1. `bun run verify` — existing test suite passes (tests don't set `HEADROOM_HOST` → default `'omp'`).
2. Smoke test: start `headroom-ai` proxy standalone (`~/.omp/agent/headroom-venv/bin/headroom --host 127.0.0.1 --port 8787`), then `pi -e /Users/asyrjasalo/Downloads/omp-headroom/src/pi-entry.ts` against a real provider, exercise `/headroom version`, `/headroom stats`, `/headroom test tool`, observe widget status line and `before_provider_request` log entries.

## Out of scope
- Porting `headroom_compress`/`headroom_retrieve` tools to Pi's typebox schema (would require rewriting tool defs in typebox).
- Porting `session.compacting` fidelity handler to Pi's `session_before_compact` (different return contract).
- Renaming package, marketing changes.
- Adding a Pi-native widget render (status-line is the cheapest viable substitute).
- Auto-detection of host (current symbol-tag approach requires an explicit entry file per host).

## Skipped (YAGNI)
- Dual entry via `package.json` `exports` map with conditional import — over-engineered, current pattern is simpler.
- Generic typebox adapter for zod schemas — would need a runtime mapper for every tool field; not justified for the manual tools.
