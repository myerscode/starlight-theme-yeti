/**
 * Pre-processes sidebar config to support groups with a `slug` property.
 * 
 * When a group has both a `slug` and `items`/`autogenerate`, the slug is
 * injected as a hidden first item marked with `data-index`. The SidebarSublist
 * component detects this and renders the group heading as a clickable link.
 *
 * Usage:
 * ```ts
 * import { linkableGroups } from '../theme/sidebar.ts';
 * 
 * sidebar: linkableGroups([
 *   { label: 'Guides', slug: 'guides', items: [...] },
 * ])
 * ```
 */
export function linkableGroups(sidebar: any[]): any[] {
  return sidebar.map((entry) => {
    if (entry.slug && entry.items) {
      const { slug, items, ...rest } = entry;
      const indexItem = { slug, attrs: { 'data-index': 'true' } };
      return { ...rest, items: [indexItem, ...items] };
    }
    if (entry.slug && entry.autogenerate) {
      // For autogenerate, wrap in items array (Starlight v0.39+)
      // and prepend the index item
      const { slug, autogenerate, ...rest } = entry;
      const indexItem = { slug, attrs: { 'data-index': 'true' } };
      return { ...rest, items: [indexItem, { autogenerate }] };
    }
    // Plain autogenerate without slug — wrap in items array for v0.39+
    if (entry.autogenerate && entry.label) {
      const { autogenerate, ...rest } = entry;
      return { ...rest, items: [{ autogenerate }] };
    }
    return entry;
  });
}
