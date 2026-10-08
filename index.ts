import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { StarlightPlugin } from "@astrojs/starlight/types";

const palettes = ["yeti", "black", "blue", "green", "orange", "purple", "red", "yellow"] as const;

export type YetiPalette = (typeof palettes)[number];

export interface YetiThemeConfig {
  /** Override specific components. Pass `false` to disable an override. */
  overrides?: Partial<Record<string, string | false>>;
  /**
   * Image for the built-in 404 page. Pass a path relative to your project
   * root (e.g. `./src/assets/not-found.svg`) to use your own image, or
   * `false` to disable it. Defaults to the theme's artwork.
   */
  notFoundImage?: string | false;
  /**
   * Colour palette preset. `yeti` (default, monochrome silver) or `black`,
   * `blue`, `green`, `orange`, `purple`, `red` or `yellow`. Sets
   * Starlight's `--sl-color-*` tokens for both light and dark mode.
   */
  palette?: YetiPalette;
  /**
   * Render a Markdown changelog in the Keep a Changelog format as a styled
   * page, linked from the end of the sidebar. A string is shorthand for
   * `{ file }`; `false` (the default) disables it.
   */
  changelog?:
    | false
    | string
    | {
        /** Path to the changelog Markdown file, relative to the project root, e.g. `./CHANGELOG.md`. */
        file: string;
        /** Route slug. Defaults to `changelog`, so the page is served at `/changelog/`. */
        slug?: string;
        /** Sidebar label. Defaults to `[lucide:history] Changelog`. */
        label?: string;
        /** Also link to the page from the footer. Defaults to `false`. */
        showInFooter?: boolean;
      };
}

interface ChangelogConfig {
  file: string;
  slug: string;
  label: string;
  showInFooter: boolean;
  href: string;
}

const PKG = "@myerscode/starlight-theme-yeti";

const defaultComponents: Record<string, string> = {
  SkipLink: `${PKG}/components/SkipLink.astro`,
  PageFrame: `${PKG}/components/PageFrame.astro`,
  TwoColumnContent: `${PKG}/components/TwoColumnContent.astro`,
  Header: `${PKG}/components/Header.astro`,
  Sidebar: `${PKG}/components/Sidebar.astro`,
  SidebarSublist: `${PKG}/components/SidebarSublist.astro`,
  PageSidebar: `${PKG}/components/PageSidebar.astro`,
  Banner: `${PKG}/components/Banner.astro`,
  ContentPanel: `${PKG}/components/ContentPanel.astro`,
  PageTitle: `${PKG}/components/PageTitle.astro`,
  Hero: `${PKG}/components/Hero.astro`,
  MarkdownContent: `${PKG}/components/MarkdownContent.astro`,
  Footer: `${PKG}/components/Footer.astro`,
  LastUpdated: `${PKG}/components/LastUpdated.astro`,
  EditLink: `${PKG}/components/EditLink.astro`,
  Pagination: `${PKG}/components/Pagination.astro`,
  ThemeSelect: `${PKG}/components/ThemeSelect.astro`,
  TableOfContents: `${PKG}/components/TableOfContents.astro`,
};

/**
 * Exposes plugin options to components at render time via virtual modules.
 * `notFoundImage` resolves to a bundled asset URL (or `false` when disabled).
 * `changelog` is `null` or `{ slug, label, showInFooter, href }`; when set, a
 * second module re-exports the user's Markdown file (`compiledContent`,
 * `getHeadings`, …) for the changelog route.
 */
function vitePluginYetiConfig(
  notFoundImage: YetiThemeConfig["notFoundImage"],
  changelog: ChangelogConfig | null,
) {
  let source: string;
  if (notFoundImage === false) {
    source = "export const notFoundImage = false;";
  } else {
    const specifier =
      typeof notFoundImage === "string"
        ? // User path, resolved from the project root
          "/" + notFoundImage.replace(/^\.?\//, "")
        : // Theme default artwork
          `${PKG}/assets/404.svg`;
    source = `import art from ${JSON.stringify(`${specifier}?url`)};\nexport const notFoundImage = art;`;
  }
  const publicChangelog = changelog && {
    slug: changelog.slug,
    label: changelog.label,
    showInFooter: changelog.showInFooter,
    href: changelog.href,
  };
  source += `\nexport const changelog = ${JSON.stringify(publicChangelog)};`;

  const modules: Record<string, string> = { "virtual:starlight-theme-yeti/config": source };
  if (changelog) modules["virtual:starlight-theme-yeti/changelog"] = `export * from ${JSON.stringify(changelog.file)};`;

  return {
    name: "vite-plugin-starlight-theme-yeti-config",
    resolveId(id: string) {
      if (id in modules) return `\0${id}`;
    },
    load(id: string) {
      if (id.startsWith("\0")) return modules[id.slice(1)];
    },
  };
}

export default function starlightThemeYeti(config?: YetiThemeConfig): StarlightPlugin {
  return {
    name: "@myerscode/starlight-theme-yeti",
    hooks: {
      "config:setup"({ config: starlightConfig, updateConfig, addIntegration, astroConfig, logger }) {
        const changelogOption =
          !config?.changelog
            ? undefined
            : typeof config.changelog === "string"
              ? { file: config.changelog }
              : config.changelog;
        let changelog: ChangelogConfig | null = null;
        if (changelogOption) {
          const file = fileURLToPath(new URL(changelogOption.file, astroConfig.root));
          if (!existsSync(file)) {
            throw new Error(
              `[${PKG}] Changelog file "${changelogOption.file}" not found (resolved to ${file}).`,
            );
          }
          const slug = changelogOption.slug ?? "changelog";
          if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(slug)) {
            throw new Error(
              `[${PKG}] Invalid changelog slug "${slug}". Use lowercase letters, digits and hyphens, with "/" between segments.`,
            );
          }
          changelog = {
            file,
            slug,
            label: changelogOption.label ?? "[lucide:history] Changelog",
            showInFooter: changelogOption.showInFooter ?? false,
            href: `${astroConfig.base.replace(/\/$/, "")}/${slug}/`,
          };
        }

        addIntegration({
          name: "starlight-theme-yeti-config",
          hooks: {
            "astro:config:setup"({ updateConfig: updateAstroConfig, injectRoute }) {
              updateAstroConfig({
                vite: { plugins: [vitePluginYetiConfig(config?.notFoundImage, changelog)] },
              });
              if (changelog) {
                injectRoute({
                  pattern: `/${changelog.slug}`,
                  entrypoint: `${PKG}/routes/Changelog.astro`,
                });
              }
            },
          },
        });

        // Expressive-Code — apply theme's syntax themes + chrome tokens, but
        // respect `expressiveCode: false` and merge on top of user config so
        // any override wins.
        const userEc =
          !starlightConfig.expressiveCode || starlightConfig.expressiveCode === true
            ? {}
            : starlightConfig.expressiveCode;

        const expressiveCode =
          starlightConfig.expressiveCode === false
            ? false
            : {
                themes: ["github-light-default", "github-dark-default"],
                ...userEc,
                styleOverrides: {
                  borderColor: "var(--sl-color-gray-5)",
                  borderRadius: "0.5rem",
                  ...userEc.styleOverrides,
                  frames: {
                    editorTabBarBorderBottomColor: "var(--sl-color-gray-5)",
                    editorActiveTabIndicatorTopColor: "unset",
                    editorActiveTabIndicatorBottomColor: "var(--sl-color-text-accent)",
                    frameBoxShadowCssValue: "unset",
                    ...userEc.styleOverrides?.frames,
                  },
                  textMarkers: {
                    backgroundOpacity: "40%",
                    ...userEc.styleOverrides?.textMarkers,
                  },
                },
              };

        // Build component overrides — respect user overrides
        const userOverrides = config?.overrides || {};
        const components: Record<string, string> = {};

        for (const [name, path] of Object.entries(defaultComponents)) {
          if (userOverrides[name] === false) continue;
          components[name] = (userOverrides[name] as string) || path;
        }

        const palette = config?.palette ?? "yeti";
        if (!(palettes as readonly string[]).includes(palette)) {
          throw new Error(
            `[${PKG}] Unknown palette "${palette}". Valid palettes: ${palettes.join(", ")}.`,
          );
        }

        // Theme CSS: virtual module for Tailwind config + theme styles.
        // Only the selected palette is loaded, before the user's customCss
        // so their own overrides still win.
        const customCss = [
          `${PKG}/styles/global.css`,
          `${PKG}/styles/theme.css`,
          `${PKG}/styles/palettes/${palette}.css`,
          ...(starlightConfig.customCss || []),
        ];

        const sidebar =
          changelog && Array.isArray(starlightConfig.sidebar)
            ? [...starlightConfig.sidebar, { label: changelog.label, link: `/${changelog.slug}/` }]
            : undefined;
        if (changelog && !sidebar) {
          logger.warn(
            "changelog: define `sidebar` in your Starlight config to show the Changelog link in navigation",
          );
        }

        updateConfig({
          customCss,
          components: {
            ...components,
            ...(starlightConfig.components || {}),
          },
          expressiveCode,
          ...(sidebar && { sidebar }),
        });
      },
    },
  };
}
