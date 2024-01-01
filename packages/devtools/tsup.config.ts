import { defineConfig } from 'tsup'
import { type Options } from 'tsup'
import pkg from './package.json'

// https://stackoverflow.com/a/51399781
type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never

type EsbuildPlugin = ArrayElement<NonNullable<Options['esbuildPlugins']>>

const CjsShimPlugin: EsbuildPlugin = {
  name: 'cjs-shim-plugin',
  setup(build) {
    if (build.initialOptions.format !== 'esm') return
    build.onEnd((result) => {
      const filesNeedingShims = result.outputFiles?.filter(file => file.text.match(/__dirname|__filename/) !== null) || []

      filesNeedingShims.forEach((file) => {
        const dirnameShim = `import { fileURLToPath as fileURLToPathShimImport } from "node:url";
import { dirname as dirnamePathShimImport } from "node:path";
const __filename = fileURLToPathShimImport(import.meta.url);
const __dirname = dirnamePathShimImport(__filename);
`

        const shimBuffer = Buffer.from(dirnameShim)
        file.contents = Buffer.concat([shimBuffer, file.contents])
      })
    })
  },
}

export default defineConfig({
  entry: ['./src/index.ts', './src/plugin.ts'],

  dts: true,

  clean: false,

  injectStyle: true,

  format: ['cjs', 'esm'],

  external: [
    'next',
    'react',
  ],

  esbuildOptions: (options) => {
    options.define = {
      'process.env.VERSION': JSON.stringify(pkg.version),
      'process.env.DEV': JSON.stringify(process.env.DEV),
    }
    options.banner = { js: '"use client";' }
  },

  esbuildPlugins: [CjsShimPlugin],
})
