import dotenv from 'dotenv'
dotenv.config()


if(!process.env.MONGO_URI){
    throw new Error("MongoDB is not defined in environment variables")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variables")
}
if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY is not define in environment variables")
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    NODE_ENV: process.env.NODE_ENV || "development",
}