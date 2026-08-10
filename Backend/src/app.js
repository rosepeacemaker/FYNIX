import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from "morgan"
// import passport  from 'passport';
import authRouter from './routes/auth.route.js'
import cors from "cors"


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

app.get("/" , (_req,res) => {
res.status(200).json({message: "Server is running"})
})






app.use("/api/auth", authRouter)


export default app;