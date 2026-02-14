/// API configuration - uses EXPO_PUBLIC_API_URL for Docker/environment override
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.10:3000";

export const API_URL = `${API_BASE_URL}/api`;
export const ITINERARIES_API_URL = `${API_BASE_URL}/api/itineraries`;
