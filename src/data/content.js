/**
 * Single source of truth for copy and site-wide constants.
 *
 * The directory URL and support address were previously typed by hand in eight
 * different components; changing either meant hunting for every occurrence.
 * The prerender step also reads FAQ_ITEMS from here to emit FAQPage structured
 * data, so the questions on the page and the questions Google sees can't drift
 * apart.
 */
export const SITE = {
  name: "n3os",
  studio: "N3O Studios",
  origin: "https://n3os.com",
  directoryUrl: "https://tools.n3os.com",
  directoryLabel: "tools.n3os.com",
  supportEmail: "support@n3os.com",
  replyWindow: "2 days",
};

export const MARQUEE_ITEMS = [
  "No account required",
  "No credit card",
  "Curated by hand",
  "Built by N3O Studios",
];

export const FAQ_ITEMS = [
  {
    q: "Is n3os actually free, or is there a catch?",
    a: "Free, no catch. Browsing the directory at tools.n3os.com costs nothing, requires no account, and never asks for a card. Phases 2 and 3 (hosting tools, building your own) may introduce paid tiers later — we'll announce pricing before that happens, and the directory itself stays free regardless.",
  },
  {
    q: "How do you choose which tools get listed?",
    a: "We try each tool ourselves before it goes in. No paid placements, no submission fees, no automatic listing just because a tool exists. If it doesn't earn a spot on its own merits, it doesn't make the cut.",
  },
  {
    q: "Can I submit a tool I built or use?",
    a: "Yes — reach out through the contact page with a link and a short description of what it does. We read every submission, though we can't guarantee a listing.",
  },
  {
    q: "When is Phase 2 (hosted tools) shipping?",
    a: "We don't publish hard dates we might miss. It's actively in progress — the fastest way to hear the moment it ships is the notify form below.",
  },
  {
    q: "Do you sell or share my data?",
    a: "There's no account system yet, so there's nothing to sell. If you email us, that email lives in our inbox — nowhere else.",
  },
];

export const NAV_LINKS = [
  { href: "about.html", label: "About" },
  { href: "subscriptions.html", label: "Pricing" },
  { href: "contact.html", label: "Contact" },
];
