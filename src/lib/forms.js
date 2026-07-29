import { SITE } from "../data/content.js";

/**
 * Both forms used to fake it: they waited 500ms and then told the visitor
 * "You're on the list", having sent their address precisely nowhere. That's
 * the one failure mode worth fixing before any styling — a form that lies to
 * the person filling it in costs trust and loses the lead.
 *
 * So: if an endpoint is configured at build time, actually post to it and
 * report real success and real failure. If one isn't, say so plainly and hand
 * the visitor a route that does work (email), rather than inventing a
 * confirmation.
 *
 * Configure by adding a `.env` file next to package.json:
 *   VITE_NOTIFY_ENDPOINT=https://formspree.io/f/xxxxxxx
 *   VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxx
 * Anything prefixed `VITE_` is inlined at build time and is therefore public —
 * only ever put a publishable/anon key here, never a service key. Formspree's
 * form ID is meant to be public (it's a form action URL), so that's fine here.
 *
 * Both endpoints currently point at the same Formspree form — see the
 * `_subject` field each caller adds in ContactForm.jsx / NotifyForm.jsx,
 * which is how the two stay distinguishable in one shared inbox.
 */
export const NOTIFY_ENDPOINT = import.meta.env.VITE_NOTIFY_ENDPOINT || "";
export const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || "";

const REQUEST_TIMEOUT_MS = 12000;

export async function postJson(endpoint, payload) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    return response;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function mailtoLink({ subject, body }) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  return `mailto:${SITE.supportEmail}?${params.toString()}`;
}
