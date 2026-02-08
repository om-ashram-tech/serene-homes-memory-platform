import axios from "axios";

const api = axios.create({
  baseURL: "/.netlify/functions",
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("sereneToken", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("sereneToken");
  }
}

const stored = localStorage.getItem("sereneToken");
if (stored) setAuthToken(stored);

export default api;
