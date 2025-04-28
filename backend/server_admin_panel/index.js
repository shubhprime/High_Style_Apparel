import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import clientRouter from './routes/clientRoutes.js';
import generalRouter from './routes/generalRoutes.js';
import salesRouter from './routes/salesRoutes.js';
import managementRouter from './routes/managementRoutes.js';
import { initUserModel } from '../models/userDB.js';
import { initializeProductModel } from '../models/productDB.js';
import { initOrderModel } from '../models/orderDB.js';

// CONFIGURATION

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// ROUTES

app.use("/client", clientRouter);
app.use("/general", generalRouter);
app.use("/management", managementRouter);
app.use("/sales", salesRouter);

// MONGOOSE SETUP

const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGODB_URL_USER)
    .then(async () => {
        // Initialize User model
        await initUserModel();
        console.log("User model initialized");

        // Initialize Product model
        await initializeProductModel();  // Ensure Product model is initialized
        console.log("Product model initialized");

        // Initialize Order model
        await initOrderModel();
        console.log("Order model initialized");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    }).catch((error) => {
        console.log(`${error} did not connect`);
    })