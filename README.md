# @myerscode/starlight-theme-yeti

A clean, modern [Starlight](https://starlight.astro.build/) theme with Tailwind CSS styling, icon support, and collapsible linked sidebar groups.

## Features

- Tailwind CSS v4 styling
- Icon support via [`astro-icon`](https://www.astroicon.dev/) (use `[lucide:name]` syntax in sidebar labels)
- Collapsible, linkable sidebar groups
- Custom components: header, sidebar, pagination, table of contents, hero, footer and more

## Installation

```sh
npm install @myerscode/starlight-theme-yeti
```

This theme ships as source (`.ts` / `.astro`). You also need the peer dependencies installed in your project:

```sh
npm install @astrojs/starlight astro
```

## Usage

Add the theme as a Starlight plugin in your `astro.config.mjs`, and wire up Tailwind and icons:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import starlightThemeYeti from '@myerscode/starlight-theme-yeti';
import { linkableGroups } from '@myerscode/starlight-theme-yeti/sidebar';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    icon(),
    starlight({
      title: 'My Docs',
      plugins: [starlightThemeYeti()],
      customCss: ['./src/styles/tailwind.css'],
      sidebar: linkableGroups([
        { label: '[lucide:rocket] Welcome', slug: '' },
      ]),
    }),
  ],
});
```

Create `./src/styles/tailwind.css` in your project (the Tailwind entry lives in the consuming project, not the theme):

```css
@layer base, starlight, theme, components, utilities;
@import '@astrojs/starlight-tailwind';
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
```

## Configuration

The plugin accepts an optional config object to override individual components:

```js
starlightThemeYeti({
  overrides: {
    // Replace a component with your own
    Footer: './src/components/MyFooter.astro',
    // Disable an override and fall back to Starlight's default
    Hero: false,
  },
})
```

## License

MIT
