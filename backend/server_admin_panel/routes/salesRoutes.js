import express from 'express';
import { getSales } from '../../orders/controllers/overallStatController.js';

const salesRouter = express.Router();

salesRouter.get("/sales", getSales);

export default salesRouter;