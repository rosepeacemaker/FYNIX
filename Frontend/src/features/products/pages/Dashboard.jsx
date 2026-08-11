import { useEffect } from "react"
import { useProduct } from '../hooks/useProduct'
import { useSelector } from "react-redux"

const Dashboard = () => {

    const { handleGetSellerProduct } = useProduct()
    const sellerProduct = useSelector((state) => state.product.sellerProducts)
    useEffect(() => {
        handleGetSellerProduct()
    }, [])
    console.log(sellerProduct);

    return (
        <div>
            <h1 className="text-3xl text-white ">Dashboard</h1>
        </div>
    )
}
export default Dashboard