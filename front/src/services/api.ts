import axios from "axios";

const api = axios.create({
  baseURL: "http://backend:3333",
});

export default api;
