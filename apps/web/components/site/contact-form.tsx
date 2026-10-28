"use client";

import { useState } from "react";
import { SERVICES } from "@vraunix/shared";
import { api, ApiError } from "@/lib/api";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";

type ContactResult = {
  reference: string;
  receivedAt: string;
};

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("sending");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const result = await api<ContactResult>("/public/contact", {
        method: "POST",
        body: {
          name: String(data.get("name") ?? ""),
          businessName: String(data.get("businessName") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          serviceInterest: String(data.get("serviceInterest") ?? ""),
          message: String(data.get("message") ?? ""),
          privacyConsent: data.get("privacyConsent") === "on",
          honeypot: String(data.get("companyWebsite") ?? ""),
        },
      });
      setReference(result.data.reference);
      setStatus("sent");
      form.reset();
    } catch (cause) {
      setStatus("idle");
      setError(
        cause instanceof ApiError
          ? cause.message
          : "Your message could not be sent. Please try again."
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="form-success theme-dark">
        <span className="form-success__icon">
          <Icon name="check" size={26} />
        </span>
        <p className="eyebrow">Message received</p>
        <h2>Thank you. We have your note.</h2>
        <p>
          A real person will review it and respond using the contact details you
          provided. Your reference is <strong>{reference}</strong>.
        </p>
        <button
          type="button"
          className="vx-button vx-button--primary vx-button--md"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="form contact-form" onSubmit={submit} noValidate>
      <div className="form__row">
        <label className="field">
          <span>Your name *</span>
          <input name="name" autoComplete="name" required minLength={2} maxLength={120} />
        </label>
        <label className="field">
          <span>Business name</span>
          <input name="businessName" autoComplete="organization" maxLength={160} />
        </label>
      </div>
      <div className="form__row">
        <label className="field">
          <span>Email address *</span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
        <label className="field">
          <span>Phone number</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
      </div>
      <label className="field">
        <span>What is this about?</span>
        <select name="serviceInterest" defaultValue="">
          <option value="">Select a service or general enquiry</option>
          {SERVICES.map((service) => (
            <option value={service.title} key={service.slug}>
              {service.title}
            </option>
          ))}
          <option value="Something else">Something else</option>
        </select>
      </label>
      <label className="field">
        <span>Your message *</span>
        <textarea
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={5000}
          placeholder="Tell us what you are working on, what is not working, and what you would like to change."
        />
      </label>

      <div className="form__honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="checkbox">
        <input type="checkbox" name="privacyConsent" required />
        <span>
          I have read the <a href="/privacy">privacy notice</a> and understand
          how my enquiry information is handled.
        </span>
      </label>

      {error && (
        <div className="vx-alert vx-alert--danger" role="alert">
          <Icon name="alert" size={17} />
          <div>{error}</div>
        </div>
      )}

      <div className="form__actions">
        <Button className="vx-button vx-button--secondary vx-button--md" type="submit" size="lg" loading={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
          {status !== "sending" && <Icon name="arrow-up-right" size={17} />}
        </Button>
        <p>We usually respond within two business days.</p>
      </div>
    </form>
  );
}
