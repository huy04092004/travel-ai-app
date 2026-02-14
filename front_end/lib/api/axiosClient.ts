/// api/axiosClient.ts
import axios from "axios";
import { API_URL } from "@/lib/config";

export default axios.create({
  baseURL: `${API_URL}/`,
});
