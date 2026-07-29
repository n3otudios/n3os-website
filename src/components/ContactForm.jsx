import { useState } from "react";
import { CONTACT_ENDPOINT, postJson, mailtoLink } from "../lib/forms.js";
import { SITE } from "../data/content.js";

const EMPTY = { name: "", email: "", message: "" };

export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | done | error | handoff
  const [form, setForm] = useState(EMPTY);

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // No backend configured: rather than pretending the message was sent,
    // hand the whole thing to the visitor's mail client, already filled in.
    if (!CONTACT_ENDPOINT) {
      window.location.href = mailtoLink({
        subject: `Message from ${form.name || "the n3os site"}`,
        body: `${form.message}\n\n— ${form.name} (${form.email})`,
      });
      setStatus("handoff");
      return;
    }

    setStatus("sending");
    try {
      // `_subject` is a Formspree convention: it sets the notification
      // email's subject line. Both forms currently share one Formspree
      // form ID, so this is what makes a contact message distinguishable
      // from a notify signup in the inbox.
      await postJson(CONTACT_ENDPOINT, { ...form, _subject: `n3os contact form — ${form.name}` });
      setStatus("done");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          type="text"
          required
          autoComplete="name"
          value={form.name}
          onChange={update("name")}
        />
      </div>

      <div className="form-row">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
        />
      </div>

      <div className="form-row">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
        />
      </div>

      <button type="submit" className="btn btn--primary btn--block" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      <p className="form-status" role="status" aria-atomic="true">
        {status === "done" && `Thanks — your message is in. We usually reply within ${SITE.replyWindow}.`}
        {status === "error" && "That didn't go through. Try again, or email us directly below."}
        {status === "handoff" && "Opening your email app with the message ready to send."}
      </p>

      <p className="contact-direct">
        Or email us directly at <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
      </p>
    </form>
  );
}
