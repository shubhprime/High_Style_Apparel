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
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((error) => {
    console.log(`${error} did not connect`);
})