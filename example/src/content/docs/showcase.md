---
title: Component Showcase
description: Typography, code blocks, tables, lists, and admonitions as styled by the theme
banner:
  content: 'This is the <strong>Banner</strong> component — set via <code>banner.content</code> frontmatter on any page.'
---

Everything on this page is rendered by the `MarkdownContent`, `PageTitle`, `ContentPanel`, and `TableOfContents` overrides. The banner above comes from the `Banner` override.

## Typography

### Third-level heading

#### Fourth-level heading

Regular paragraph text with **bold**, *italic*, `inline code`, and [a link](../guides/).

> Blockquotes look like this. Useful for callouts and important notes.

## Code Blocks

```typescript
import starlightThemeYeti from '@myerscode/starlight-theme-yeti';

interface YetiThemeConfig {
  overrides?: Partial<Record<string, string | false>>;
}

const plugin = starlightThemeYeti({ overrides: { Hero: false } });
```

```yaml
integrations:
  - starlight:
      plugins:
        - starlightThemeYeti
```

## Tables

| Component | Role | Disable with |
|-----------|------|--------------|
| `Header` | Top navigation bar | `overrides: { Header: false }` |
| `Sidebar` | Navigation sidebar | `overrides: { Sidebar: false }` |
| `Hero` | Splash page hero | `overrides: { Hero: false }` |
| `Footer` | Page footer | `overrides: { Footer: false }` |

## Lists

### Unordered

- Sidebar with icons and collapsible groups
- Light/dark/system theme toggle
- Prev/next pagination cards
  - With directional arrows
  - Styled borders and hover states
- Full-text search via Pagefind

### Ordered

1. Install the theme package
2. Register the plugin in `astro.config.mjs`
3. Add `[lucide:*]` icons to sidebar labels
4. Build

## Horizontal Rule

---

## Admonitions

:::note
This is a **note** — general information the reader should be aware of.
:::

:::tip
This is a **tip** — a helpful suggestion or best practice.
:::

:::caution
This is a **caution** — something to watch out for.
:::

:::danger
This is a **danger** warning — a critical issue that could cause problems.
:::
