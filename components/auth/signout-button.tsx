"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function SignoutButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignout() {
    setMessage("");
    setIsSigningOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setMessage("Couldn't sign out. Please try again.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setMessage("Couldn't sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <button
        className="mw-pill-outline h-11 px-[var(--mw-space-lg)] text-[length:var(--mw-type-link)]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Sign Out
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(12,10,9,0.32)] px-5">
          <div className="w-full max-w-[420px] mw-radius-card border border-[var(--mw-hairline)] bg-white p-6 text-center">
            <h2 className="mw-display-section">
              Sign out?
            </h2>
            <p className="mw-meta mt-[var(--mw-space-sm)]">
              You will need to sign in again to access your chats and academic
              workspace.
            </p>

            {message ? (
              <p className="mt-[var(--mw-space-md)] text-[length:var(--mw-type-link)] text-[var(--mw-ink)]">{message}</p>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                className="mw-pill-outline h-11"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="mw-pill-primary h-11 disabled:opacity-55"
                disabled={isSigningOut}
                onClick={handleSignout}
                type="button"
              >
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
