import { createSlice } from "@reduxjs/toolkit"


const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProducts: [],
        products: []

    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload
        },
        removeProduct: (state, action) => {
            const id = String(action.payload);
            state.products = state.products.filter(p => String(p._id) !== id);
            state.sellerProducts = state.sellerProducts.filter(p => String(p._id) !== id);
        },
        addProduct: (state, action) => {
            const newProduct = {
                _id: action.payload._id || `prod_${Date.now()}`,
                ...action.payload
            };
            state.products.unshift(newProduct);
            state.sellerProducts.unshift(newProduct);
        },
        updateProduct: (state, action) => {
            const updated = action.payload;
            state.products = state.products.map(p => String(p._id) === String(updated._id) ? { ...p, ...updated } : p);
            state.sellerProducts = state.sellerProducts.map(p => String(p._id) === String(updated._id) ? { ...p, ...updated } : p);
        }
    }

})
export const { setSellerProducts, setProducts, removeProduct, addProduct, updateProduct } = productSlice.actions;

export default productSlice.reducer;


