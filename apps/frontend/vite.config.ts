// vite.config.js
import { defineConfig } from "vitest/config"
import sucrase from "@rollup/plugin-sucrase"

export default defineConfig({
  plugins: [
    sucrase({
      include: [".js", ".ts", ".jsx", ".tsx"],
      transforms: ["typescript", "jsx"], // Adjust the transforms as per your project's needs
    }),
  ],
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
