const API_URLS = {
  auth: 'https://functions.poehali.dev/d38ac2ec-0783-4820-a830-634807fb2c22',
  dashboard: 'https://functions.poehali.dev/0010e9a3-7f44-423f-acb8-8e0f74a77af8',
  salons: 'https://functions.poehali.dev/ce43779d-d06c-464a-bd6d-4e57e0ebc300',
  leads: 'https://functions.poehali.dev/a579537c-e3a4-4397-8155-dd88bc1a2fd9',
  specialists: 'https://functions.poehali.dev/6c30e659-c8be-4c63-942a-03dac1c456f5',
  access: 'https://functions.poehali.dev/c0272ba8-c8f1-4d74-9845-0b8e1e6e8384',
  analytics: 'https://functions.poehali.dev/829532ec-4f4a-40e8-9efb-d2de1bcf5e95',
  tools: 'https://functions.poehali.dev/71554603-778d-47d8-9cbd-6cea59fd8755',
  content: 'https://functions.poehali.dev/d1f87f5a-f858-49a7-ae65-c2f11fdcdd21',
  settings: 'https://functions.poehali.dev/49c21920-2064-4a7b-bd3a-98a7e14428b2',
};

export async function adminFetch(endpoint: keyof typeof API_URLS, options?: RequestInit) {
  const url = API_URLS[endpoint];
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  return response.json();
}

export async function adminFetchUrl(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  return response.json();
}

export function getAdminUser() {
  const data = localStorage.getItem('admin_user');
  return data ? JSON.parse(data) : null;
}

export function setAdminUser(user: { id: number; email: string; name: string; role: string }) {
  localStorage.setItem('admin_user', JSON.stringify(user));
}

export function logoutAdmin() {
  localStorage.removeItem('admin_user');
}

export function getSalonStatusLabel(status: string): string {
  const map: Record<string, string> = {
    new: 'Новый',
    consultation: 'Консультация',
    connected: 'Подключен',
    training: 'Обучение',
    certified: 'Сертифицирован',
    archive: 'Архив',
  };
  return map[status] || status;
}

export function getSalonStatusColor(status: string): string {
  const map: Record<string, string> = {
    new: 'bg-gray-100 text-gray-700 border-gray-300',
    consultation: 'bg-yellow-50 text-yellow-700 border-yellow-300',
    connected: 'bg-green-50 text-green-700 border-green-300',
    training: 'bg-blue-50 text-blue-700 border-blue-300',
    certified: 'bg-purple-50 text-purple-700 border-purple-300',
    archive: 'bg-red-50 text-red-700 border-red-300',
  };
  return map[status] || 'bg-gray-100 text-gray-700 border-gray-300';
}

export function getLeadStatusLabel(status: string): string {
  const map: Record<string, string> = {
    new: 'Новая',
    in_work: 'В работе',
    consultation: 'Консультация',
    connected: 'Подключен',
  };
  return map[status] || status;
}

export function getLeadStatusColor(status: string): string {
  const map: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700 border-blue-300',
    in_work: 'bg-yellow-50 text-yellow-700 border-yellow-300',
    consultation: 'bg-orange-50 text-orange-700 border-orange-300',
    connected: 'bg-green-50 text-green-700 border-green-300',
  };
  return map[status] || 'bg-gray-100 text-gray-700 border-gray-300';
}

export function getTrainingStatusLabel(status: string): string {
  const map: Record<string, string> = {
    added: 'Добавлен',
    in_progress: 'Обучается',
    completed: 'Завершил',
    certified: 'Сертифицирован',
  };
  return map[status] || status;
}

export function getTrainingStatusColor(status: string): string {
  const map: Record<string, string> = {
    added: 'bg-gray-100 text-gray-700 border-gray-300',
    in_progress: 'bg-blue-50 text-blue-700 border-blue-300',
    completed: 'bg-green-50 text-green-700 border-green-300',
    certified: 'bg-purple-50 text-purple-700 border-purple-300',
  };
  return map[status] || 'bg-gray-100 text-gray-700 border-gray-300';
}

export function getAccessStatusLabel(status: string): string {
  const map: Record<string, string> = {
    issued: 'Выдан',
    activated: 'Активирован',
    expired: 'Истек',
  };
  return map[status] || status;
}

export function getAccessStatusColor(status: string): string {
  const map: Record<string, string> = {
    issued: 'bg-yellow-50 text-yellow-700 border-yellow-300',
    activated: 'bg-green-50 text-green-700 border-green-300',
    expired: 'bg-red-50 text-red-700 border-red-300',
  };
  return map[status] || 'bg-gray-100 text-gray-700 border-gray-300';
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default API_URLS;