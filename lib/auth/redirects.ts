export function safeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return null;
  }

  return next;
}

export function redirectAfterAuth(next?: string | null) {
  return safeNextPath(next ?? null) ?? "/chat";
}

export function loginUrlWithNext(pathname: string, search = "") {
  return `/login?next=${encodeURIComponent(`${pathname}${search}`)}`;
}
