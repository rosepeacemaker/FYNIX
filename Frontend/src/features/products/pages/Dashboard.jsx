import React, { useEffect } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const Dashboard = () => {
    const { handleGetSellerProduct } = useProduct();
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const navigate = useNavigate();

    useEffect(() => {
        handleGetSellerProduct();
    }, []);

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                <div className="w-full max-w-[100rem] mx-auto px-6 lg:px-12 xl:px-16">


                    {/* ── Top Bar ── */}
                    <div className="pt-10 pb-0 flex items-center gap-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-lg transition-colors duration-200 leading-none text-[#C8C6C5] hover:text-[#FF6B6B]"
                            aria-label="Go back"
                        >
                            ←
                        </button>
                        <span
                            className="text-xs font-bold tracking-[0.32em] uppercase"
                            style={{ fontFamily: "'Montserrat', sans-serif", color: '#FF6B6B' }}
                        >
                            FYNIX.
                        </span>
                    </div>

                    {/* ── Page Header ── */}
                    <div className="pt-10 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                        <div>
                            <h1
                                className="text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-tight"
                                style={{ fontFamily: "'Montserrat', sans-serif", color: '#E2E2E2' }}
                            >
                                Your Vault
                            </h1>
                            {/* Coral rule separator */}
                            <div className="mt-4 w-14 h-1 bg-[#FF6B6B]" />
                        </div>

                        <button
                            onClick={() => navigate('/seller/create-product')}
                            className="py-4 px-8 text-[11px] uppercase tracking-[0.3em] font-bold transition-all duration-300 w-full md:w-auto text-center bg-[#FF6B6B] text-black hover:bg-white cursor-pointer shadow-[0_0_15px_rgba(255,107,107,0.3)]"
                            style={{
                                fontFamily: "'Montserrat', sans-serif"
                            }}
                        >
                            New Listing
                        </button>
                    </div>

                    {/* ── Product Grid ── */}
                    {sellerProducts && sellerProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-24">
                            {sellerProducts.map(product => {
                                const imageUrl = product.image && product.image.length > 0
                                    ? (typeof product.image[0] === 'string' ? product.image[0] : (product.image[0].url || product.image[0].secure_url))
                                    : '/cart_img.jpg';

                                return (
                                    <div
                                        onClick={() => { navigate(`/seller/product/${product._id}`) }}
                                        key={product._id}
                                        className="group cursor-pointer flex flex-col bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#3A3A3A] p-4 hover:border-[#FF6B6B] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,107,107,0.15)]"
                                    >
                                        {/* Image Container */}
                                        <div className="aspect-[4/5] overflow-hidden mb-5 bg-[#1B1B1B]">
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
                                                    className="text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-[#FF6B6B] uppercase tracking-wide"
                                                    style={{ fontFamily: "'Montserrat', sans-serif", color: '#E2E2E2' }}
                                                >
                                                    {product.title}
                                                </h3>

                                                <p
                                                    className="text-[12px] line-clamp-2 leading-relaxed mt-1"
                                                    style={{ color: '#C8C6C5' }}
                                                >
                                                    {product.description}
                                                </p>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-[#3A3A3A] flex justify-between items-center">
                                                <span
                                                    className="text-[12px] uppercase tracking-[0.2em] font-bold"
                                                    style={{ color: '#FF6B6B' }}
                                                >
                                                    {product.price?.currency || 'USD'} {product.price?.amount?.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-[#C8C6C5] group-hover:text-[#FF6B6B] transition-colors">Manage →</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center flex flex-col items-center bg-[#2A2A2A]/40 border border-[#3A3A3A] p-12">
                            <span className="text-[11px] uppercase tracking-[0.25em] font-bold mb-4" style={{ color: '#FF6B6B' }}>Empty Vault</span>
                            <p className="max-w-md mx-auto text-base leading-relaxed" style={{ color: '#C8C6C5' }}>
                                You haven't added any curated pieces to your archive yet. Begin by creating a new listing.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;