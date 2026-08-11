import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from "morgan"
import passport  from 'passport';
import authRouter from './routes/auth.route.js'
import productRouter from './routes/product.routes.js'
import cors from "cors"
import { config } from './config/config.js';
import { strategy as GoogleStrategy } from "passport-google-oauth20"

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET" ,"POST", "DELETE", "PUT"],
    credentials: true,
}),
);

app.use(passport.initialize());







app.get("/" , (_req,res) => {
res.status(200).json({message: "Server is running"})
})





app.use("/api/auth", authRouter)
app.use("/api/products", productRouter);


export default app;