import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './db/connectMongoDB.js'
dotenv.config();
//middleware
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());//to parse req.body
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));//to parse urlencoded data
app.use("/api/auth",authRoutes)


app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectMongoDB()
})