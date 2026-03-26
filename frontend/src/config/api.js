const fallbackBaseUrl = "https://videotube-backend-5fg2.onrender.com";

export const BASE_URL = (process.env.REACT_APP_API_URL || fallbackBaseUrl).replace(/\/+$/, "");
export const API_V1_URL = `${BASE_URL}/api/v1`;
