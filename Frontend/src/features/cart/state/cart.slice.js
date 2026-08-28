import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],

    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items;
            state.totalPrice = action.payload.totalPrice;
            state.currency = action.payload.currency;
        },
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        incrementCartItem: (state, action) => {
            const { variantId, productId } = action.payload;

            state.items = state.items.map((item) => {
                if (item.product._id === productId && item.variant._id === variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                } else {
                    return item
                }
            })

        }

    }
})

export const { setCart, addItem, incrementCartItem } = cartSlice.actions;
export default cartSlice.reducer;
