import axios from "axios"


const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true,

})

export async function createProduct(formData) {
    const response = await productApiInstance.post("/", formData)
    return response.data

}
export async function getSellerProduct() {
    const response = await productApiInstance.get("/seller")

    return response.data
}

export async function getAllProducts() {
    const response = await productApiInstance.get("/")

    return response.data
}
export async function getProductById(productId) {
    const response = await productApiInstance.get(`/detail/${productId}`)
    console.log("data of product by id", response.data);
    return response.data

}
export async function addProductVariant(productId, newProductVariant) {
    const formData = new FormData()

    newProductVariant.image.forEach((image) => {
        formData.append(`image`, image.file)
    })
    formData.append("stock", newProductVariant.stock)
    formData.append("priceAmount", newProductVariant.price)
    formData.append("attributes", JSON.stringify(newProductVariant.attributes))

    const response = await productApiInstance.post(`/${productId}/variants`, formData)
    return response.data

}


