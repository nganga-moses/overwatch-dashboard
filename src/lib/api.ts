import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL;

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not authenticated');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function apiFetch(endpoint: string, init?: RequestInit): Promise<Response> {
  const headers = await getAuthHeaders();
  return fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers: { ...headers, ...(init?.headers ?? {}) },
  });
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const resp = await apiFetch(endpoint);
  if (!resp.ok) throw new Error(`GET ${endpoint} failed: ${resp.status}`);
  return resp.json();
}

export async function apiPost<T>(endpoint: string, body?: unknown): Promise<T> {
  const resp = await apiFetch(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`POST ${endpoint} failed: ${resp.status} ${detail}`);
  }
  return resp.json();
}

export async function apiPatch<T>(endpoint: string, body: unknown): Promise<T> {
  const resp = await apiFetch(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`PATCH ${endpoint} failed: ${resp.status}`);
  return resp.json();
}

export async function apiDelete(endpoint: string): Promise<void> {
  const resp = await apiFetch(endpoint, { method: 'DELETE' });
  if (!resp.ok) throw new Error(`DELETE ${endpoint} failed: ${resp.status}`);
}
