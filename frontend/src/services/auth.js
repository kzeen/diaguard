import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Token ${token}`;
    return config;
});

export const login = (username, password) =>
    API.post("/users/login/", { username, password });

export const signup = (username, email, password) =>
    API.post("/users/register/", { username, email, password });

export const logout = () => API.post("/users/logout/");
