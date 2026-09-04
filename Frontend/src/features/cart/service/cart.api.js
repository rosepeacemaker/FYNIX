import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})
export const addItem = async ({ productId, variantId }) => {

    console.log("ADD ITEM API:", { productId, variantId })
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity: 1
    })

    return response.data
}

export const getCart = async () => {
    const response = await cartApiInstance.get("/")
    return response.data
}

export const incrementCartItemApi = async ({ productId, variantId }) => {
    const vId = (variantId && variantId !== 'undefined') ? variantId : 'none';
    const response = await cartApiInstance.patch(`/quantity/increment/${productId}/${vId}`);
    return response.data;
}

export const decrementCartItemApi = async ({ productId, variantId }) => {
    const vId = (variantId && variantId !== 'undefined') ? variantId : 'none';
    const response = await cartApiInstance.patch(`/quantity/decrement/${productId}/${vId}`);
    return response.data;
}

export const removeCartItemApi = async ({ productId, variantId }) => {
    const vId = (variantId && variantId !== 'undefined') ? variantId : 'none';
    const endpoints = [
        `/quantity/delete/${productId}/${vId}`,
        `/quantity/delete/${productId}`,
        `/remove/${productId}/${vId}`,
        `/remove/${productId}`,
        `/delete/${productId}/${vId}`,
        `/delete/${productId}`,
        `/item/${productId}/${vId}`,
        `/item/${productId}`
    ];

    let lastError;
    for (const endpoint of endpoints) {
        try {
            console.log("TRYING REMOVE ENDPOINT:", endpoint);
            const response = await cartApiInstance.delete(endpoint);
            return response.data;
        } catch (err) {
            lastError = err;
            if (err?.response && err.response.status !== 404) {
                // If endpoint exists but returned a 400 or 500, break loop and throw
                break;
            }
        }
    }
    throw lastError;
}

