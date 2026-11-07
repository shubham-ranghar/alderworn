"use client";

import { useId, useState, type FormEvent } from "react";
import { site } from "@/config/site";

/** Emails each signup to the owner through Web3Forms. See README for the access key. */
export async function sendSignup(data: FormData) {
  if (!site.dropListAccessKey) return false;

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: site.dropListAccessKey,
      subject: `New ${site.name} drop list signup`,
      email: data.get("email"),
      botcheck: data.has("botcheck"),
    }),
    signal: AbortSignal.timeout(15000),
  });
  const result = await res.json();
  return result.success === true;
}

export function DropList({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const id = useId();

  async function join(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      setStatus((await sendSignup(new FormData(e.currentTarget))) ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={className}>
      <h2 className="type-label mb-1">The drop list</h2>
      <p className="type-body" id={`${id}-copy`}>
        One message before every drop. Nothing else.
      </p>
      {status === "done" ? (
        <p role="status" className="type-body mt-3 border-b border-ink py-2">
          You&apos;re on the list.
        </p>
      ) : (
        <form onSubmit={join} className="mt-3">
          {/* Honeypot: hidden from people, so only bots tick it. */}
          <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" />
          {/* The placeholder carries the prompt, so the label is for screen readers only. */}
          <label htmlFor={`${id}-email`} className="sr-only">
            Email address
          </label>
          <div className="flex items-center gap-4 border-b border-ink">
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Your email address"
              aria-describedby={`${id}-copy`}
              aria-invalid={status === "error" || undefined}
              aria-errormessage={status === "error" ? `${id}-error` : undefined}
              className="field min-w-0 flex-1 border-b-0! placeholder:text-muted focus:p-[0.5rem_0]!"
            />
            {/* The ::before widens the tap area to 44px+ without moving the underline. */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="type-label link shrink-0 py-2.5 whitespace-nowrap before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-['']"
            >
              {status === "sending" ? "Sending…" : "Join →"}
            </button>
          </div>
          <p aria-live="polite" className="sr-only">
            {status === "sending" ? "Sending…" : ""}
          </p>
          {status === "error" && (
            <p id={`${id}-error`} role="alert" className="type-body mt-2">
              That didn&apos;t go through. Please try again.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
