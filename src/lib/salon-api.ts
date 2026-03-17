const SALON_AUTH_URL = 'https://functions.poehali.dev/777e5303-144d-4643-9d37-3051527c2ff9';
const SALON_CABINET_URL = 'https://functions.poehali.dev/bb33a14d-b393-405a-8e17-000edbb97fb6';

export interface SalonUser {
  id: number;
  email: string;
  name: string;
  role: string;
  salon_id: number;
}

export interface SalonInfo {
  id: number;
  name: string;
  status: string;
  tariff?: string;
}

export function getSalonUser(): SalonUser | null {
  const data = localStorage.getItem('salon_user');
  return data ? JSON.parse(data) : null;
}

export function getSalonInfo(): SalonInfo | null {
  const data = localStorage.getItem('salon_info');
  return data ? JSON.parse(data) : null;
}

export function setSalonSession(user: SalonUser, salon: SalonInfo) {
  localStorage.setItem('salon_user', JSON.stringify(user));
  localStorage.setItem('salon_info', JSON.stringify(salon));
}

export function logoutSalon() {
  localStorage.removeItem('salon_user');
  localStorage.removeItem('salon_info');
}

export async function salonAuth(body: Record<string, unknown>) {
  const res = await fetch(SALON_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function salonFetch(section: string, params?: Record<string, string>, options?: RequestInit) {
  const user = getSalonUser();
  if (!user) throw new Error('Not authenticated');

  const searchParams = new URLSearchParams({ section, salon_id: String(user.salon_id), ...params });
  const url = `${SALON_CABINET_URL}?${searchParams}`;

  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  return res.json();
}

export async function salonPost(section: string, body: Record<string, unknown>) {
  const user = getSalonUser();
  if (!user) throw new Error('Not authenticated');

  const res = await fetch(`${SALON_CABINET_URL}?section=${section}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salon_id: user.salon_id, ...body }),
  });
  return res.json();
}

export async function salonPut(section: string, body: Record<string, unknown>) {
  const user = getSalonUser();
  if (!user) throw new Error('Not authenticated');

  const res = await fetch(`${SALON_CABINET_URL}?section=${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salon_id: user.salon_id, ...body }),
  });
  return res.json();
}

export async function salonDelete(section: string, body: Record<string, unknown>) {
  const user = getSalonUser();
  if (!user) throw new Error('Not authenticated');

  const res = await fetch(`${SALON_CABINET_URL}?section=${section}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salon_id: user.salon_id, ...body }),
  });
  return res.json();
}

export default SALON_CABINET_URL;
