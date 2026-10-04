import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the site works at both
  // https://<user>.github.io/ and https://<user>.github.io/<repo>/
  base: './',
})
