import { defineConfig } from 'tsup'
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions'
import pkg from './package.json'
import type { Options } from 'tsup'

// https://stackoverflow.com/a/51399781
type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never

type EsbuildPlugin = ArrayElement<NonNullable<Options['esbuildPlugins']>>

const CjsShimPlugin: EsbuildPlugin = {
  name: 'cjs-shim-plugin',
  setup(build) {
    if (build.initialOptions.format !== 'esm') return
    build.onEnd((result) => {
      const filesNeedingShims =
        result.outputFiles?.filter((file) => file.text.match(/__dirname|__filename/) !== null) || []

      filesNeedingShims.forEach((file) => {
        const dirnameShim = `import { fileURLToPath as fileURLToPathShimImport } from "node:url";
import { dirname as dirnamePathShimImport } from "node:path";
const __filename = fileURLToPathShimImport(import.meta.url);
const __dirname = dirnamePathShimImport(__filename);
`

        const shimBuffer = new TextEncoder().encode(dirnameShim)
        const newContents = new Uint8Array(shimBuffer.length + file.contents.length)
        newContents.set(shimBuffer)
        newContents.set(file.contents, shimBuffer.length)
        file.contents = newContents
      })
    })
  },
}

export default defineConfig({
  entry: ['src/**/*.ts', 'src/**/*.tsx'],
  format: ['cjs', 'esm'],
  target: ['es2020', 'node16'],
  dts: true,
  clean: false,
  external: ['next', 'react'],
  esbuildOptions: (options) => {
    options.define = {
      'process.env.VERSION': JSON.stringify(pkg.version),
      'process.env.PACKAGE_NAME': JSON.stringify(pkg.name),
      'process.env.DEV': JSON.stringify(process.env.DEV === 'true'),
    }
    options.banner = { js: '"use client";' }
  },
  esbuildPlugins: [CjsShimPlugin, esbuildPluginFilePathExtensions({ cjsExtension: 'js', esmExtension: 'mjs' })],
})
