import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from "morgan"
import passport  from 'passport';
import authRouter from './routes/auth.route.js'
import productRouter from './routes/product.routes.js'
import cors from "cors"
import { config } from './config/config.js';
import pkg from 'passport-google-oauth20';



const { Strategy: GoogleStrategy } = pkg;

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

passport.use(
  new  GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);


app.get("/" , (_req,res) => {
res.status(200).json({message: "Server is running"})
})


app.use("/api/auth", authRouter)
app.use("/api/products", productRouter);


export default app;