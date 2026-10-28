import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "node22",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  splitting: false,
  noExternal: ["@vraunix/shared"],
  external: ["@node-rs/argon2", "pdfkit"],
});
