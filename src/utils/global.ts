export const PHONE_NUMBER = {
  display: "(303) 535-4311",
  href: "tel:+13035354311",
};

export const EMAIL_ADDRESS = {
  display: "hello@smallplanetlaw.com",
  href: "mailto:hello@smallplanetlaw.com"
};

export const BUSINESS_ADDRESS = {
  line1: "355 S. Teller St. Ste 200",
  line2: "Lakewood, Colorado 80026"
};

export const MAILCHIMP = {
  archiveUrl: `https://us15.campaign-archive.com/home/?u=${import.meta.env.MAILCHIMP_USER_ID}&id=${import.meta.env.MAILCHIMP_LIST_ID}`,
  userId: import.meta.env.MAILCHIMP_USER_ID,
  listId: import.meta.env.MAILCHIMP_LIST_ID,
};

// Lead magnet definitions for A/B testing
export interface LeadMagnet {
  id: string;
  tag: string;
  title: string;
  teaser: string;
  bullets: string[];
  downloadUrl: string;
  buttonText: string;
}

export const LEAD_MAGNETS: LeadMagnet[] = [
  {
    id: "green-ep-guide",
    tag: "Green EP Guide",
    title: "Your Free Green Estate Planning Guide",
    teaser: "Discover how to protect your family while honoring the planet — a fresh approach to estate planning that aligns your values with your legacy.",
    bullets: [
      "What green estate planning actually means",
      "Simple steps to make your plan eco-friendly",
      "How to leave a legacy that reflects your values",
    ],
    downloadUrl: "/resources/Green%20Estate%20Planning%20Guide.pdf",
    buttonText: "Get Your Free Guide",
  },
  {
    id: "6-mistakes-guide",
    tag: "6 Mistakes Guide",
    title: "6 Mistakes Families Make When Choosing an Estate Planning Attorney",
    teaser: "Before you hire anyone, make sure you know the costly mistakes most families make — and how to avoid every one of them.",
    bullets: [
      "The #1 red flag when choosing an attorney",
      "Why the cheapest option often costs the most",
      "What to ask before signing anything",
    ],
    downloadUrl: "/resources/6%20Mistakes%20Families%20Make%20When%20Choosing%20An%20Estate%20Planning%20Attorney.pdf",
    buttonText: "Get Your Free Guide",
  },
];

