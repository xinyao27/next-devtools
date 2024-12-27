import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { CLIENT_BASE_PATH, LOCAL_CLIENT_HMR_PORT, LOCAL_CLIENT_PORT } from '@next-devtools/shared/constants'

export default defineConfig({
  base: CLIENT_BASE_PATH,
  build: {
    target: 'esnext',
    outDir: '../core/dist/client',
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  server: {
    port: LOCAL_CLIENT_PORT,
    hmr: {
      port: LOCAL_CLIENT_HMR_PORT,
    },
  },
  plugins: [
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
})
