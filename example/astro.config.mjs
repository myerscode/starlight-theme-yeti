/**
 * Example site for @myerscode/starlight-theme-yeti.
 *
 * Demonstrates every theme setting: the plugin, the `overrides` option,
 * the `linkableGroups` sidebar helper, and `[lucide:*]` sidebar icons.
 */
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
      title: 'Yeti Theme',
      description: 'Demo site for the @myerscode/starlight-theme-yeti Starlight theme',
      // Site favicon (adapts to light/dark via currentColor)
      favicon: '/favicon.svg',
      // Logo shown in the header, with separate light/dark variants
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
      },
      // Header GitHub icon (Header component)
      social: [
        { label: 'GitHub', icon: 'github', href: 'https://github.com/myerscode/starlight-theme-yeti' },
      ],
      // Footer metadata (EditLink + LastUpdated components)
      editLink: {
        baseUrl: 'https://github.com/myerscode/starlight-theme-yeti/edit/main/example/',
      },
      lastUpdated: true,
      // linkableGroups makes group headings clickable; [lucide:*] renders icons
      sidebar: linkableGroups([
        { label: '[lucide:home] Welcome', slug: '' },
        { label: '[lucide:sparkles] Showcase', slug: 'showcase' },
        {
          // Group with slug + items: heading links to guides/index
          label: '[lucide:book-open] Guides',
          slug: 'guides',
          items: [
            { label: '[lucide:play] Getting Started', slug: 'guides/getting-started' },
            { label: '[lucide:settings] Theme Settings', slug: 'guides/settings' },
          ],
        },
        {
          // Group with slug + autogenerate: linked heading, items from directory
          label: '[lucide:blocks] Components',
          slug: 'components',
          autogenerate: { directory: 'components' },
          collapsed: true,
        },
      ]),
      plugins: [
        starlightThemeYeti({
          // Swap or disable any of the 18 component overrides:
          // overrides: {
          //   Footer: './src/components/MyFooter.astro', // use your own component
          //   Hero: false,                               // fall back to Starlight's default
          // },
          // Use your own 404 artwork (or `false` to disable it):
          // notFoundImage: './src/assets/not-found.svg',
        }),
      ],
    }),
  ],
});
