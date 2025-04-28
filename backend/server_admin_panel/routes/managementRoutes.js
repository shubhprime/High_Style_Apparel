import express from 'express';
import { getAdmins } from '../../authentication/controllers/adminController';

const managementRouter = express.Router();

managementRouter.get("/admins", getAdmins);

export default managementRouter;