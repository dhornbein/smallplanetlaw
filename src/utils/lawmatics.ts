/**
 * Reads upcoming events from a public Lawmatics registration form.
 *
 * This uses the same anonymous GraphQL endpoint as Lawmatics' own hosted form.
 * It is undocumented and can change without notice, so getUpcomingEvents never
 * throws: on any failure it returns null and the page shows the embedded form
 * on its own.
 *
 * Only request fields we display. `meetingLink` must stay out of these queries
 * because the link is only meant for people who have registered.
 */

const ENDPOINT = "https://lm.lawmatics.com/graphql";
const TIMEOUT_MS = 4000;
const DEFAULT_TIME_ZONE = "America/Denver";

const FORM_QUERY = `query sharedCustomForm($id: String!) {
  sharedCustomForm(id: $id) { previewBody }
}`;

const EVENTS_QUERY = `query events($ids: [ID], $shareUuid: ID) {
  events(ids: $ids, shareUuid: $shareUuid) {
    id
    name
    description
    startDate
    endDate
    timeZone
    registrantCount
    maximumRegistrants
    address { street street2 city state zipcode }
    eventType { name }
    hosts { id name profilePic }
  }
}`;

interface FormComponent {
  settings?: { type?: string };
  options?: { registerableEvents?: string[] };
}

interface FormData {
  sharedCustomForm: {
    previewBody: { rows: { components: FormComponent[] }[] };
  };
}

export interface RawEvent {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  timeZone: string | null;
  registrantCount: number | null;
  maximumRegistrants: number | null;
  address: {
    street: string | null;
    street2: string | null;
    city: string | null;
    state: string | null;
    zipcode: string | null;
  } | null;
  eventType: { name: string } | null;
  hosts: EventHost[] | null;
}

export interface EventHost {
  id: string;
  name: string;
  /** Signed link that expires after a few days, so never store it */
  profilePic: string | null;
}

export interface PublicEvent {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  /** ISO date for the <time> element */
  startDate: string;
  dateLabel: string;
  /** Compact date for running text, e.g. "Nov 23rd" */
  shortDate: string;
  timeLabel: string;
  /** Calendar days until the event in its own time zone; 0 means today */
  startsInDays: number;
  location: string | null;
  hosts: EventHost[];
  isFull: boolean;
}

async function query<T>(
  operationName: string,
  queryText: string,
  variables: Record<string, unknown>,
  signal: AbortSignal,
): Promise<T> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ operationName, query: queryText, variables }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Lawmatics responded with ${response.status}`);
  }

  const { data, errors } = await response.json();
  if (errors?.length || !data) {
    throw new Error(`Lawmatics ${operationName} query failed`);
  }
  return data;
}

function formatLocation(address: RawEvent["address"]): string | null {
  if (!address) return null;
  const { street, street2, city, state, zipcode } = address;
  const region = [state, zipcode].filter(Boolean).join(" ");
  const parts = [street, street2, city, region].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

const ORDINAL_SUFFIXES: Record<string, string> = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
};

function formatShortDate(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone,
  }).formatToParts(date);
  const month = parts.find((part) => part.type === "month")?.value;
  const day = Number(parts.find((part) => part.type === "day")?.value);
  const rule = new Intl.PluralRules("en-US", { type: "ordinal" }).select(day);
  return `${month} ${day}${ORDINAL_SUFFIXES[rule]}`;
}

/** Whole-day number for a moment as seen on the calendar in a time zone */
function calendarDay(date: Date, timeZone: string): number {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  })
    .format(date)
    .split("-")
    .map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

export function toPublicEvent(event: RawEvent): PublicEvent {
  const timeZone = event.timeZone ?? DEFAULT_TIME_ZONE;
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : start;
  const { registrantCount, maximumRegistrants } = event;

  return {
    id: event.id,
    name: event.name,
    description: event.description,
    type: event.eventType?.name ?? null,
    startDate: event.startDate,
    dateLabel: new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeZone,
    }).format(start),
    shortDate: formatShortDate(start, timeZone),
    startsInDays: Math.max(
      0,
      calendarDay(start, timeZone) - calendarDay(new Date(), timeZone),
    ),
    timeLabel: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
      timeZoneName: "short",
    }).formatRange(start, end),
    location: formatLocation(event.address),
    hosts: event.hosts ?? [],
    isFull:
      maximumRegistrants != null &&
      (registrantCount ?? 0) >= maximumRegistrants,
  };
}

/**
 * Returns events attached to the form that haven't ended, soonest first.
 * An empty array means no upcoming events; null means the lookup failed.
 */
export async function getUpcomingEvents(
  formId: string,
): Promise<PublicEvent[] | null> {
  try {
    const signal = AbortSignal.timeout(TIMEOUT_MS);

    const { sharedCustomForm } = await query<FormData>(
      "sharedCustomForm",
      FORM_QUERY,
      { id: formId },
      signal,
    );

    const ids = sharedCustomForm.previewBody.rows
      .flatMap((row) => row.components)
      .filter((component) => component.settings?.type === "event_registration")
      .flatMap((component) => component.options?.registerableEvents ?? []);

    if (ids.length === 0) return [];

    const { events } = await query<{ events: RawEvent[] }>(
      "events",
      EVENTS_QUERY,
      { ids, shareUuid: formId },
      signal,
    );

    const now = Date.now();
    return events
      .filter((event) => {
        const endsAt = Date.parse(event.endDate ?? event.startDate);
        return endsAt > now;
      })
      .sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
      .map(toPublicEvent);
  } catch (error) {
    console.error("Could not load Lawmatics events:", error);
    return null;
  }
}
