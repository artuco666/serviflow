import type { Client, DashboardStats, Job, JobStatus, User } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const TOKEN_KEY = "serviflow_token";

export class ApiError extends Error {}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body && !(options.body instanceof URLSearchParams)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail = `Erro ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      // resposta sem corpo JSON
    }
    throw new ApiError(detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  async register(data: {
    company_name: string;
    owner_name: string;
    email: string;
    password: string;
  }) {
    return request<{ access_token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(email: string, password: string) {
    const body = new URLSearchParams({ username: email, password });
    return request<{ access_token: string }>("/auth/login", {
      method: "POST",
      body,
    });
  },

  me: () => request<User>("/auth/me"),

  listClients: () => request<Client[]>("/clients"),

  createClient: (data: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  }) =>
    request<Client>("/clients", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  listJobs: () => request<Job[]>("/jobs"),

  createJob: (data: {
    client_id: number;
    title: string;
    value: number;
    notes?: string;
  }) =>
    request<Job>("/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateJobStatus: (jobId: number, status: JobStatus) =>
    request<Job>(`/jobs/${jobId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  dashboardSummary: () => request<DashboardStats>("/dashboard/summary"),
};
