import { createProduct, getSellerProduct, getAllProducts, getProductById, addProductVariant } from "../services/product.api";
import { setSellerProducts, setProducts } from "../state/product.slice";
import { useDispatch } from "react-redux";


export const useProduct = () => {

    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        const data = await createProduct(formData)
        return data.product;

    }

    async function handleGetSellerProduct() {
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))

        return data.products;
    }

    async function handleGetAllProducts() {

        const data = await getAllProducts();
        dispatch(setProducts(data.products));


    }
    async function handleGetProductById(productId) {
        const data = await getProductById(productId);
        return data.product;

    }
    async function handleAddProductVariant(productId, newProductVariant) {
        const data = await addProductVariant(productId, newProductVariant)
        return data;

    }

    return {
        handleCreateProduct,
        handleGetAllProducts,
        handleGetSellerProduct,
        handleGetProductById,
        handleAddProductVariant
    }

}   