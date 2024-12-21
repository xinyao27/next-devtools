import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'NextDevtoolsClient',
      fileName: (format) => `client.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom/client', 'next'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
})
