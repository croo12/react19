import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
	plugins: [react()],
	server: {
		port: parseInt(process.env.PORT ?? "5173"),
		hmr: true
	}
});
