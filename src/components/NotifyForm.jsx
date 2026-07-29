import { useState } from "react";
import { NOTIFY_ENDPOINT, postJson } from "../lib/forms.js";
import { SITE } from "../data/content.js";

export default function NotifyForm({ id = "notify-email" }) {
  const [status, setStatus] = useState("idle"); // idle | sending | done | error | unconfigured
  const [email, setEmail] = useState("");
  const statusId = `${id}-status`;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!NOTIFY_ENDPOINT) {
      setStatus("unconfigured");
      return;
    }

    setStatus("sending");
    try {
      // See ContactForm.jsx — `_subject` distinguishes this from a contact
      // message in the shared Formspree inbox.
      await postJson(NOTIFY_ENDPOINT, { email, source: "n3os.com", _subject: "n3os Phase 2 notify signup" });
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="notify-form" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor={id}>
        Email address
      </label>
      <input
        id={id}
        type="email"
        required
        placeholder="you@example.com"
        autoComplete="email"
        aria-describedby={statusId}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Notify me"}
      </button>

      <p className="form-status" id={statusId} role="status" aria-atomic="true">
        {status === "done" && "You're on the list — we'll email you the moment it ships."}
        {status === "error" && "That didn't go through. Try again, or email us and we'll add you."}
        {status === "unconfigured" && (
          <>
            The signup list isn't connected yet. Email{" "}
            <a href={`mailto:${SITE.supportEmail}?subject=Notify%20me%20about%20Phase%202`}>{SITE.supportEmail}</a> and
            we'll add you by hand.
          </>
        )}
      </p>
    </form>
  );
}
