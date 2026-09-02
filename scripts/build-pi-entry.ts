#!/usr/bin/env bun
// Bundle src/pi-entry.ts + all internal deps into a single ESM .js for the Pi
// extension loader (which uses jiti and chokes on relative `.ts` import
// resolution when the entry imports a large codebase). Externalizes Pi itself
// (@earendil-works/pi-coding-agent) so jiti's virtualModules handle the Pi
// type, and externalizes OMP's package so jiti resolves it from this project's
// node_modules if needed (the factory never touches OMP imports at runtime —
// only at type-check time).
import { build } from "bun";
import { mkdirSync } from "node:fs";

mkdirSync("./dist-pi", { recursive: true });

const result = await build({
	entrypoints: ["./src/pi-entry.ts"],
	outdir: "./dist-pi",
	format: "esm",
	target: "node",
	external: ["@earendil-works/pi-coding-agent", "@oh-my-pi/pi-coding-agent", "@biomejs/biome"],
	naming: "pi-entry.js",
	sourcemap: "none",
	minify: false,
});

if (!result.success) {
	console.error("build:pi failed");
	for (const log of result.logs) console.error(log);
	process.exit(1);
}
console.log(`build:pi → dist-pi/pi-entry.js (${result.outputs.length} file)`);
