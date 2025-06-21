import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './db/connectMongoDB.js'
const app = express();
//middleware
dotenv.config();
app.use("/api/auth",authRoutes)
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectMongoDB()
})