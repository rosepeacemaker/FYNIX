import { createProduct, getSellerProduct } from "../services/product.api";
import { setSellerProducts } from "../state/product.slice";
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