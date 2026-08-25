import { addItem, getCart, incrementCartItemApi } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { addItem as additemToCart, incrementCartItem, setItems } from "../state/cart.slice"
// import { addItem } from "../service/cart.api"


export const useCart = () => {

    const dispatch = useDispatch()

    async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId })

        return data
    }

    async function handleGetCart() {
        const data = await getCart()
        dispatch(setItems(data.cart.items))
    }

    async function handleIncrementCartItem({ productId, variantId }) {
        const data = await incrementCartItemApi({ productId, variantId })
        dispatch(incrementCartItem({ productId, variantId }))
    }

    // async function handleCreateCartOrder() {
    //     const data = await createCartOrder()
    //     return data.order
    // }

    // async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    //     const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
    //     return data.success
    // }

    return {
        handleAddItem,
        handleGetCart,
        handleIncrementCartItem,
        //handleCreateCartOrder, 
        //handleVerifyCartOrder 
    }
}
