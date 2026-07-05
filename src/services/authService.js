import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const loginUser = async (data) => {
  return API.post("/auth/login", data);
};

export const registerCustomer = async (data) => {
  return API.post("/auth/register/customer", data);
};

export const registerVendor = async (data) => {
  return API.post("/auth/register/vendor", data);
};