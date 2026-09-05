import { createSlice } from "@reduxjs/toolkit";

const extractIds = (item) => {
    const p = item?.product || item?.productId;
    const v = item?.variant || item?.variantId;
    const productId = typeof p === 'object' ? p?._id : p;
    const variantId = typeof v === 'object' ? v?._id : v;
    return {
        productId: productId ? String(productId) : '',
        variantId: variantId ? String(variantId) : ''
    };
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: null,
        currency: null,
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload?.items || [];
            state.totalPrice = action.payload?.totalPrice ?? null;
            state.currency = action.payload?.currency ?? null;
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        incrementCartItem: (state, action) => {
            const targetP = action.payload?.productId ? String(action.payload.productId) : '';
            const targetV = action.payload?.variantId ? String(action.payload.variantId) : '';
            state.items = state.items.map(item => {
                const { productId, variantId } = extractIds(item);
                const matchProduct = !targetP || productId === targetP;
                const matchVariant = !targetV || variantId === targetV;
                if (matchProduct && matchVariant) {
                    return { ...item, quantity: (item.quantity || 1) + 1 };
                }
                return item;
            });
        },
        decrementCartItem: (state, action) => {
            const targetP = action.payload?.productId ? String(action.payload.productId) : '';
            const targetV = action.payload?.variantId ? String(action.payload.variantId) : '';
            state.items = state.items.map(item => {
                const { productId, variantId } = extractIds(item);
                const matchProduct = !targetP || productId === targetP;
                const matchVariant = !targetV || variantId === targetV;
                if (matchProduct && matchVariant) {
                    return { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) };
                }
                return item;
            });
        },
        removeCartItem: (state, action) => {
            const { productId, variantId } = action.payload;

            state.items = state.items.filter(item => {
                return !(
                    String(item.product) === String(productId) &&
                    String(item.variant) === String(variantId)
                )
            })

        }

    }
})

export const { setCart, addItem, incrementCartItem, decrementCartItem, removeCartItem } = cartSlice.actions
export default cartSlice.reducer
