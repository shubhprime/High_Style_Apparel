import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL;

export const fetchUserById = async (id) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/user-level/${id}`, {
            withCredentials: true, // Needed if backend uses cookies for auth
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error.message);
        throw new Error(error.response?.data || "Failed to fetch user");
    }
};