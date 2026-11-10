import type { APIRoute } from 'astro';
import { LAWMATICS } from '../../utils/site';

const { newsletterForm } = LAWMATICS;

/**
 * Newsletter signup. Forwards the visitor's details to the Lawmatics
 * newsletter form through Lawmatics' documented, unauthenticated
 * "Submit Custom Form Entry" endpoint, then reports back to our own UI.
 * Docs: https://docs.lawmatics.com/ (Custom Forms > Submit Custom Form Entry)
 *
 * Which inputs are forwarded, and which are required, is set in
 * `LAWMATICS.newsletterForm` in src/utils/site.ts.
 */

export const prerender = false;

const SUBMIT_URL = `https://api.lawmatics.com/v1/forms/${newsletterForm.id}/submit`;
const TIMEOUT_MS = 8000;

/**
 * Text shown to visitors. These should become editable in Keystatic along
 * with the rest of the form text (see "Newsletter" in AGENTS.md).
 */
const MESSAGES = {
  success: 'Thank you for subscribing!',
  missingField: 'Please fill in all required fields.',
  invalidEmail: 'Please provide a valid email address.',
  rejected: "We couldn't sign you up with that information. Please check your details and try again.",
  failed: 'Something went wrong. Please try again later.',
};

/** Tracking fields the Lawmatics endpoint accepts alongside form values */
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = Record<string, string | boolean>;

function json(body: { success: boolean; message: string }, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Records which page the signup came from, plus any UTM tags on that page's
 * address. Uses the Referer header, which browsers send for same-site
 * requests both from fetch and from a plain form post.
 */
function trackingFields(referer: string | null): Payload {
  if (!referer) return {};
  try {
    const url = new URL(referer);
    const fields: Payload = { referring_url: url.href };
    for (const param of UTM_PARAMS) {
      const value = url.searchParams.get(param);
      if (value) fields[param] = value;
    }
    return fields;
  } catch {
    return {};
  }
}

/**
 * Maps our inputs to Lawmatics field keys. Returns an error message instead
 * if a required field is empty or the email is malformed.
 */
function formFields(formData: FormData): Payload | string {
  const fields: Payload = {};
  for (const [name, field] of Object.entries(newsletterForm.fields)) {
    const value = formData.get(name)?.toString().trim() ?? '';
    if (!value) {
      if (field.required) return MESSAGES.missingField;
      continue;
    }
    if ('type' in field && field.type === 'email' && !EMAIL_PATTERN.test(value)) {
      return MESSAGES.invalidEmail;
    }
    fields[field.key] = value;
  }
  return fields;
}

export const POST: APIRoute = async ({ request }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ success: false, message: MESSAGES.missingField }, 400);
  }

  // Hidden field that people never see. Bots that fill every field get a
  // normal-looking success and nothing is sent to Lawmatics.
  if (formData.get('website')?.toString()) {
    return json({ success: true, message: MESSAGES.success }, 200);
  }

  const fields = formFields(formData);
  if (typeof fields === 'string') {
    return json({ success: false, message: fields }, 400);
  }

  const payload: Payload = {
    ...trackingFields(request.headers.get('referer')),
    ...fields,
    ...newsletterForm.fixedValues,
  };

  try {
    const response = await fetch(SUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (response.ok) {
      return json({ success: true, message: MESSAGES.success }, 200);
    }

    console.error(
      `Lawmatics newsletter submit failed with ${response.status}:`,
      await response.text().catch(() => ''),
    );

    if (response.status >= 400 && response.status < 500) {
      return json({ success: false, message: MESSAGES.rejected }, 400);
    }
  } catch (error) {
    console.error('Lawmatics newsletter submit error:', error);
  }

  return json({ success: false, message: MESSAGES.failed }, 502);
};
