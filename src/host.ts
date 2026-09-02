// Host tag plumbing for dual-peer OMP/Pi support.
// Entry files (`src/index.ts` for OMP, `src/pi-entry.ts` for Pi) set
// `pi[HEADROOM_HOST] = "omp" | "pi"` before invoking the shared factory, and
// the factory reads it back to branch on host-specific API differences.
// Tests pass stubs without the symbol → default "omp", keeping back-compat.

export const HEADROOM_HOST = Symbol.for("headroom.host");
export type Host = "omp" | "pi";

// biome-ignore lint/suspicious/noExplicitAny: duck-typed pi from either fork; symbol-typed access only.
export function readHost(pi: any): Host {
  return pi?.[HEADROOM_HOST] ?? "omp";
}
