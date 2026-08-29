---
title: Navigation
description: Header, Sidebar, SidebarSublist, ThemeSelect, and SkipLink
sidebar:
  order: 1
---

## Header

The top bar you're looking at — site title, Pagefind search, social icon links (the GitHub icon comes from the `social` config), and the theme toggle.

## ThemeSelect

The light/dark/system toggle in the header. Try it — the entire theme is styled for both colour schemes via `styles/theme.css` custom properties.

## Sidebar and SidebarSublist

The navigation on the left demonstrates everything `SidebarSublist` adds:

- `[lucide:*]` icon tokens in labels
- Clickable group headings (**Guides**, **Components**) via `linkableGroups`
- Collapsible groups — **Components** starts collapsed (`collapsed: true`)
- Active item highlighting

## SkipLink

Press <kbd>Tab</kbd> on page load — the first focusable element is the accessible skip-to-content link.
