import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router';

const Home = () => {
    const products = useSelector(state => state.product.products);
    const user = useSelector(state => state.auth.user);
    const { handleGetAllProducts, handleRemoveProduct, handleLocalAddProduct, handleLocalUpdateProduct } = useProduct();
    const navigate = useNavigate();

    // Seller mode toggle (automatically true if logged in user is seller, or can be toggled for testing)
    const [sellerMode, setSellerMode] = useState(false);
    const isSeller = user?.role === 'seller' || sellerMode;

    // Modals & Notifications
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    // New product form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        currency: 'USD',
        imageUrl: '',
    });

    const triggerToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    useEffect(() => {
        if (user?.role === 'seller') {
            setSellerMode(true);
        }
    }, [user]);

    // Handle delete product (Seller only)
    const onRemoveItem = (e, productId, title) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to remove "${title}" from catalog?`)) {
            handleRemoveProduct(productId);
            triggerToast(`Removed "${title}" from catalog`);
        }
    };

    // Handle Quick Add Submit
    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.priceAmount) {
            alert('Please enter a product title and price.');
            return;
        }

        const newProd = {
            _id: `prod_${Date.now()}`,
            title: formData.title.trim(),
            description: formData.description.trim() || 'Exclusive artisan piece crafted for high fashion.',
            price: {
                amount: Number(formData.priceAmount),
                currency: formData.currency || 'USD'
            },
            image: [formData.imageUrl.trim() || '/cart_img.jpg'],
            variants: [],
            createdAt: new Date().toISOString()
        };

        handleLocalAddProduct(newProd);
        triggerToast(`Added "${newProd.title}" to catalog`);
        setFormData({ title: '', description: '', priceAmount: '', currency: 'USD', imageUrl: '' });
        setShowAddModal(false);
    };

    // Handle Quick Edit Submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingProduct) return;

        handleLocalUpdateProduct(editingProduct);
        triggerToast(`Updated "${editingProduct.title}"`);
        setEditingProduct(null);
    };

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            {/* Toast Notification */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 9999,
                    backgroundColor: '#FF6B6B',
                    color: '#000',
                    padding: '12px 24px',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    boxShadow: '0 8px 24px rgba(255,107,107,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span>✓</span> {toastMessage}
                </div>
            )}

            <div
                className="min-h-screen selection:bg-[#FF6B6B]/30"
                style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#121212', color: '#E2E2E2' }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">

                    {/* ── Seller Action & Status Toolbar ── */}
                    <div style={{
                        marginTop: '20px',
                        padding: '14px 20px',
                        backgroundColor: isSeller ? 'rgba(255, 107, 107, 0.08)' : '#1B1B1B',
                        border: `1px solid ${isSeller ? '#FF6B6B' : '#333'}`,
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: isSeller ? '#FF6B6B' : '#777',
                                display: 'inline-block',
                                boxShadow: isSeller ? '0 0 10px #FF6B6B' : 'none'
                            }} />
                            <span style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 700,
                                fontSize: '11px',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: isSeller ? '#FF6B6B' : '#AAA'
                            }}>
                                {isSeller ? '✦ SELLER MODE (Item Management Active)' : 'BUYER MODE (Catalog View)'}
                            </span>
                            <span style={{ fontSize: '12px', color: '#777' }}>
                                ({products?.length || 0} Total Products)
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {isSeller && (
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    style={{
                                        backgroundColor: '#FF6B6B',
                                        color: '#000',
                                        border: 'none',
                                        padding: '8px 18px',
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: 700,
                                        fontSize: '11px',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    <span>+</span> Add Product
                                </button>
                            )}

                            {isSeller && (
                                <button
                                    onClick={() => navigate('/seller/create-product')}
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: '#E2E2E2',
                                        border: '1px solid #444',
                                        padding: '8px 14px',
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: 600,
                                        fontSize: '11px',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Full Creator Studio →
                                </button>
                            )}

                            {/* Switch mode button for quick testing */}
                            <button
                                onClick={() => setSellerMode(!sellerMode)}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#AAA',
                                    border: '1px dashed #555',
                                    padding: '8px 14px',
                                    fontFamily: "'Montserrat', sans-serif",
                                    fontWeight: 600,
                                    fontSize: '10px',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer'
                                }}
                            >
                                Switch to {isSeller ? 'Buyer View' : 'Seller View'}
                            </button>
                        </div>
                    </div>

                    {/* ── Hero / Header ── */}
                    <div className="pt-14 pb-12 text-center flex flex-col items-center">
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
                                        onClick={() => navigate(isSeller ? `/seller/product/${product._id}` : `/product/${product._id}`)}
                                        key={product._id}
                                        className="group cursor-pointer flex flex-col bg-[#1B1B1B] border border-[#2E2E2E] p-4 relative transition-all duration-400 hover:border-[#FF6B6B] hover:shadow-[0_10px_30px_rgba(255,107,107,0.15)]"
                                    >
                                        {/* Seller Controls Floating Overlays */}
                                        {isSeller && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    right: '12px',
                                                    zIndex: 10,
                                                    display: 'flex',
                                                    gap: '6px'
                                                }}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                {/* Edit Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingProduct({
                                                            ...product,
                                                            price: {
                                                                amount: product.price?.amount || 0,
                                                                currency: product.price?.currency || 'USD'
                                                            }
                                                        });
                                                    }}
                                                    title="Edit Product"
                                                    style={{
                                                        backgroundColor: 'rgba(0,0,0,0.85)',
                                                        border: '1px solid #444',
                                                        color: '#E2E2E2',
                                                        width: '20px',
                                                        height: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF6B6B')}
                                                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#444')}
                                                >
                                                    ✎
                                                </button>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={(e) => onRemoveItem(e, product._id, product.title)}
                                                    title="Remove Product"
                                                    style={{
                                                        backgroundColor: 'rgba(255, 107, 107, 0.9)',
                                                        border: 'none',
                                                        color: '#000',
                                                        width: '20px',
                                                        height: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold',
                                                        transition: 'all 0.2s',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                                                    }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.backgroundColor = '#FF4444';
                                                        e.currentTarget.style.color = '#FFF';
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.9)';
                                                        e.currentTarget.style.color = '#000';
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}

                                        {/* Image Container */}
                                        <div className="aspect-[4/5] overflow-hidden mb-4 bg-[#242424] relative">
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                onError={(e) => { e.currentTarget.src = '/cart_img.jpg' }}
                                            />
                                            {isSeller && (
                                                <span style={{
                                                    position: 'absolute',
                                                    bottom: '8px',
                                                    left: '8px',
                                                    backgroundColor: 'rgba(0,0,0,0.75)',
                                                    color: '#FF6B6B',
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    fontSize: '9px',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.1em',
                                                    padding: '3px 8px',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    Seller Item
                                                </span>
                                            )}
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
                                                    {isSeller ? 'Manage →' : 'View Piece →'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center flex flex-col items-center bg-[#1B1B1B] border border-[#2E2E2E] p-12">
                            <h2 className="text-2xl mb-4 uppercase tracking-widest font-bold" style={{ fontFamily: "'Montserrat', sans-serif", color: '#E2E2E2' }}>
                                No pieces available.
                            </h2>
                            <p className="max-w-md mx-auto text-sm leading-relaxed mb-6" style={{ color: '#C8C6C5' }}>
                                We are currently preparing our next collection.
                            </p>
                            {isSeller && (
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    style={{
                                        backgroundColor: '#FF6B6B',
                                        color: '#000',
                                        border: 'none',
                                        padding: '12px 28px',
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer'
                                    }}
                                >
                                    + Add First Item
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Quick Add Product Modal (Seller) ── */}
                {showAddModal && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(6px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}>
                        <div style={{
                            backgroundColor: '#1E1E1E',
                            border: '1px solid #3E3E3E',
                            maxWidth: '520px',
                            width: '100%',
                            padding: '32px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '18px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E2E2E2', margin: 0 }}>
                                    + Add Item To Catalog
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    style={{ background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}
                                >✕</button>
                            </div>

                            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAA', marginBottom: '6px' }}>
                                        Product Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Noir Tech Bomber"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        style={{ width: '100%', backgroundColor: '#141414', border: '1px solid #383838', color: '#FFF', padding: '10px 14px', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAA', marginBottom: '6px' }}>
                                            Price *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            placeholder="120"
                                            value={formData.priceAmount}
                                            onChange={e => setFormData({ ...formData, priceAmount: e.target.value })}
                                            style={{ width: '100%', backgroundColor: '#141414', border: '1px solid #383838', color: '#FFF', padding: '10px 14px', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAA', marginBottom: '6px' }}>
                                            Currency
                                        </label>
                                        <select
                                            value={formData.currency}
                                            onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                            style={{ width: '100%', backgroundColor: '#141414', border: '1px solid #383838', color: '#FFF', padding: '10px 8px', fontSize: '14px', outline: 'none' }}
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="INR">INR (₹)</option>
                                            <option value="EUR">EUR (€)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAA', marginBottom: '6px' }}>
                                        Image URL
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="https://... or leave empty for sample placeholder"
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        style={{ width: '100%', backgroundColor: '#141414', border: '1px solid #383838', color: '#FFF', padding: '10px 14px', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAA', marginBottom: '6px' }}>
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Artisan silhouette with premium stitching..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        style={{ width: '100%', backgroundColor: '#141414', border: '1px solid #383838', color: '#FFF', padding: '10px 14px', fontSize: '14px', outline: 'none', resize: 'none' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        style={{ backgroundColor: 'transparent', color: '#AAA', border: '1px solid #444', padding: '10px 20px', fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ backgroundColor: '#FF6B6B', color: '#000', border: 'none', padding: '10px 24px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
                                    >
                                        Add To Catalog
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Quick Edit Product Modal (Seller) ── */}
                {editingProduct && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(6px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}>
                        <div style={{
                            backgroundColor: '#1E1E1E',
                            border: '1px solid #3E3E3E',
                            maxWidth: '520px',
                            width: '100%',
                            padding: '32px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '18px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E2E2E2', margin: 0 }}>
                                    ✎ Edit Product
                                </h2>
                                <button
                                    onClick={() => setEditingProduct(null)}
                                    style={{ background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}
                                >✕</button>
                            </div>

                            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAA', marginBottom: '6px' }}>
                                        Product Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingProduct.title || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                                        style={{ width: '100%', backgroundColor: '#141414', border: '1px solid #383838', color: '#FFF', padding: '10px 14px', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAA', marginBottom: '6px' }}>
                                        Price Amount
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={editingProduct.price?.amount ?? ''}
                                        onChange={e => setEditingProduct({
                                            ...editingProduct,
                                            price: { ...editingProduct.price, amount: Number(e.target.value) }
                                        })}
                                        style={{ width: '100%', backgroundColor: '#141414', border: '1px solid #383838', color: '#FFF', padding: '10px 14px', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAA', marginBottom: '6px' }}>
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={editingProduct.description || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                        style={{ width: '100%', backgroundColor: '#141414', border: '1px solid #383838', color: '#FFF', padding: '10px 14px', fontSize: '14px', outline: 'none', resize: 'none' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setEditingProduct(null)}
                                        style={{ backgroundColor: 'transparent', color: '#AAA', border: '1px solid #444', padding: '10px 20px', fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ backgroundColor: '#FF6B6B', color: '#000', border: 'none', padding: '10px 24px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

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