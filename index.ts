import type { StarlightPlugin } from "@astrojs/starlight/types";

export interface YetiThemeConfig {
  /** Override specific components. Pass `false` to disable an override. */
  overrides?: Partial<Record<string, string | false>>;
  /**
   * Image for the built-in 404 page. Pass a path relative to your project
   * root (e.g. `./src/assets/not-found.svg`) to use your own image, or
   * `false` to disable it. Defaults to the theme's artwork.
   */
  notFoundImage?: string | false;
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
 * Exposes plugin options to components at render time via a virtual module.
 * `notFoundImage` resolves to a bundled asset URL (or `false` when disabled).
 */
function vitePluginYetiConfig(notFoundImage: YetiThemeConfig["notFoundImage"]) {
  const moduleId = "virtual:starlight-theme-yeti/config";
  const resolvedModuleId = `\0${moduleId}`;

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

  return {
    name: "vite-plugin-starlight-theme-yeti-config",
    resolveId(id: string) {
      if (id === moduleId) return resolvedModuleId;
    },
    load(id: string) {
      if (id === resolvedModuleId) return source;
    },
  };
}

export default function starlightThemeYeti(config?: YetiThemeConfig): StarlightPlugin {
  return {
    name: "@myerscode/starlight-theme-yeti",
    hooks: {
      "config:setup"({ config: starlightConfig, updateConfig, addIntegration }) {
        // Integration provides the virtual config module read by components
        addIntegration({
          name: "starlight-theme-yeti-config",
          hooks: {
            "astro:config:setup"({ updateConfig: updateAstroConfig }) {
              updateAstroConfig({
                vite: { plugins: [vitePluginYetiConfig(config?.notFoundImage)] },
              });
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

        // Theme CSS: virtual module for Tailwind config + theme styles
        const customCss = [
          `${PKG}/styles/global.css`,
          `${PKG}/styles/theme.css`,
          ...(starlightConfig.customCss || []),
        ];

        updateConfig({
          customCss,
          components: {
            ...components,
            ...(starlightConfig.components || {}),
          },
          expressiveCode,
        });
      },
    },
  };
}
