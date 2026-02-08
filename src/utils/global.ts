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
  archiveUrl: `https://us21.campaign-archive.com/home/?u=${import.meta.env.MAILCHIMP_USER_ID}&id=${import.meta.env.MAILCHIMP_LIST_ID}`,
  userId: import.meta.env.MAILCHIMP_USER_ID,
  listId: import.meta.env.MAILCHIMP_LIST_ID,
};

