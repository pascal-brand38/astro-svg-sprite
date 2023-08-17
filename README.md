# astro-svg-sprite ⚗️

This is a zero-dependency [Astro Integration](https://docs.astro.build/en/guides/integrations-guide/) that generates a `sprite.svg` from SVG files in your Astro project.

> The package depends on the Integrations API of Astro 2.0 and above

## Installation

### Manual Install

First, install the `astro-svg-sprite` package using your package manager. If you're using npm or aren't sure, run this in the terminal:

```dash
npm install astro-svg-sprite -D
```

Then, apply this integration to your astro.config.\* file using the integrations property:

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import svgSprite from "astro-svg-sprite";

export default defineConfig({
  // ...
  integrations: [svgSprite()],
});
```

Then store the SVG file you want to generate `sprite.svg` in the `/src/assets/images/sprite` directory, it will automatically generate `sprite.svg` for you and store it in `/public/assets/images`. More flexible configuration to participate in [usage](#usage).

To use the `sprite.svg` file, you can make `components/Sprite.astro` like this.

```astro
---
export interface props {
  name: string;
}

const { class:className, name } = Astro.props;
---
<svg class={className}>
  <use xlink:href=`${Astro.site}assets/images/sprite.svg#${name}`></use>
</svg>
```

Then call the `Sprite.astro` component on other pages.

```astro
---
import Sprite from 'components/Sprite.astro'
---
<Sprite name="fileName" class="customClassName"/>

```

### Quick Install

The `astro add` command-line tool automates the installation for you.

```dash
# Using NPM
npx astro add astro-svg-sprite

# Using Yarn
yarn astro add astro-svg-sprite

# Using PNPM
pnpm astro add astro-svg-sprite
```

## Usage

This is the default configuration of the plugin. You can configure it yourself according to [JSDoc](./dist/index.d.ts).

> **⚠ CAUTION:** `emitFile:false` use with caution.
> 
> The current the option just inserts the `sprite.svg` code into the page `<body>` through `javascript`.
>
> 1. In order to improve the user experience, I hope to support direct insertion `sprite.svg` code into the page `<body>` tag in the future.
> 2. I don't know which official API or better way to do this so far.

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import svgSprite from "astro-svg-sprite";

export default defineConfig({
  // ...
  integrations: [
    // See JSDoc for more usage guidelines.
    // When you install you can get the configuration information you want.
    svgSprite({
      include: "./src/assets/images/sprite",
      mode: "verbose", 
      emitFile: {
        compress: "standard", 
        path: "assets/images",
      },
    }),
  ],
});
```

> **Note:** `svgSprite.emitFile.compress` recommends using the default `standard` mode. The best mode will convert some svg tags into path tags.

I'm considering whether to add the path merging function in the future, because it may bring about visual changes and other flexible features.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of changes to this integration.
