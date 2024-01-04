import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts', 'src/**/*.tsx'],

  dts: true,

  clean: false,

  format: ['cjs', 'esm'],

  external: [
    'next',
    'react',
  ],
})
