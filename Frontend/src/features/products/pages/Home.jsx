import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router';



const Home = () => {
    const products = useSelector(state => state.product.products);
    const { handleGetAllProducts } = useProduct();
    const navigate = useNavigate();

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#FF6B6B]/30"
                style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#121212', color: '#E2E2E2' }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">

                    {/* ── Hero / Header ── */}
                    <div className="pt-16 pb-12 text-center flex flex-col items-center">
                        <span className="text-[11px] uppercase tracking-[0.28em] font-bold mb-4" style={{ color: '#FF6B6B' }}>
                            The Collection
                        </span>
                        <h1
                            className="text-3xl lg:text-5xl font-bold leading-tight mb-4 tracking-tight"
                            style={{ fontFamily: "'Montserrat', sans-serif", color: '#E2E2E2' }}
                        >
                            Redefining Everyday Style
                        </h1>
                        <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: '#C8C6C5' }}>
                            Discover the newest from FYNIX — modern silhouettes, expressive details, and effortless style designed for the way you dress today.
                        </p>
                    </div>

                    {/* ── Product Grid ── */}
                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            {products.map(product => {
                                const imageUrl = product.image?.length
                                    ? (typeof product.image[0] === 'string' ? product.image[0] : (product.image[0].url || product.image[0].secure_url))
                                    : '/cart_img.jpg';

                                return (
                                    <div
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        key={product._id}
                                        className="group cursor-pointer flex flex-col bg-[#1B1B1B] border border-[#2E2E2E] p-4 relative transition-all duration-400 hover:border-[#FF6B6B] hover:shadow-[0_10px_30px_rgba(255,107,107,0.15)]"
                                    >
                                        {/* Image Container */}
                                        <div className="aspect-[4/5] overflow-hidden mb-4 bg-[#242424] relative">
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                onError={(e) => { e.currentTarget.src = '/cart_img.jpg' }}
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex flex-col gap-2 flex-grow justify-between">
                                            <div>
                                                <h3
                                                    className="text-base font-bold leading-snug transition-colors duration-300 group-hover:text-[#FF6B6B] uppercase tracking-wide"
                                                    style={{ fontFamily: "'Montserrat', sans-serif", color: '#E2E2E2' }}
                                                >
                                                    {product.title}
                                                </h3>

                                                <p
                                                    className="text-[12px] line-clamp-2 leading-relaxed mt-1"
                                                    style={{ color: '#A0A0A0' }}
                                                >
                                                    {product.description}
                                                </p>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-[#2E2E2E] flex justify-between items-center">
                                                <span
                                                    className="text-[13px] uppercase tracking-[0.15em] font-bold"
                                                    style={{ color: '#FF6B6B' }}
                                                >
                                                    {product.price?.currency || 'USD'} {Number(product.price?.amount || 0).toLocaleString()}
                                                </span>
                                                <span className="text-[11px] text-[#A0A0A0] group-hover:text-[#FF6B6B] transition-colors font-medium">
                                                    View Piece →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center flex flex-col items-center bg-[#1B1B1B] border border-[#2E2E2E] p-12 mb-20">
                            <h2 className="text-2xl mb-4 uppercase tracking-widest font-bold" style={{ fontFamily: "'Montserrat', sans-serif", color: '#E2E2E2' }}>
                                No pieces available.
                            </h2>
                            <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: '#C8C6C5' }}>
                                We are currently preparing our next collection. Please check back shortly.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <footer className="border-t py-12 text-center bg-[#1B1B1B]/80 backdrop-blur-md" style={{ borderColor: '#2A2A2A' }}>
                    <span
                        className="text-[11px] uppercase tracking-[0.35em] font-bold"
                        style={{ fontFamily: "'Montserrat', sans-serif", color: '#FF6B6B' }}
                    >
                        Fynix. © {new Date().getFullYear()}
                    </span>
                </footer>
            </div>
        </>
    );
};

export default Home;