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
                className="min-h-screen selection:bg-[#FF6B6B]/30 transition-colors duration-300"
                style={{ fontFamily: "'Inter', sans-serif", backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
            >
                {/* ── Hero / Header ── */}
                <div className="pt-10 pb-8 text-center flex flex-col items-center px-6">
                    <span className="text-[11px] uppercase tracking-[0.28em] font-bold mb-4" style={{ color: 'var(--accent-primary)' }}>
                        The Collection
                    </span>
                    <h1
                        className="text-3xl lg:text-5xl font-bold leading-tight mb-4 tracking-tight"
                        style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--text-primary)' }}
                    >
                        Redefining Everyday Style
                    </h1>
                    <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Discover the newest from FYNIX — modern silhouettes, expressive details, and effortless style designed for the way you dress today.
                    </p>
                </div>

                {/* ── Product Grid — Full Width ── */}
                {products && products.length > 0 ? (
                    <div className="px-4 sm:px-6 lg:px-8 pb-20">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
                            {products.map(product => {
                                const imageUrl = product.image?.length
                                    ? (typeof product.image[0] === 'string' ? product.image[0] : (product.image[0].url || product.image[0].secure_url))
                                    : '/cart_img.jpg';

                                return (
                                    <div
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        key={product._id}
                                        className="group cursor-pointer flex flex-col p-3 sm:p-4 relative transition-all duration-300 hover:border-[#FF6B6B] hover:shadow-[0_8px_24px_var(--shadow-color)] hover:-translate-y-1"
                                        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
                                    >
                                        {/* Image Container */}
                                        <div className="aspect-[3/4] overflow-hidden mb-3 relative" style={{ backgroundColor: 'var(--bg-surface-elevated)' }}>
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                onError={(e) => { e.currentTarget.src = '/cart_img.jpg' }}
                                            />
                                            {/* Variant count overlay */}
                                            {product.variants && product.variants.length > 0 && (
                                                <div className="absolute bottom-2 left-2">
                                                    <span className="text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5" style={{ backgroundColor: 'var(--accent-primary)', color: '#000' }}>
                                                        {product.variants.length} {product.variants.length === 1 ? 'Variant' : 'Variants'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex flex-col gap-1.5 flex-grow justify-between">
                                            <div>
                                                <h3
                                                    className="text-[13px] font-bold leading-snug transition-colors duration-300 group-hover:text-[#FF6B6B] uppercase tracking-wide line-clamp-2"
                                                    style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--text-primary)' }}
                                                >
                                                    {product.title}
                                                </h3>

                                                <p
                                                    className="text-[11px] line-clamp-1 leading-relaxed mt-0.5 hidden sm:block"
                                                    style={{ color: 'var(--text-muted)' }}
                                                >
                                                    {product.description}
                                                </p>
                                            </div>

                                            <div className="pt-2 border-t flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
                                                <span
                                                    className="text-[12px] uppercase tracking-[0.1em] font-bold"
                                                    style={{ color: 'var(--accent-primary)' }}
                                                >
                                                    {product.price?.currency || 'USD'} {Number(product.price?.amount || 0).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] group-hover:text-[#FF6B6B] transition-colors font-medium hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
                                                    View →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="mx-4 sm:mx-6 py-24 text-center flex flex-col items-center p-12 mb-20" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                        <h2 className="text-2xl mb-4 uppercase tracking-widest font-bold" style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--text-primary)' }}>
                            No pieces available.
                        </h2>
                        <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            We are currently preparing our next collection. Please check back shortly.
                        </p>
                    </div>
                )}

                {/* ── Footer ── */}
                <footer className="border-t py-12 text-center backdrop-blur-md" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
                    <span
                        className="text-[11px] uppercase tracking-[0.35em] font-bold"
                        style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--accent-primary)' }}
                    >
                        Fynix. © {new Date().getFullYear()}
                    </span>
                </footer>
            </div>
        </>
    );
};

export default Home;