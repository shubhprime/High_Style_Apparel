import express from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";

const generalRouter = express.Router();

router.get("/user/:id", getUser);
router.get("/dashboard", getDashboardStats);

export default generalRouter;