// TEMP: sample states for designing the events page. Dev only. Delete this
// file and EventsPreviewBar.astro once the design is settled.
import { toPublicEvent, type PublicEvent, type RawEvent } from "./lawmatics";

export const PREVIEW_STATES = [
  "live",
  "0",
  "1",
  "3",
  "soon",
  "next-full",
  "all-full",
  "error",
];

const inDays = (days: number, hour: number) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour + 7, 0, 0, 0);
  return date.toISOString();
};

const bobbie = { id: "46052", name: "Roberta Mooney", profilePic: null };

const sample = (
  id: string,
  name: string,
  days: number,
  overrides: Partial<RawEvent> = {},
): RawEvent => ({
  id,
  name,
  description:
    "A relaxed, plain-English conversation about protecting the people you love and leaving a legacy that reflects your values. Bring your questions.",
  startDate: inDays(days, 12),
  endDate: inDays(days, 13),
  timeZone: "America/Denver",
  registrantCount: 3,
  maximumRegistrants: null,
  address: null,
  eventType: { name: "Virtual Event" },
  hosts: [bobbie],
  ...overrides,
});

const roundtable = sample("1", "The Regenerative Legacy Roundtable (Virtual)", 19);
const workshop = sample("2", "Green Estate Planning 101", 34, {
  eventType: { name: "Workshop" },
  hosts: [
    bobbie,
    { id: "5", name: "Guest With Photo", profilePic: "/favicon.svg" },
    { id: "6", name: "Guest Without Photo", profilePic: null },
  ],
  address: {
    street: "1550 Larimer St",
    street2: null,
    city: "Denver",
    state: "CO",
    zipcode: "80202",
  },
});
const gathering = sample("3", "Community Legacy Gathering", 48, {
  eventType: { name: "Community Gathering" },
  registrantCount: 12,
  maximumRegistrants: 12,
  hosts: [{ id: "2", name: "Guest Speaker", profilePic: null }],
});

const SAMPLES: Record<string, RawEvent[]> = {
  "0": [],
  "1": [roundtable],
  "3": [roundtable, workshop, gathering],
  soon: [sample("4", "The Regenerative Legacy Roundtable (Virtual)", 1)],
  "next-full": [
    { ...roundtable, registrantCount: 20, maximumRegistrants: 20 },
    workshop,
  ],
  "all-full": [
    { ...roundtable, registrantCount: 20, maximumRegistrants: 20 },
    gathering,
  ],
};

export function applyPreview(
  state: string | null,
  live: PublicEvent[] | null,
): PublicEvent[] | null {
  if (state === "error") return null;
  const samples = state ? SAMPLES[state] : undefined;
  return samples ? samples.map(toPublicEvent) : live;
}
