import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart'

const Cart = () => {

    const cartItems = useSelector((state) => state.cart.items)
    const { handleGetCart } = useCart()
    console.log(cartItems)
    useEffect(() => {
        handleGetCart()
    }, [])

    return (
        <div className='text-white'>Cart</div>
    )
}

export default Cart