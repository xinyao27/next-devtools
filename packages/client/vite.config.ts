import path, { resolve } from 'node:path'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import { type PluginOption, type ResolvedConfig } from 'vite'

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
  plugins: [react(), injectCss()],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
})

// inject css into the client
const fileRegex = /\.(css)$/
const injectCode = (code: string) =>
  `function styleInject(css,ref){if(ref===void 0){ref={}}var insertAt=ref.insertAt;if(!css||typeof document==="undefined"){return}var head=document.head||document.getElementsByTagName("head")[0];var style=document.createElement("style");style.type="text/css";if(insertAt==="top"){if(head.firstChild){head.insertBefore(style,head.firstChild)}else{head.appendChild(style)}}else{head.appendChild(style)}if(style.styleSheet){style.styleSheet.cssText=css}else{style.appendChild(document.createTextNode(css))}};styleInject(${JSON.stringify(code.trim())})`
const template = 'console.warn("__INJECT__")'

let viteConfig: ResolvedConfig
const css: string[] = []
function injectCss(): PluginOption {
  return {
    name: 'lib-inject-css',

    apply: 'build',

    configResolved(resolvedConfig: ResolvedConfig) {
      viteConfig = resolvedConfig
    },

    transform(code: string, id: string) {
      if (fileRegex.test(id)) {
        css.push(code)
        return { code: '' }
      }
      if (
        // @ts-expect-error ts-missing-module
        id.includes(viteConfig.build.lib.entry)
      ) {
        return {
          code: `${code}
          ${template}`,
        }
      }
      return null
    },

    async writeBundle(_: any, bundle: any) {
      for (const file of Object.entries(bundle)) {
        const { root } = viteConfig
        const outDir: string = viteConfig.build.outDir || 'dist'
        const fileName: string = file[0]
        const filePath: string = resolve(root, outDir, fileName)

        try {
          let data: string = fs.readFileSync(filePath, { encoding: 'utf8' })

          if (data.includes(template)) {
            data = data.replace(template, injectCode(css.join('\n')))
          }

          fs.writeFileSync(filePath, data)
        } catch (error) {
          console.error(error)
        }
      }
    },
  }
}
