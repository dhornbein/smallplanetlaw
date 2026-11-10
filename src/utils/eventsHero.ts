import type { EventsPageContent } from "./eventsContent";
import type { PublicEvent } from "./lawmatics";

const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

/** Replaces {placeholders} in editable text */
export function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

function when(event: PublicEvent, status: EventsPageContent["status"]): string {
  if (event.startsInDays === 0) return status.today;
  if (event.startsInDays === 1) return status.tomorrow;
  return fillTemplate(status.onDate, { date: event.shortDate });
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

/**
 * Status line for the events page hero, describing only events people can still
 * join. `null` events means the lookup failed.
 */
export function getHeroLede(
  events: PublicEvent[] | null,
  status: EventsPageContent["status"],
): SplitText {
  if (events === null) return { before: status.unknown };
  if (events.length === 0) return { before: status.noEvents };

  const open = events.filter((event) => !event.isFull);
  if (open.length === 0) return { before: status.allFull };

  const [next] = open;
  const template = open.length === 1 ? status.oneEvent : status.manyEvents;
  const text = capitalize(
    fillTemplate(template, {
      count: NUMBER_WORDS[open.length] ?? String(open.length),
      when: when(next, status),
    }),
  );

  return splitTemplate(text, "event", next.name);
}
