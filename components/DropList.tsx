"use client";

import { useId, useState } from "react";

/** Front end only for now. See README for wiring it to a real list. */
export function DropList({ className = "" }: { className?: string }) {
  const [done, setDone] = useState(false);
  const id = useId();

  return (
    <div className={className}>
      <p className="type-body" id={`${id}-copy`}>
        One message before every drop. Nothing else.
      </p>
      {done ? (
        <p role="status" className="type-body mt-4 border-b border-ink py-2">
          Noted. You&apos;ll hear from us before the next drop.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
          className="mt-4 flex items-end gap-4 border-b border-ink"
        >
          <div className="min-w-0 flex-1">
            <label htmlFor={`${id}-email`} className="type-label">
              Email
            </label>
            <input
              id={`${id}-email`}
              type="email"
              required
              autoComplete="email"
              aria-describedby={`${id}-copy`}
              className="field border-b-0! focus:p-[0.5rem_0]!"
            />
          </div>
          <button type="submit" className="type-label link py-2.5">
            Join
          </button>
        </form>
      )}
    </div>
  );
}
