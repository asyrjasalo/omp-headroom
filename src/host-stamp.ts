// Side-effect module: stamp the global host tag to "pi" so config.ts can
// resolve HEADROOM_CONFIG_PATH to the pi-only path. Must be imported by
// pi-entry BEFORE any module that transitively loads config.ts (ES module
// imports hoist, so this stamp needs its own file to run at the right
// point in the import graph).
import { HEADROOM_HOST } from "./host.ts";

(globalThis as unknown as Record<symbol, string>)[HEADROOM_HOST] = "pi";
