import express from 'express';
import { getSales } from '../../orders/controllers/overallStatController.js';

const salesRouter = express.Router();

router.get("/sales", getSales);

export default salesRouter;