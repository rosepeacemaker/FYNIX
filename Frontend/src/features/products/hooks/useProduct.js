import { createProduct, getSellerProduct } from "../services/product.api";
import { setSellerProducts } from "../state/product.slice";
import { useDispatch } from "react-redux";


export const useProduct = () => {

    const dispatch = useDispatch();

    async function handleCreateProduct(fromData) {
        const data = await createProduct(fromData)
        if (data) {
            console.log("product created successfully");
            return data.products;
        }
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))
        return data.products
    }
    async function handleSellerProduct() {
        const data = await getSellerProduct();
        dispatch(setSellerProducts(data.products));

        return data.products;
    }
    return {
        handleCreateProduct,
        handleSellerProduct,
        handleGetSellerProduct
    }

}