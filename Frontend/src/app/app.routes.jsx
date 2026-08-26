import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/home";
import ProductDetails from "../features/products/pages/ProductDetails";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import Cart from "../features/cart/pages/Cart";
import AppLayout from "./AppLayout";

export const router = createBrowserRouter([
    // Auth Routes
    {
        path: "/register",
        element: <Register />,
    },

    {
        path: "/login",
        element: <Login />,
    },

    // Cart Route
    // AppLayout se bahar hai because Cart has its own Navbar
    {
        path: "/cart",
        element: (
            <Protected>
                <Cart />
            </Protected>
        ),
    },

    // Main Application Layout
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },

            {
                path: "/product/:productId",
                element: <ProductDetails />,
            },

            // Seller Routes
            {
                path: "/seller",
                children: [
                    {
                        path: "create-product",
                        element: (
                            <Protected role="seller">
                                <CreateProduct />
                            </Protected>
                        ),
                    },
                    {
                        path: "dashboard",
                        element: (
                            <Protected role="seller">
                                <Dashboard />
                            </Protected>
                        ),
                    },
                    {
                        path: "product/:productId",
                        element: <SellerProductDetails />,
                    },
                ],
            },
        ],
    },
]);