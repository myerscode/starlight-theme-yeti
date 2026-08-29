---
title: Getting Started
description: Install and configure the Yeti theme in a Starlight project
sidebar:
  order: 1
---

## Install

```sh
npm install @myerscode/starlight-theme-yeti
```

The theme ships as source (`.ts` / `.astro`), so the peer dependencies must be installed in your project:

```sh
npm install @astrojs/starlight astro
```

Icons and Tailwind are used by the theme's components:

```sh
npm install astro-icon @iconify-json/lucide tailwindcss @tailwindcss/vite
```

## Configure

Register the plugin in `astro.config.mjs`, wire up Tailwind and icons:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import starlightThemeYeti from '@myerscode/starlight-theme-yeti';
import { linkableGroups } from '@myerscode/starlight-theme-yeti/sidebar';

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  integrations: [
    icon(),
    starlight({
      title: 'My Docs',
      plugins: [starlightThemeYeti()],
      sidebar: linkableGroups([
        { label: '[lucide:rocket] Welcome', slug: '' },
      ]),
    }),
  ],
});
```

The plugin injects the theme's CSS (`styles/global.css` and `styles/theme.css`) and registers all component overrides automatically — no `customCss` or `components` config needed. Anything you add to `customCss` yourself is loaded *after* the theme's styles, so your rules win.

:::tip
This example site is exactly this setup — see [`example/astro.config.mjs`](https://github.com/myerscode/starlight-theme-yeti/blob/main/example/astro.config.mjs) in the repo.
:::
