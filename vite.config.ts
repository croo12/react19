import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
	plugins: [react()],
	server: {
		port: parseInt(process.env.PORT ?? "5173"),
		hmr: true
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src")
		}
	},
	esbuild: {
		target: "esnext"
	},
	build: {
		target: "esnext",
		ssr: "server.ts",
		outDir: "dist"
	}
});
