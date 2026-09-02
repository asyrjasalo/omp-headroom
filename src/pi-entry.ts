// Pi coding agent entry point.
//
// Mario Zechner's Pi (@earendil-works/pi-coding-agent) discovers extensions
// declared under the `pi.extensions` key in package.json and invokes their
// default export with an `ExtensionAPI` instance. omp-headroom's core
// factory (src/index.ts) was written against the OMP fork
// (@oh-my-pi/pi-coding-agent), but the two `ExtensionAPI` shapes overlap
// heavily — at runtime they're duck-compatible. This thin wrapper:
//   1. Stamps the host tag (HEADROOM_HOST) on `pi` so the core factory can
//      branch on host-specific surfaces (zod tools, setLabel, session.compacting,
//      widget slot).
//   2. Casts Pi's typed `ExtensionAPI` to OMP's before delegating, since the
//      core factory's signature is typed for OMP. The cast is safe: the methods
//      we actually call have matching signatures on both forks.

import type { ExtensionAPI as PiExtensionAPI } from "@earendil-works/pi-coding-agent";
import { HEADROOM_HOST } from "./host.ts";
import "./host-stamp.ts";
import headroomExtension from "./index.ts";

export default function (pi: PiExtensionAPI) {
  (pi as unknown as Record<symbol, string>)[HEADROOM_HOST] = "pi";
  return (headroomExtension as unknown as (pi: PiExtensionAPI) => void)(pi);
}
