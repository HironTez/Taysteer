import { defineConfig } from "vitest/config"
import { loadEnv } from "vite"
import sucrase from "@rollup/plugin-sucrase"

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [
      sucrase({
        include: [".js", ".ts", ".jsx", ".tsx"],
        transforms: ["typescript", "jsx"], // Adjust the transforms as per your project's needs
      }),
    ],
    server: {
      open: true,
      port: Number(env.PORT_FRONTEND) || undefined,
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
  }
})
