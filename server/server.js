import express from "express";
import cors from "cors";

import 'dotenv/config';
import cookieParser from "cookie-parser";

import connectDB from "./CONFIG/mongodb.js";
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";
const app = express();
const port = process.env.PORT || 4000 ;
connectDB();

const allowedOrigins = ['http://localhost:5173']
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin : allowedOrigins , credentials:true})); //so we send cookies 
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS);
app.get('/',(req,res) => {res.send("Api Working")});

app.use('/api/auth' ,authRouter);
app.use('/api/user' ,userRouter);


app.listen(port , () => {console.log(`server started on PORT : ${port}`)});

console.log({
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
});