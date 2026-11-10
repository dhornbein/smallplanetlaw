/**
 * Catches likely typos in email addresses, such as "gmial.com" or "yahoo.con",
 * so the signup form can ask "Did you mean ...?" before submitting.
 *
 * This only warns. Unusual addresses can be real, so the visitor can always
 * submit what they typed.
 */

/** Providers people commonly use. Exact matches are never flagged. */
const COMMON_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "rocketmail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "aim.com",
  "comcast.net",
  "xfinity.com",
  "att.net",
  "sbcglobal.net",
  "bellsouth.net",
  "verizon.net",
  "centurylink.net",
  "q.com",
  "earthlink.net",
  "charter.net",
  "cox.net",
  "frontier.com",
  "protonmail.com",
  "proton.me",
  "pm.me",
  "fastmail.com",
  "hey.com",
  "mail.com",
  "email.com",
  "gmx.com",
  "zoho.com",
  "duck.com",
  "qq.com",
];

/** Endings that aren't real top-level domains but are one slip away from one */
const TLD_TYPOS: Record<string, string> = {
  con: "com",
  cpm: "com",
  cmo: "com",
  ocm: "com",
  cim: "com",
  vom: "com",
  xom: "com",
  comm: "com",
  coom: "com",
  ccom: "com",
  cpom: "com",
  "com.": "com",
  nte: "net",
  ner: "net",
  nett: "net",
  ogr: "org",
  orgg: "org",
  rog: "org",
  prg: "org",
  eud: "edu",
  edy: "edu",
};

export type EmailCheck =
  | { kind: "suggestion"; suggestion: string }
  | { kind: "missingEnding" };

/**
 * Edit distance where swapping two neighboring letters counts as one edit,
 * so "gmial" is one step from "gmail".
 */
function editDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) d[i][0] = i;
  for (let j = 0; j < cols; j++) d[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

/** Closest common provider within a small number of edits, if any */
function closestCommonDomain(domain: string): string | null {
  // Short names need a tighter limit, or real domains like "ibm.com" would
  // be "corrected" to "aim.com"
  const name = domain.split(".")[0];
  const limit = name.length <= 4 ? 1 : 2;
  let best: string | null = null;
  let bestDistance = Infinity;

  for (const candidate of COMMON_DOMAINS) {
    const distance = editDistance(domain, candidate);
    if (distance <= limit && distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return best;
}

/** Fixes an ending like ".con" on any domain, not just common providers */
function fixTld(domain: string): string {
  const dot = domain.lastIndexOf(".");
  if (dot === -1) return domain;
  const tld = domain.slice(dot + 1);
  const fixed = TLD_TYPOS[tld];
  return fixed ? `${domain.slice(0, dot)}.${fixed}` : domain;
}

/**
 * Returns a suggested correction or a warning, or null if the address looks
 * fine. Malformed input such as a missing "@" returns null because the
 * browser's own email validation already reports it.
 */
export function checkEmail(input: string): EmailCheck | null {
  const email = input.trim();
  const at = email.lastIndexOf("@");
  if (at <= 0 || at === email.length - 1) return null;

  const local = email.slice(0, at);
  let domain = email.slice(at + 1).toLowerCase();

  if (COMMON_DOMAINS.includes(domain)) return null;

  // Leftovers from typing a web address, e.g. "you@www.gmail.com"
  domain = domain.replace(/^www\./, "").replace(/\.+$/, "").replace(/\.{2,}/g, ".");

  // "you@gmail" is technically valid but almost never intended
  if (!domain.includes(".")) {
    const guess = closestCommonDomain(`${domain}.com`);
    if (guess) return { kind: "suggestion", suggestion: `${local}@${guess}` };
    return { kind: "missingEnding" };
  }

  domain = fixTld(domain);
  domain = closestCommonDomain(domain) ?? domain;

  const suggestion = `${local}@${domain}`;
  if (suggestion.toLowerCase() !== email.toLowerCase()) {
    return { kind: "suggestion", suggestion };
  }
  return null;
}
