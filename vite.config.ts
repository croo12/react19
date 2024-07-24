import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
/** @type {import('vate').UserConfig} */
export default defineConfig({
  plugins: [react()],
})
