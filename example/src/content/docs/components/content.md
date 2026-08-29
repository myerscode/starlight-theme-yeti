---
title: Content
description: PageTitle, MarkdownContent, Banner, Hero, and CallToAction
banner:
  content: 'Another <strong>Banner</strong> demo — every page can set its own via frontmatter.'
sidebar:
  order: 3
---

## PageTitle

The `<h1>` above — consistent sizing, spacing, and colour across every page.

## MarkdownContent

All prose styling comes from this override: headings, paragraphs, links, lists, tables, code, and admonitions. The [Showcase](/showcase/) page exercises the full range.

## Banner

The announcement bar at the top of this page. Set per page:

```yaml
banner:
  content: 'Ships in <strong>HTML</strong> via frontmatter.'
```

## Hero and CallToAction

Used on `template: splash` pages — see the [homepage](/) for the hero title, tagline, image, and the three action button variants (`primary`, `secondary`, `minimal`).
