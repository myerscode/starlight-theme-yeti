/** Splits a sidebar/label string of the form `[icon-set:name] Text` into its icon and text. */
export function parseIcon(label: string): { icon: string | null; text: string } {
  const match = label.match(/^\[([^\]]+)\]\s*(.*)$/);
  return match ? { icon: match[1], text: match[2] } : { icon: null, text: label };
}
