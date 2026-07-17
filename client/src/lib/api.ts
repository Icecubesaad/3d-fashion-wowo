// Thin fetch wrapper for the auth API (Module 1: User Module).
// Auth uses httpOnly cookies set by the server, so credentials: "include"
// is required for the browser to send/receive the session cookie.
const BASE = import.meta.env.VITE_API_BASE ?? "/api";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data as { error?: string })?.error ||
      (Array.isArray((data as { errors?: { msg: string }[] }).errors)
        ? (data as { errors: { msg: string }[] }).errors[0]?.msg
        : null) ||
      "Something went wrong";
    throw new Error(msg);
  }
  return data as T;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarProfiles: unknown[];
  savedOutfits: unknown[];
  orders: string[];
  createdAt: string;
}

export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    request<{ user: AuthUser; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<{ user: AuthUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  me: () => request<{ user: AuthUser }>("/auth/me"),
  forgotPassword: (email: string) =>
    request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    request<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
};
