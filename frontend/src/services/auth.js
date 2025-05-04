import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Token ${token}`;
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const login = (username, password) =>
    API.post("/users/login/", { username, password });

export const signup = (username, email, password) =>
    API.post("/users/register/", { username, email, password });

export const logout = () => API.post("/users/logout/");

export const getMe = () => API.get("/users/me/");

export default API;
