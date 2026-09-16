import { createSlice } from "@reduxjs/toolkit"


const getTimestamp = (item) => {
    if (!item) return 0;
    if (item.createdAt) return new Date(item.createdAt).getTime();
    if (item.updatedAt) return new Date(item.updatedAt).getTime();
    if (typeof item._id === 'string' && item._id.length === 24) {
        return parseInt(item._id.substring(0, 8), 16) * 1000;
    }
    return 0;
};

const sortNewestFirst = (arr) => {
    if (!Array.isArray(arr)) return [];
    return [...arr].sort((a, b) => getTimestamp(b) - getTimestamp(a));
};

const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProducts: [],
        products: []
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = sortNewestFirst(action.payload);
        },
        setProducts: (state, action) => {
            state.products = sortNewestFirst(action.payload);
        },
        removeProduct: (state, action) => {
            const id = String(action.payload);
            state.products = state.products.filter(p => String(p._id) !== id);
            state.sellerProducts = state.sellerProducts.filter(p => String(p._id) !== id);
        },
        addProduct: (state, action) => {
            const newProduct = {
                _id: action.payload._id || `prod_${Date.now()}`,
                createdAt: action.payload.createdAt || new Date().toISOString(),
                ...action.payload
            };
            state.products = sortNewestFirst([newProduct, ...state.products]);
            state.sellerProducts = sortNewestFirst([newProduct, ...state.sellerProducts]);
        },
        updateProduct: (state, action) => {
            const updated = action.payload;
            state.products = sortNewestFirst(state.products.map(p => String(p._id) === String(updated._id) ? { ...p, ...updated } : p));
            state.sellerProducts = sortNewestFirst(state.sellerProducts.map(p => String(p._id) === String(updated._id) ? { ...p, ...updated } : p));
        }
    }
})
export const { setSellerProducts, setProducts, removeProduct, addProduct, updateProduct } = productSlice.actions;

export default productSlice.reducer;


