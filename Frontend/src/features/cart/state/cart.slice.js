import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: null,

        currency: null,
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items;
            state.totalPrice = action.payload.totalPrice;
            state.currency = action.payload.currency;
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload
            state.items = state.items.map(item => {
                // variant may be a populated object or a raw string ID
                const itemVariantId = typeof item.variant === 'object' ? item.variant?._id : item.variant
                const itemProductId = typeof item.product === 'object' ? item.product?._id : item.product
                if (itemProductId === productId && itemVariantId === variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                }
                return item
            })
        },
        decrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload
            state.items = state.items.map(item => {
                const itemVariantId = typeof item.variant === 'object' ? item.variant?._id : item.variant
                const itemProductId = typeof item.product === 'object' ? item.product?._id : item.product
                if (itemProductId === productId && itemVariantId === variantId) {
                    return { ...item, quantity: item.quantity - 1 }
                }
                return item
            })
        },
        removeCartItem: (state, action) => {
            const { variantId } = action.payload
            state.items = state.items.filter(item => {
                const itemVariantId = typeof item.variant === 'object' ? item.variant?._id : item.variant
                return itemVariantId !== variantId
            })
        }
    }
})

export const { setCart, addItem, incrementCartItem, decrementCartItem, removeCartItem } = cartSlice.actions
export default cartSlice.reducer