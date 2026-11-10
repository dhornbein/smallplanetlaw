import type { CollectionEntry } from "astro:content";
import type { PublicEvent } from "./lawmatics";
import { fillTemplate, splitTemplate, type SplitText } from "./template";

/** Events page text from src/content/pages/events.yaml (edited in Keystatic) */
export type EventsPageContent = CollectionEntry<"eventsPage">["data"];

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

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

function when(event: PublicEvent, status: EventsPageContent["status"]): string {
  if (event.startsInDays === 0) return status.today;
  if (event.startsInDays === 1) return status.tomorrow;
  return fillTemplate(status.onDate, { date: event.shortDate });
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
