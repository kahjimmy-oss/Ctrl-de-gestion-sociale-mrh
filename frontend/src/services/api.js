import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/me', data)
};

export const missionsAPI = {
  getAll: () => api.get('/missions'),
  getById: (id) => api.get(`/missions/${id}`),
  getEmployees: (missionId) => api.get(`/missions/${missionId}/employees`)
};

export const questionsAPI = {
  getBySeance: (seance, categorie) => api.get(`/questions/seance/${seance}`, { params: { categorie } }),
  getVariation: (id) => api.get(`/questions/${id}/variation`),
  answer: (id, data) => api.post(`/questions/${id}/answer`, data)
};

export const submissionsAPI = {
  getAll: () => api.get('/submissions'),
  getByMission: (missionId) => api.get(`/submissions/mission/${missionId}`),
  create: (data) => api.post('/submissions', data),
  upload: (submissionId, formData) => api.post(`/submissions/${submissionId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  submit: (submissionId) => api.post(`/submissions/${submissionId}/submit`)
};

export const evaluationsAPI = {
  getAll: () => api.get('/evaluations'),
  getBySeance: (seance) => api.get(`/evaluations/seance/${seance}`),
  start: (seance) => api.post(`/evaluations/seance/${seance}/start`),
  submit: (seance, reponses) => api.post(`/evaluations/seance/${seance}/submit`, { reponses })
};

export const instructorAPI = {
  getDashboard: () => api.get('/instructor/dashboard'),
  getSubmissions: (params) => api.get('/instructor/submissions', { params }),
  validateSubmission: (id, data) => api.put(`/instructor/submissions/${id}/validate`, data),
  getEvaluations: (params) => api.get('/instructor/evaluations', { params }),
  gradeEvaluation: (id, data) => api.put(`/instructor/evaluations/${id}/grade`, data),
  unlockSeance: (studentId, seance) => api.post(`/instructor/students/${studentId}/unlock-seance`, { seance }),
  getAnalytics: () => api.get('/instructor/analytics')
};

export const progressAPI = {
  getMe: () => api.get('/progress/me')
};

export const employeesAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`)
};

export default api;
