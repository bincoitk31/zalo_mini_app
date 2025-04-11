import axios from "axios";

const API_URL = import.meta.env.VITE_ENV == 'DEV' ? 'http://localhost:24679/mini_app_api' : import.meta.env.VITE_ENV == 'STAGING' ? "https://api.staging.storecake.io/mini_app_api" : "https://api.storecake.io/mini_app_api"
const SITE_ID = import.meta.env.VITE_SITE_ID;

const apiClient = axios.create({
  baseURL: API_URL, // Replace with your base URL
  timeout: 10000, // Request timeout in milliseconds,
  params: {
    site_id: SITE_ID
  }
});

export const getApi = async (url, config = {}) => {
  try {
    const response = await apiClient.get(url, config);
    return response; // Return the data from the response
  } catch (error) {
    console.error("GET Request Error:", error.message);
    return error; // Throw the error to be handled by the calling code
  }
}

export const postApi = async (url, data, config = {}) => {
  try {
    const response = await apiClient.post(url, data, config);
    return response; // Return the data from the response
  } catch (error) {
    console.error("POST Request Error:", error.message);
    return error; // Throw the error to be handled by the calling code
  }
};

export const getApiAxios = async (url, config = {}) => {
  try {
    const response = await axios.get(url, config);
    return response; // Return the data from the response
  } catch (error) {
    console.error("GET Request Error:", error.message);
    return error; // Throw the error to be handled by the calling code
  }
}

export const postApiAxios = async (url, data, config = {}) => {
  try {
    const response = await axios.post(url, data, config);
    return response; // Return the data from the response
  } catch (error) {
    console.error("POST Request Error:", error.message);
    return error; // Throw the error to be handled by the calling code
  }
};
