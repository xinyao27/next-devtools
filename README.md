# Next Devtools

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

<p>
Enhance Next developer experience
</p>

<p>
  <a href="https://next-devtools.vercel.app/">📚 Documentation</a>
</p>

## Getting Started

Using Next DevTools in your Next project.

## Examples

You can refer to these two projects to use Next DevTools.

- [app-router](./examples/app-router/)
- [pages-router](./examples/pages-router/)

You can create a Next.js project using Next DevTools with the following.

```bash
# app-router
npx create-next-app@latest nextjs-devtools-app-router --use-npm --example "https://github.com/xinyao27/next-devtools/tree/main/examples/app-router"

# pages-router
npx create-next-app@latest nextjs-devtools-pages-router --use-npm --example "https://github.com/xinyao27/next-devtools/tree/main/examples/pages-router"
```

### Installation

Inside your Next project directory, run the following:

```bash
npm i @next-devtools/core

// or

pnpm add @next-devtools/core
```

### `next.config`

You need to add the following configuration in the `next.config` file.

```js
const { withNextDevtools } = require('@next-devtools/core/plugin')

module.exports = withNextDevtools({
  // Other Next.js configuration ...
})
```

### `NextDevtoolsProvider`

#### `app router`

You need to add the `NextDevtoolsProvider` component in the `app/layout` file.

```tsx
import { NextDevtoolsProvider } from '@next-devtools/core'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextDevtoolsProvider>{children}</NextDevtoolsProvider>
      </body>
    </html>
  )
}
```

#### `pages router`

You need to add the `NextDevtoolsProvider` component in the `pages/_app` file.

```tsx
import { NextDevtoolsProvider } from '@next-devtools/core'

export default function App({ Component, pageProps }) {
  return (
    <NextDevtoolsProvider>
      <Component {...pageProps} />
    </NextDevtoolsProvider>
  )
}
```

## Inspired by NuxtDevtools

[Nuxt DevTools](https://github.com/nuxt/devtools) is a set of visual tools that help you to know your app better.

## Contribution Guide

Please refer to the [Contribution Guide](https://next-devtools.vercel.app/guide/contributing).

## License

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@next-devtools/core/latest.svg?style=flat&colorA=111111&colorB=ffffff
[npm-version-href]: https://npmjs.com/package/@next-devtools/core
[npm-downloads-src]: https://img.shields.io/npm/dt/@next-devtools/core.svg?style=flat&colorA=111111&colorB=ffffff
[npm-downloads-href]: https://npmjs.com/package/@next-devtools/core
[license-src]: https://img.shields.io/npm/l/@next-devtools/core.svg?style=flat&colorA=111111&colorB=ffffff
[license-href]: https://npmjs.com/package/@next-devtools/core
