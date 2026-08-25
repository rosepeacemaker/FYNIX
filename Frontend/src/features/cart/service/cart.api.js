import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const addItem = async ({ productId, variantId }) => {
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity: 1
    })

    return response.data
}
export const getCart = async () => {
    const response = await cartApiInstance.get("/")
    return response.data
}
export const incrementCartItemApi = async ({ variantId, productId }) => {
    const response = await cartApiInstance.patch(`/quantity/increment/${variantId}/${productId}`)
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