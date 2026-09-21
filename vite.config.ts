import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Fleet contract: nginx forwards the whole /direct/<agent>:<port> prefix
// UNCHANGED, so every route and asset must be served under $BASE_PATH. Vite
// bakes this in at BUILD time, so the build step has to see the variable.
// Empty/unset => serve at the host root (standalone mode).
const raw = (process.env.BASE_PATH ?? '').trim()
const basePath = raw ? `/${raw.replace(/^\/+|\/+$/g, '')}` : ''

// https://vite.dev/config/
export default defineConfig({
  base: basePath ? `${basePath}/` : '/',
  plugins: [react()],
})
