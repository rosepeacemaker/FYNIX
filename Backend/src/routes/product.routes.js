import express from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProduct ,getSellerProducts,getAllProducts , getProductDetails, addProductVariant} from "../controllers/product.controller.js";
import { createProductValidator } from "../validators/product.validator.js";
import multer from "multer"; 


const upload = multer({ 
storage: multer.memoryStorage(),
limits: { 
    fileSize: 5 * 1024 * 1024
 } // Limit file size to 5MB
});

const router = express.Router();

/**
 * @routes POST /api/product
 * @description Create a new product
 * @access Private (Seller only)
 */


router.post("/", authenticateSeller,upload.array("image", 7),createProductValidator, createProduct);
 
/**
 * @routes GET api/products/seller
 * @description Get all products of an authentication seller
 * @access Public(Seller only)
 */
 
router.get("/seller", authenticateSeller, getSellerProducts); 
/**
 * @routes GET api/products
 * @description Get all products
 * @access Public
 */
router.get("/", getAllProducts) 

/**
 * @route GET /api/products/detail:id
 * @description Get product detail byID
 * @access public
 */


router.get("/detail/:id", getProductDetails)

/**
 * @route POST /api/products/:productId/variants
 * @description Add a new variants to a product
 * @access Private (Seller only)
 */
router.post("/:productId/variants",authenticateSeller, upload.array('image', 7), addProductVariant)


export default router;




