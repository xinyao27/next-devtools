

# [0.2.0](https://github.com/xinyao27/next-devtools/compare/v0.1.3...v0.2.0) (2024-01-11)


### Bug Fixes

* **core:** fix the issue of incompatibility with the src directory when querying routes ([10f3021](https://github.com/xinyao27/next-devtools/commit/10f3021537739a64eb0c35f6ebd10a2b431c2c6f)), closes [#12](https://github.com/xinyao27/next-devtools/issues/12)
* **plugin.ts:** check if NODE_ENV is in production before returning rewrites to ([371624a](https://github.com/xinyao27/next-devtools/commit/371624a2700cacebf537faab31598a1e18922950))
* **provider.tsx:** wrap return statement children with fragment to ensure code conformity to JSX standards ([df3007c](https://github.com/xinyao27/next-devtools/commit/df3007cd6dc7e9aea1ab7e0c332244fa58b98297))


### Features

* add overview tab ([5a6c3d8](https://github.com/xinyao27/next-devtools/commit/5a6c3d879a137187439065e3b8db74a1277d503b))
* **packages:** add NpmVersionCheck component to display information about package version ([10b7f0a](https://github.com/xinyao27/next-devtools/commit/10b7f0aa93c8fadad09f83764bd4b6dead80820e))

## [0.1.3](https://github.com/xinyao27/next-devtools/compare/v0.1.3-beta.3...v0.1.3) (2024-01-04)

## [0.1.3-beta.3](https://github.com/xinyao27/next-devtools/compare/v0.1.3-beta.2...v0.1.3-beta.3) (2024-01-04)


### Bug Fixes

* fix the exception caused by suffix name when importing after packaging ([0c9b222](https://github.com/xinyao27/next-devtools/commit/0c9b222016730dc704d6382d49b31f09de22d95b)), closes [#9](https://github.com/xinyao27/next-devtools/issues/9)

## [0.1.3-beta.2](https://github.com/xinyao27/next-devtools/compare/v0.1.3-beta.1...v0.1.3-beta.2) (2024-01-04)


### Bug Fixes

* **package.json:** add module field pointing to the ES modules output file to allow importing directly from source files in modern environments ([f46e32e](https://github.com/xinyao27/next-devtools/commit/f46e32ee8e513ee40e708e309824b01c8493d293))

## [0.1.3-beta.1](https://github.com/xinyao27/next-devtools/compare/v0.1.3-beta.0...v0.1.3-beta.1) (2024-01-04)


### Bug Fixes

* adjust export to resolve ts import error ([2368fb0](https://github.com/xinyao27/next-devtools/commit/2368fb03b037f629ec16e300ec0054ca5f350921))
* **package.json:** correct release script executed during pre-release stage to `prepatch`  so that it respects conventional versioning specification ([fd4c852](https://github.com/xinyao27/next-devtools/commit/fd4c85238fa2832d237c425937840837a1617a29))

## [0.1.3-beta.0](https://github.com/xinyao27/next-devtools/compare/v0.1.2...v0.1.3-beta.0) (2024-01-03)


### Bug Fixes

* **devtools:** exclude package name from getPackages function ([1287416](https://github.com/xinyao27/next-devtools/commit/1287416dad7b8a1adb7589329f9f4e2c95fa034c))
* remove examples/* from pnpm workspaces ([af79090](https://github.com/xinyao27/next-devtools/commit/af79090b262186161266deab4a72e1d42c0225fa)), closes [#5](https://github.com/xinyao27/next-devtools/issues/5)
* use env import in place of loadEnvConfig import ([2c486f6](https://github.com/xinyao27/next-devtools/commit/2c486f61285d96e7b4d3b7c3e8d92a6333be00a7)), closes [#6](https://github.com/xinyao27/next-devtools/issues/6)
* use rewrites to proxy the local server. ([64693d0](https://github.com/xinyao27/next-devtools/commit/64693d01464a77b3e54d0423a9cbd1dc63f40ce6))


### Features

* add examples dir ([cc31cb1](https://github.com/xinyao27/next-devtools/commit/cc31cb1e833e7fedc2e7c3fde06b4027bb4953a8))

## [0.1.2](https://github.com/xinyao27/next-devtools/compare/v0.1.2-beta.1...v0.1.2) (2024-01-01)

## [0.1.2-beta.1](https://github.com/xinyao27/next-devtools/compare/v0.1.2-beta.0...v0.1.2-beta.1) (2024-01-01)


### Bug Fixes

* fix DEV error ([f73f4e4](https://github.com/xinyao27/next-devtools/commit/f73f4e4b3d879ade81bedfa04cb9f58b2692616a))

## [0.1.2-beta.0](https://github.com/xinyao27/next-devtools/compare/v0.1.1...v0.1.2-beta.0) (2024-01-01)

## [0.1.1](https://github.com/xinyao27/next-devtools/compare/v0.1.0...v0.1.1) (2024-01-01)


### Bug Fixes

* adjust the volume after packaging and solve the problem of not being able to start in certain environments ([c58b6bf](https://github.com/xinyao27/next-devtools/commit/c58b6bf4504d837e692944882d9fb8fc1dd111a7))


### Features

* load only in the development environment ([bcc9d9e](https://github.com/xinyao27/next-devtools/commit/bcc9d9e36fc2a05cb85998cd9c62b1cea572a5cb))

# 0.1.0 (2023-12-31)


### Features

* init ([e2b69b2](https://github.com/xinyao27/next-devtools/commit/e2b69b2a8bc6bde56869a7de363de15a48a97db8))
* update deps and fix some bugs ([217b71a](https://github.com/xinyao27/next-devtools/commit/217b71a2d2ee46e1500f0abe92cfa741fe5d8185))
