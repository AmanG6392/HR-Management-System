import client from "./client";

// ---- Auth / Employees ----
export const authApi = {
  login: (username, password) => client.post("/auth/login/", { username, password }),
  me: () => client.get("/auth/me/"),
  updateMe: (data) => client.patch("/auth/me/", data),
  changePassword: (data) => client.post("/auth/change-password/", data),
};

export const employeesApi = {
  list: (params) => client.get("/auth/employees/", { params }),
  lookup: () => client.get("/auth/employees/lookup/"),
  create: (data) => client.post("/auth/employees/", data),
  get: (id) => client.get(`/auth/employees/${id}/`),
  update: (id, data) => client.patch(`/auth/employees/${id}/`, data),
  remove: (id) => client.delete(`/auth/employees/${id}/`),
};

// ---- Attendance ----
export const attendanceApi = {
  list: (params) => client.get("/attendance/", { params }),
  mark: (data) => client.post("/attendance/mark/", data),
  bulkMark: (data) => client.post("/attendance/bulk-mark/", data),
  summary: (params) => client.get("/attendance/summary/", { params }),
};

// ---- Leaves ----
export const leavesApi = {
  list: (params) => client.get("/leaves/", { params }),
  apply: (data) => client.post("/leaves/", data),
  detail: (id) => client.get(`/leaves/${id}/`),
  cancel: (id) => client.delete(`/leaves/${id}/`),
  review: (id, data) => client.post(`/leaves/${id}/review/`, data),
};

// ---- Holidays ----
export const holidaysApi = {
  list: () => client.get("/holidays/"),
  create: (data) => client.post("/holidays/", data),
  update: (id, data) => client.patch(`/holidays/${id}/`, data),
  remove: (id) => client.delete(`/holidays/${id}/`),
};

// ---- Documents ----
export const documentsApi = {
  list: (params) => client.get("/documents/", { params }),
  create: (data) => client.post("/documents/", data),
  detail: (id) => client.get(`/documents/${id}/`),
  remove: (id) => client.delete(`/documents/${id}/`),
};

// ---- Dashboard ----
export const dashboardApi = {
  admin: () => client.get("/dashboard/admin/"),
  employee: () => client.get("/dashboard/employee/"),
};
