/** Helpers for editable Keystatic text that contains {placeholders}. */

/** Replaces {placeholders} in editable text */
export function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}

/** Text split around a placeholder so the inserted part can be styled or linked */
export interface SplitText {
  before: string;
  inserted?: string;
  after?: string;
}

/** Splits text at the first `{key}` and puts `inserted` in its place */
export function splitTemplate(
  text: string,
  key: string,
  inserted: string,
): SplitText {
  const placeholder = `{${key}}`;
  const index = text.indexOf(placeholder);
  if (index === -1) return { before: text };
  return {
    before: text.slice(0, index),
    inserted,
    after: text.slice(index + placeholder.length),
  };
}
