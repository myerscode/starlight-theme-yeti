import type { StarlightPlugin } from "@astrojs/starlight/types";

export interface YetiThemeConfig {
  /** Override specific components. Pass `false` to disable an override. */
  overrides?: Partial<Record<string, string | false>>;
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

export default function starlightThemeYeti(config?: YetiThemeConfig): StarlightPlugin {
  return {
    name: "@myerscode/starlight-theme-yeti",
    hooks: {
      "config:setup"({ config: starlightConfig, updateConfig }) {

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
        });
      },
    },
  };
}
