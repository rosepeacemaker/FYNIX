import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import { useProduct } from "../hooks/useProduct";

/* ─── currency and format helpers ────────────────────── */
const currencySymbol = (code) =>
    ({ USD: '$', EUR: '€', GBP: '£', INR: '₹' }[code] ?? (code + ' '));

const formatPrice = (price, currency) => {
    if (!price) return '—';
    const currencyCode = currency || price.currency || 'USD';
    const sym = currencySymbol(currencyCode);
    const amount = typeof price === 'object' ? price.amount : price;
    return `${sym}${Number(amount ?? 0).toLocaleString()}`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

/* ─── Product Card ─────────────────────────────────────── */
const ProductCard = ({ product, index, onClick }) => {
    const [imgError, setImgError] = useState(false);
    const hasImage = product.image && product.image.length > 0 && !imgError;

    return (
        <div
            onClick={onClick}
            className="group relative flex flex-col bg-neutral-950 border border-neutral-900 hover:border-[#ff6b6b]/40 transition-all duration-300 overflow-hidden cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Image / placeholder */}
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                {hasImage ? (
                    <img
                        src={product.image[0]}
                        alt={product.title}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <svg className="w-8 h-8 text-neutral-800 group-hover:text-neutral-700 transition-colors" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span
                            className="text-[8px] uppercase tracking-[0.2em] text-neutral-750 font-bold"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                            Curated Object
                        </span>
                    </div>
                )}

                {/* Currency badge */}
                <span
                    className="absolute top-2 right-2 text-[8px] font-black tracking-[0.2em] uppercase bg-black/80 text-[#ff6b6b] px-2 py-0.5 backdrop-blur-sm border border-neutral-900"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                    {product.currency || 'USD'}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <h3
                    className="text-white text-[12px] font-bold leading-snug tracking-wider uppercase truncate"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                    {product.title}
                </h3>

                <p
                    className="text-neutral-500 text-[11px] leading-relaxed line-clamp-2 flex-1"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                >
                    {product.description || 'No description provided.'}
                </p>

                <div className="flex items-end justify-between mt-2 pt-3 border-t border-neutral-900">
                    <span
                        className="text-[#ff6b6b] text-[14px] font-black tracking-wide"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                        {formatPrice(product.price, product.currency)}
                    </span>
                    <span
                        className="text-[9px] uppercase tracking-[0.15em] text-neutral-600 font-bold"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                        {timeAgo(product.createdAt)}
                    </span>
                </div>
            </div>

            {/* Hover accent line */}
            <div className="absolute bottom-0 left-0 w-0 h-px bg-[#ff6b6b] group-hover:w-full transition-all duration-500" />
        </div>
    );
};

/* ─── Detail Modal ─────────────────────────────────────── */
const ProductDetailModal = ({ product, onClose, onBuy }) => {
    const [imgError, setImgError] = useState(false);
    const [activeTab, setActiveTab] = useState('specs'); // specs or seller
    const hasImage = product.image && product.image.length > 0 && !imgError;

    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all duration-300">
            {/* Modal Box */}
            <div 
                className="relative bg-neutral-950 border border-neutral-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row focus:outline-none selection:bg-[#ff6b6b]/30 [&::-webkit-scrollbar]:hidden"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-[#ff6b6b] text-xl font-bold cursor-pointer transition-colors"
                    aria-label="Close modal"
                >
                    ×
                </button>

                {/* Left: Product Image */}
                <div className="w-full md:w-1/2 bg-neutral-950 border-r border-neutral-900 flex items-center justify-center aspect-[4/3] md:aspect-auto md:min-h-[450px]">
                    {hasImage ? (
                        <img 
                            src={product.image[0]} 
                            alt={product.title} 
                            onError={() => setImgError(true)}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 py-16">
                            <svg className="w-12 h-12 text-neutral-805" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-700 font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                Curated Object
                            </span>
                        </div>
                    )}
                </div>

                {/* Right: Info Panel */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        {/* Title & Metadata */}
                        <span className="text-[8px] uppercase tracking-[0.25em] font-black text-[#ff6b6b] mb-1 block" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Premium Selection
                        </span>
                        <h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-wider leading-tight mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {product.title}
                        </h2>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl font-black text-[#ff6b6b]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {formatPrice(product.price, product.currency)}
                            </span>
                            <span className="text-[9px] uppercase tracking-[0.15em] text-neutral-600 bg-neutral-900 border border-neutral-900 px-2 py-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {product.currency || 'USD'}
                            </span>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-neutral-900 gap-6 mb-4">
                            <button
                                onClick={() => setActiveTab('specs')}
                                className={`pb-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all cursor-pointer ${activeTab === 'specs' ? 'text-[#ff6b6b] border-b border-[#ff6b6b]' : 'text-neutral-500 hover:text-neutral-300'}`}
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                Details
                            </button>
                            <button
                                onClick={() => setActiveTab('seller')}
                                className={`pb-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all cursor-pointer ${activeTab === 'seller' ? 'text-[#ff6b6b] border-b border-[#ff6b6b]' : 'text-neutral-500 hover:text-neutral-300'}`}
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                Origin
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'specs' ? (
                            <p className="text-neutral-450 text-[12px] leading-relaxed mb-6 whitespace-pre-line" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {product.description || 'No detailed description has been uploaded for this item. Crafted with precision under the premium guidelines of FYNIX.'}
                            </p>
                        ) : (
                            <div className="space-y-3 mb-6 text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                                    <span className="text-neutral-600 uppercase tracking-wider">Seller Reference</span>
                                    <span className="text-neutral-400 font-mono select-all">{product.seller || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                                    <span className="text-neutral-600 uppercase tracking-wider">Release Date</span>
                                    <span className="text-neutral-400">{formatDate(product.createdAt)}</span>
                                </div>
                                <div className="flex justify-between pb-1.5">
                                    <span className="text-neutral-600 uppercase tracking-wider">Item ID</span>
                                    <span className="text-neutral-400 font-mono select-all">{product._id || 'N/A'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Purchase Button */}
                    <button
                        onClick={onBuy}
                        className="w-full bg-[#ff6b6b] hover:bg-white text-black transition-colors duration-300 py-3 text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                        Secure Purchase
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Main Home Component ─────────────────────────────── */
const Home = () => {
    const productsState = useSelector((state) => state.product.products);
    const user = useSelector((state) => state.auth.user);
    const { handleGetAllProducts } = useProduct();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("newest");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    const products = Array.isArray(productsState) ? productsState : [];

    // Filter products
    const filteredProducts = products.filter((p) =>
        (p.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(search.toLowerCase())
    );

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sort === "price-asc") {
            const valA = a.price?.amount ?? 0;
            const valB = b.price?.amount ?? 0;
            return valA - valB;
        }
        if (sort === "price-desc") {
            const valA = a.price?.amount ?? 0;
            const valB = b.price?.amount ?? 0;
            return valB - valA;
        }
        // default newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const handleBuyNow = () => {
        setIsCheckingOut(true);
        // Simulate premium order processing
        setTimeout(() => {
            setIsCheckingOut(false);
            setCheckoutSuccess(true);
        }, 1200);
    };

    const handleCloseCheckoutSuccess = () => {
        setCheckoutSuccess(false);
        setSelectedProduct(null);
    };

    return (
        <>
            {/* Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen w-full bg-black text-white selection:bg-[#ff6b6b]/30 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-6xl mx-auto px-6 lg:px-12 xl:px-20 pb-24">
                    
                    {/* ── Top Bar ── */}
                    <div className="pt-6 pb-4 flex items-center justify-between border-b border-neutral-900">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <span
                                className="text-sm font-black tracking-[0.35em] uppercase text-[#ff6b6b]"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                FYNIX
                            </span>
                        </div>

                        {/* Navigation / User details */}
                        <div className="flex items-center gap-6">
                            <span 
                                className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold hover:text-white transition-colors cursor-pointer"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                Shop
                            </span>
                            
                            {user ? (
                                <div className="flex items-center gap-4">
                                    {user.role === 'seller' ? (
                                        <button
                                            onClick={() => navigate('/seller/dashboard')}
                                            className="px-4 py-2 border border-neutral-800 hover:border-[#ff6b6b] text-white text-[9px] font-black tracking-[0.25em] uppercase transition-colors duration-300 cursor-pointer"
                                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                                        >
                                            Dashboard
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                                                <span className="text-[8px] font-bold text-neutral-400 uppercase">
                                                    {(user.fullname || 'U').substring(0, 2)}
                                                </span>
                                            </div>
                                            <span 
                                                className="text-[9px] uppercase tracking-[0.15em] text-neutral-400 font-semibold"
                                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                                            >
                                                {user.fullname}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link
                                        to="/login"
                                        className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-colors font-bold"
                                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 bg-[#ff6b6b] text-black text-[9px] font-black tracking-[0.25em] uppercase hover:bg-white transition-colors duration-300"
                                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Hero / Welcome Section ── */}
                    <div className="py-16 md:py-24 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-neutral-900">
                        <div className="max-w-xl">
                            <span 
                                className="text-[9px] uppercase tracking-[0.4em] text-[#ff6b6b] font-black"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                Curated Marketplace
                            </span>
                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.15em] leading-none mt-4 text-white"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                FYNIX
                            </h1>
                            <p 
                                className="mt-4 text-neutral-500 text-[12px] md:text-[13px] tracking-wide leading-relaxed"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                High-end design, curated minimalism, and uncompromising quality. Explore our collection of premium objects.
                            </p>
                        </div>
                        <div className="hidden lg:block w-px h-28 bg-neutral-900" />
                        <div className="flex flex-row md:flex-col gap-6 justify-center md:justify-start">
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-600 font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Availability</p>
                                <p className="text-white text-lg font-black tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>24/7 CURATED</p>
                            </div>
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-600 font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Global Shipping</p>
                                <p className="text-white text-lg font-black tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>SECURE & FAST</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Utilities Section (Search & Sort) ── */}
                    <div className="pt-8 pb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="flex items-center gap-3 border-b border-neutral-800 pb-2 flex-1 max-w-md">
                            <svg className="w-3.5 h-3.5 text-neutral-650 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search collection…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 bg-transparent text-white text-[12px] outline-none placeholder:text-neutral-700 font-medium"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="text-neutral-600 hover:text-[#ff6b6b] transition-colors text-sm leading-none"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-3">
                            <span 
                                className="text-[9px] uppercase tracking-[0.2em] text-neutral-600 font-bold"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                Sort By
                            </span>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="bg-transparent border border-neutral-800 text-[10px] text-neutral-400 hover:text-white hover:border-[#ff6b6b] py-1.5 px-3 uppercase tracking-wider outline-none focus:outline-none focus:border-[#ff6b6b] cursor-pointer transition-all rounded-none"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                <option value="newest" className="bg-black text-white">Newest First</option>
                                <option value="price-asc" className="bg-black text-white">Price: Low to High</option>
                                <option value="price-desc" className="bg-black text-white">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Catalog Info / Count ── */}
                    <div className="mb-6 flex items-center justify-between">
                        <span
                            className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-bold"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                            {search
                                ? `${sortedProducts.length} object${sortedProducts.length !== 1 ? 's' : ''} found`
                                : `All objects · ${products.length}`}
                        </span>
                    </div>

                    {/* ── Grid of Products ── */}
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-28 gap-6 border border-dashed border-neutral-900">
                            <div className="w-14 h-14 border border-neutral-900 flex items-center justify-center">
                                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p
                                    className="text-neutral-500 text-[12px] font-bold uppercase tracking-[0.2em]"
                                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                                >
                                    Collection Empty
                                </p>
                                <p
                                    className="text-neutral-700 text-[10px] mt-1"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    Check back soon for new arrivals
                                </p>
                            </div>
                        </div>
                    ) : sortedProducts.length === 0 ? (
                        <div className="flex flex-col items-center py-20 gap-3 border border-neutral-950">
                            <p
                                className="text-neutral-600 text-[11px] uppercase tracking-[0.2em] font-bold"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                No matches found
                            </p>
                            <button
                                onClick={() => setSearch("")}
                                className="text-[#ff6b6b] text-[10px] uppercase tracking-wider font-bold underline underline-offset-4"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedProducts.map((product, i) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    index={i}
                                    onClick={() => setSelectedProduct(product)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Product Details Modal ── */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onBuy={handleBuyNow}
                />
            )}

            {/* ── Simulated Checkout Overlay ── */}
            {isCheckingOut && (
                <div className="fixed inset-0 z-55 bg-black/95 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-2 border-neutral-800 border-t-[#ff6b6b] rounded-full animate-spin" />
                    <span 
                        className="text-[9px] uppercase tracking-[0.3em] font-bold text-neutral-400"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                        Securing Transaction…
                    </span>
                </div>
            )}

            {/* ── Simulated Success Modal ── */}
            {checkoutSuccess && (
                <div className="fixed inset-0 z-55 bg-black/95 flex items-center justify-center p-4">
                    <div className="bg-neutral-950 border border-neutral-900 max-w-sm w-full p-8 text-center flex flex-col items-center gap-6">
                        <div className="w-14 h-14 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 text-[#ff6b6b] flex items-center justify-center rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        </div>
                        <div>
                            <h3 
                                className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-2"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                Purchase Confirmed
                            </h3>
                            <p 
                                className="text-neutral-500 text-[11px] leading-relaxed"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                Your order for <strong className="text-neutral-300 font-bold">{selectedProduct?.title}</strong> was successfully verified and scheduled.
                            </p>
                        </div>
                        <button
                            onClick={handleCloseCheckoutSuccess}
                            className="w-full bg-[#ff6b6b] hover:bg-white text-black transition-colors duration-300 py-3 text-[9px] font-black uppercase tracking-[0.3em] cursor-pointer"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                            Return to Shop
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;