import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const addItem = async ({ productId, variantId }) => {
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity: 1
    })

    console.log(response.data.cart)
    return response.data
}

export const getCart = async () => {
    const response = await cartApiInstance.get("/")
    return response.data
}

export const incrementCartItemApi = async ({ productId, variantId }) => {
    const response = await cartApiInstance.patch(`/quantity/increment/${productId}/${variantId}`)
    return response.data
}
// export const decrementCartItem = async ({ variantId }) => {
//     const response = await cartApiInstance.patch(`/quantity/decrement/${variantId}`)
//     return response.data
// }
// export const removeCartItem = async ({ variantId }) => {
//     const response = await cartApiInstance.delete(`/quantity/delete/${variantId}`)
//     return response.data
// }