import { createProduct, getSellerProduct, getAllProducts, getProductById, addProductVariant } from "../services/product.api";
import { setSellerProducts, setProducts, removeProduct, addProduct, updateProduct } from "../state/product.slice";
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

    function handleRemoveProduct(productId) {
        dispatch(removeProduct(productId));
    }

    function handleLocalAddProduct(newProduct) {
        dispatch(addProduct(newProduct));
    }

    function handleLocalUpdateProduct(updatedProduct) {
        dispatch(updateProduct(updatedProduct));
    }

    return {
        handleCreateProduct,
        handleGetAllProducts,
        handleGetSellerProduct,
        handleGetProductById,
        handleAddProductVariant,
        handleRemoveProduct,
        handleLocalAddProduct,
        handleLocalUpdateProduct,
    }

}   