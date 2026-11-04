/**
 * All text for the events page, shaped like a Keystatic page singleton. When
 * Keystatic lands, move this to src/content/pages/events.yaml and replace the
 * import in events.astro with `await getSingleton("eventsPage")`.
 *
 * Words in {braces} are filled in from live event data.
 */
export const eventsPage = {
  seo: {
    title: "Events",
    description:
      "Join Small Planet Law for upcoming workshops and community events on estate planning and green legacy giving in Colorado. See what's coming up and register online.",
  },
  hero: {
    heading: "Events",
    // Shown when live event details aren't available
    intro:
      "Workshops, community gatherings, and educational events on estate planning and green legacy giving.",
  },
  status: {
    oneEvent: "Join us {when} for {event}.",
    manyEvents: "{count} chances to join us, starting {when} with {event}.",
    noEvents:
      "We're planning our next gathering. Sign up below and you'll be the first to hear about it.",
    allFull:
      "Sorry, we're all booked up for now. Sign up below and you'll be the first to hear about our next event.",
    today: "today",
    tomorrow: "tomorrow",
    onDate: "on {date}",
  },
  card: {
    hostedBy: "Hosted by {hosts}",
    registerButton: "Register",
    registerButtonLabel: "Register for {event}",
    full: "This event is full",
  },
  registration: {
    heading: "Register",
    body: "Choose an event below and share your details to save your spot.",
    formFallback: "Form not loading?",
    formFallbackLink: "Register on our secure form page",
    noScriptLink: "Open the event registration form",
  },
};

export type EventsPageContent = typeof eventsPage;
