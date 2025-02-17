import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { app, server } from './socket/socket.js';

import { v2 as cloudinary } from 'cloudinary';
import job from './cron/cron.js';

dotenv.config();
connectDB();
job.start();

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Corrected path

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
    });
}


server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});


// import path from 'path'
// import express from 'express';
// import dotenv from 'dotenv'
// import connectDB from './db/connectDB.js';
// import cookieParser from 'cookie-parser';

// import userRoutes from './routes/userRoutes.js'
// import postRoutes from './routes/postRoutes.js'
// import messageRoutes from './routes/messageRoutes.js'
// import {app, server} from './socket/socket.js'

// import {v2 as cloudinary} from 'cloudinary'
// dotenv.config()

// connectDB()

// const PORT = process.env.PORT||5000;
// const _dirname = path.resolve;

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })

// app.use(express.json({limit:"50mb"}));
// app.use(express.urlencoded({extended:true}));
// app.use(cookieParser())

// app.use('/api/users',userRoutes)
// app.use('/api/posts',postRoutes)
// app.use('/api/messages',messageRoutes)

// if(process.env.NODE_ENV === "production"){
//     app.use(express.static(path.join(__dirname,"/frontend/dist")))

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "frontend","dist", "index.html"))
//     })
// }

// server.listen(PORT, ()=>{
//     console.log(`server started at port ${PORT}`)
// })