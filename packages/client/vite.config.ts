import { CLIENT_BASE_PATH, LOCAL_CLIENT_HMR_PORT, LOCAL_CLIENT_PORT } from '@next-devtools/shared/constants'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: CLIENT_BASE_PATH,
  build: {
    outDir: '../core/dist/client',
    rollupOptions: {
      output: {
        assetFileNames: `[name].[ext]`,
        entryFileNames: `[name].js`,
      },
    },
    target: 'esnext',
  },
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler', {}],
      },
    }),
  ],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  server: {
    hmr: {
      port: LOCAL_CLIENT_HMR_PORT,
    },
    port: LOCAL_CLIENT_PORT,
  },
})
