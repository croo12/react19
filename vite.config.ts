import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => {
	const isProduction = mode === "production";
	return {
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
			outDir: "dist"
		},
		define: {
			"import.meta.env.NODE_END_POINT": JSON.stringify(
				isProduction ? "http://43.201.21.137" : "http://localhost:5173"
			)
		}
	};
});
