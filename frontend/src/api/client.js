// Thin fetch wrapper that attaches the JWT and handles JSON + errors.
const BASE = import.meta.env.VITE_API_URL || ''; // '' => use Vite proxy in dev

function getToken() {
  return localStorage.getItem('cc_token');
}

async function request(path, { method = 'GET', body, form, formData, auth = true } = {}) {
  const headers = {};
  if (auth && getToken()) headers['Authorization'] = `Bearer ${getToken()}`;

  let payload;
  if (formData) {
    // Let the browser set Content-Type (includes multipart boundary)
    payload = formData;
  } else if (form) {
    payload = new URLSearchParams(form).toString();
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  } else if (body !== undefined) {
    payload = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, { method, headers, body: payload });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.detail
      ? (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail))
      : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  // auth
  register: (body) => request('/api/auth/register', { method: 'POST', body, auth: false }),
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', form: { username: email, password }, auth: false }),
  me: () => request('/api/auth/me'),
  verifyEmail: (token) =>
    request(`/api/auth/verify?token=${encodeURIComponent(token)}`, { auth: false }),

  // profile
  getProfile: () => request('/api/profile'),
  updateProfile: (body) => request('/api/profile', { method: 'PUT', body }),

  // chat
  listConversations: () => request('/api/chat/conversations'),
  getConversation: (id) => request(`/api/chat/conversations/${id}`),
  deleteConversation: (id) => request(`/api/chat/conversations/${id}`, { method: 'DELETE' }),
  sendMessage: (body) => request('/api/chat', { method: 'POST', body }),

  // resume
  analyzeResume: (body) => request('/api/resume/analyze', { method: 'POST', body }),
  uploadResume: (file, targetRole) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('target_role', targetRole || '');
    return request('/api/resume/upload', { method: 'POST', formData: fd });
  },
  resumeHistory: () => request('/api/resume/history'),

  // roadmap
  generateRoadmap: (body) => request('/api/roadmap/generate', { method: 'POST', body }),
  roadmapHistory: () => request('/api/roadmap/history'),
};
