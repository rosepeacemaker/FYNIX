import { addItem, getCart, incrementCartItemApi, } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { setCart, incrementCartItem, decrementCartItem, removeCartItem } from "../state/cart.slice"


export const useCart = () => {

    const dispatch = useDispatch()

    async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId })
        return data;
        console.log(data)
    }

    async function handleGetCart() {
        const data = await getCart()
        console.log(data)
        dispatch(setCart(data.cart))
    }

    async function handleIncrementCartItem({ productId, variantId }) {
        await incrementCartItemApi({ productId, variantId })
        dispatch(incrementCartItem({ productId, variantId }))
    }
    async function handleDecrementCartItem({ productId, variantId }) {
        await decrementCartItemApi({ productId, variantId })
        dispatch(decrementCartItem({ productId, variantId }))
    }
    async function handleRemoveCartItem({ productId, variantId }) {
        await removeCartItemApi({ productId, variantId })
        dispatch(removeCartItem({ productId, variantId }))
    }

    // async function handleCreateCartOrder() {
    //     const data = await createCartOrder()
    //     return data.order
    // }

    // async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    //     const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
    //     return data.success
    // }

    return { handleAddItem, handleGetCart, handleIncrementCartItem, }

}