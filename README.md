# install-pkg

Install package programmatically. Detect package managers automatically (npm, yarn, bun and pnpm).


## Install
```sh
npm install @pengzhanbo/install-pkg
# or
pnpm add @pengzhanbo/install-pkg
```

## Usage

```ts
import installPkg from '@pengzhanbo/install-pkg'

installPkg('your-package-name', { dev: true })
```

## LICENSE

MIT
