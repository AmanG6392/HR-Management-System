import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
});

function getTokens() {
  try {
    return JSON.parse(localStorage.getItem("hrms_tokens") || "null");
  } catch {
    return null;
  }
}

function setTokens(tokens) {
  if (tokens) {
    localStorage.setItem("hrms_tokens", JSON.stringify(tokens));
  } else {
    localStorage.removeItem("hrms_tokens");
  }
}

client.interceptors.request.use((config) => {
  const tokens = getTokens();
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

let refreshPromise = null;

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status === 401 && !original._retry && !original.url?.includes("/auth/login")) {
      original._retry = true;
      const tokens = getTokens();
      if (!tokens?.refresh) {
        setTokens(null);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${API_BASE_URL}/auth/token/refresh/`, { refresh: tokens.refresh })
            .then((res) => {
              const updated = { ...tokens, access: res.data.access };
              setTokens(updated);
              return updated;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }
        const updated = await refreshPromise;
        original.headers.Authorization = `Bearer ${updated.access}`;
        return client(original);
      } catch (refreshError) {
        setTokens(null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { getTokens, setTokens };
export default client;
