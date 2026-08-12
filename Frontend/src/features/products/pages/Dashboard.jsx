import { useEffect, useState } from "react";
import { useProduct } from '../hooks/useProduct';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

/* ─── tiny helpers ─────────────────────────────────────── */
const currencySymbol = (code) =>
    ({ USD: '$', EUR: '€', GBP: '£', INR: '₹' }[code] ?? (code + ' '));

const formatPrice = (price) => {
    if (!price) return '—';
    const sym = currencySymbol(price.currency);
    return `${sym}${Number(price.amount).toLocaleString()}`;
};

const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

/* ─── Product Card ─────────────────────────────────────── */
const ProductCard = ({ product, index }) => {
    const [imgError, setImgError] = useState(false);
    const hasImage = product.image?.length > 0 && !imgError;

    return (
        <div
            className="group relative flex flex-col bg-neutral-950 border border-neutral-900 hover:border-[#ff6b6b]/40 transition-all duration-300 overflow-hidden"
            style={{ animationDelay: `${index * 60}ms` }}
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
                        <svg className="w-8 h-8 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span
                            className="text-[9px] uppercase tracking-[0.2em] text-neutral-700 font-bold"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                            No image
                        </span>
                    </div>
                )}

                {/* Currency badge */}
                <span
                    className="absolute top-2 right-2 text-[8px] font-black tracking-[0.2em] uppercase bg-black/70 text-[#ff6b6b] px-2 py-1 backdrop-blur-sm"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                    {product.currency}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <h3
                    className="text-white text-[13px] font-bold leading-snug tracking-wide uppercase truncate"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                    title={product.title}
                >
                    {product.title}
                </h3>

                <p
                    className="text-neutral-500 text-[11px] leading-relaxed line-clamp-2 flex-1"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                >
                    {product.description || 'No description provided.'}
                </p>

                <div className="flex items-end justify-between mt-2 pt-3 border-t border-neutral-800">
                    <span
                        className="text-[#ff6b6b] text-[15px] font-black tracking-wide"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                        {formatPrice(product.price)}
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

/* ─── Stat Pill ────────────────────────────────────────── */
const StatPill = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
        <span
            className="text-[9px] uppercase tracking-[0.25em] text-neutral-600 font-bold"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
            {label}
        </span>
        <span
            className="text-white text-[20px] font-black tracking-wide"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
            {value}
        </span>
    </div>
);

/* ─── Empty State ──────────────────────────────────────── */
const EmptyState = ({ onAdd }) => (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="w-16 h-16 border border-neutral-800 flex items-center justify-center">
            <svg className="w-7 h-7 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
            </svg>
        </div>
        <div className="text-center">
            <p
                className="text-neutral-400 text-[13px] font-bold uppercase tracking-[0.2em]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
                No products yet
            </p>
            <p
                className="text-neutral-600 text-[11px] mt-1.5"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                Start by creating your first listing
            </p>
        </div>
        <button
            onClick={onAdd}
            className="mt-2 px-8 py-3 bg-[#ff6b6b] text-black text-[9px] font-black tracking-[0.3em] uppercase hover:bg-white transition-colors duration-300 cursor-pointer"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
            Create Listing
        </button>
    </div>
);

/* ─── Dashboard ────────────────────────────────────────── */
const Dashboard = () => {
    const { handleGetSellerProduct } = useProduct();
    const sellerProducts = useSelector((state) => state.product.sellerProducts);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    useEffect(() => {
        handleGetSellerProduct();
    }, []);

    const products = Array.isArray(sellerProducts) ? sellerProducts : [];

    const filtered = products.filter((p) =>
        (p.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (p.description ?? '').toLowerCase().includes(search.toLowerCase())
    );

    const totalRevenue = products.reduce((acc, p) => acc + (p.price?.amount ?? 0), 0);
    const currencies = [...new Set(products.map((p) => p.currency).filter(Boolean))];

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen w-full bg-black text-white selection:bg-[#ff6b6b]/30 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-6xl mx-auto px-6 lg:px-12 xl:px-20 pb-20">

                    {/* ── Top Bar ── */}
                    <div className="pt-6 pb-0 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span
                                className="text-[10px] font-bold tracking-[0.32em] uppercase text-[#ff6b6b]"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                FYNIX
                            </span>
                            <span className="text-neutral-700 text-xs">·</span>
                            <span
                                className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                Seller
                            </span>
                        </div>
                        <button
                            onClick={() => navigate('/seller/create-product')}
                            className="flex items-center gap-2 px-5 py-2 bg-[#ff6b6b] text-black text-[9px] font-black tracking-[0.25em] uppercase hover:bg-white transition-colors duration-300 cursor-pointer"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            New Listing
                        </button>
                    </div>

                    {/* ── Page Header ── */}
                    <div className="pt-8 pb-0">
                        <h1
                            className="text-3xl lg:text-4xl font-black uppercase tracking-[0.12em] leading-tight"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                            Dashboard
                        </h1>
                        <div className="mt-3 w-12 h-px bg-[#ff6b6b]" />
                    </div>

                    {/* ── Stats Bar ── */}
                    {products.length > 0 && (
                        <div className="mt-8 grid grid-cols-3 gap-px bg-neutral-900 border border-neutral-900">
                            <div className="bg-black p-5">
                                <StatPill label="Total Listings" value={products.length} />
                            </div>
                            <div className="bg-black p-5 border-l border-neutral-900">
                                <StatPill
                                    label="Total Value"
                                    value={`${currencySymbol(currencies[0] ?? 'USD')}${totalRevenue.toLocaleString()}`}
                                />
                            </div>
                            <div className="bg-black p-5 border-l border-neutral-900">
                                <StatPill
                                    label="With Images"
                                    value={products.filter((p) => p.image?.length > 0).length}
                                />
                            </div>
                        </div>
                    )}

                    {/* ── Search ── */}
                    {products.length > 0 && (
                        <div className="mt-8 flex items-center gap-3 border-b border-neutral-800 pb-2">
                            <svg className="w-3.5 h-3.5 text-neutral-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search listings…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 bg-transparent text-white text-[13px] outline-none placeholder:text-neutral-700"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="text-neutral-600 hover:text-[#ff6b6b] transition-colors text-sm leading-none"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    )}

                    {/* ── Section label ── */}
                    {products.length > 0 && (
                        <div className="mt-8 mb-4 flex items-center justify-between">
                            <span
                                className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-bold"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                {search
                                    ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
                                    : `All products · ${products.length}`}
                            </span>
                        </div>
                    )}

                    {/* ── Grid / Empty ── */}
                    {products.length === 0 ? (
                        <EmptyState onAdd={() => navigate('/seller/create-product')} />
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center py-20 gap-3">
                            <p
                                className="text-neutral-600 text-[12px] uppercase tracking-[0.2em] font-bold"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                No matches found
                            </p>
                            <button
                                onClick={() => setSearch('')}
                                className="text-[#ff6b6b] text-[11px] underline underline-offset-2"
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filtered.map((product, i) => (
                                <ProductCard key={product._id} product={product} index={i} />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default Dashboard;