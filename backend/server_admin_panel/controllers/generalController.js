import { fetchUserById } from "../services/generalServices.js";

export const getUser = async (req, res) => {
    try {
      const { id } = req.params; // Extract user ID from request parameters
      const userData = await fetchUserById(id);
      res.status(200).json({ success: true, userData });
    } catch (error) {
      res.status(500).json({ error });
    }
  };