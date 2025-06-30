import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import connectMongoDB from './db/connectMongoDB.js'
import userRoutes from './routes/user.route.js'
import {v2 as cloudinary} from 'cloudinary';
import postRoutes from './routes/post.route.js';
import notificationRoutes from './routes/notification.route.js';
import cors from "cors";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
//middleware
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json({limit:"5mb"}));//to parse req.body
//limit shouldn't be too large to prevent DOS attacks
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));//to parse urlencoded data
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/notifications",notificationRoutes)


app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectMongoDB()
})
//connect