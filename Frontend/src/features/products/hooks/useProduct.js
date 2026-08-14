import { createProduct, getSellerProduct, getAllProducts } from "../services/product.api";
import { setSellerProducts, setProducts } from "../state/product.slice";
import { useDispatch } from "react-redux";


export const useProduct = () => {

    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        const data = await createProduct(formData)
        if (data) {
            console.log("product created successfully");
            console.log(data.product)
            return data.product;
        }
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProduct()
          console.log("GET ALL PRODUCTS RESPONSE:", data);
    console.log("PRODUCTS TO REDUX:", data.products);
        dispatch(setSellerProducts(data.products))
      
        return data.products;
    }
    async function handleGetAllProducts() {

        const data = await getAllProducts();
        dispatch(setProducts(data.products));

       
    }
    return {
        handleCreateProduct,
        handleGetAllProducts,
        handleGetSellerProduct
    }

}