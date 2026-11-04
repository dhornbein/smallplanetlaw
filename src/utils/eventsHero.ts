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

/**
 * Intro line for the events page, describing only events people can still
 * join. `null` events means the lookup failed.
 */
export function getHeroLede(
  events: PublicEvent[] | null,
  { hero, status }: Pick<EventsPageContent, "hero" | "status">,
): string {
  if (events === null) return hero.intro;
  if (events.length === 0) return status.noEvents;

  const open = events.filter((event) => !event.isFull);
  if (open.length === 0) return status.allFull;

  const [next] = open;
  const template = open.length === 1 ? status.oneEvent : status.manyEvents;
  return capitalize(
    fillTemplate(template, {
      count: NUMBER_WORDS[open.length] ?? String(open.length),
      when: when(next, status),
      event: next.name,
    }),
  );
}
