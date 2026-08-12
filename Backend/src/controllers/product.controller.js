import productModel from "../models/product.model.js"
import { uploadFile } from "../service/storage.service.js"

export async function createProduct(req, res) {

    const { title, description, priceAmount, priceCurrency } = req.body

    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        const result = await uploadFile({
             buffer: file.buffer, 
             fileName: file.originalname, 
            
        
        })  
        return result.url ||  result

    }))


    const product = await productModel.create({
        title,
        description,
        price:{
            amount:priceAmount,
            currency:priceCurrency || "USD"
        },
        images,
        seller: seller._id
    });

    res.status(201).json({
        message: "Products created successfully",
        success: true,
        product
    });
}

export async function getSellerProducts(req, res) {
    const seller = req.user;

    const products = await productModel.find({ seller: seller._id });   

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    });
}