import React, { useEffect, useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const Dashboard = () => {
    const { handleGetSellerProduct, handleRemoveProduct, handleLocalAddProduct, handleLocalUpdateProduct } = useProduct();
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const user = useSelector(state => state.auth.user);
    const navigate = useNavigate();

    // Modals & Notifications
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

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
        handleGetSellerProduct();
    }, []);

    // Refresh / Reset products from server
    const handleReset = async () => {
        setIsRefreshing(true);
        try {
            await handleGetSellerProduct();
            triggerToast('Vault synced with server catalog');
        } catch (error) {
            triggerToast('Failed to refresh products');
        } finally {
            setIsRefreshing(false);
        }
    };

    // Handle delete product (Seller only)
    const onRemoveItem = (e, productId, title) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to remove "${title}" from your vault?`)) {
            handleRemoveProduct(productId);
            triggerToast(`Removed "${title}" from vault`);
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
        triggerToast(`Added "${newProd.title}" to your vault`);
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
                className="min-h-screen selection:bg-[#FF6B6B]/30 transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-main)', fontFamily: "'Inter', sans-serif", color: 'var(--text-primary)' }}
            >
                <div className="w-full max-w-[100rem] mx-auto px-6 lg:px-12 xl:px-16">

                    {/* ── Top Bar ── */}
                    <div className="pt-8 pb-0 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/home')}
                                className="text-sm transition-colors duration-200 hover:text-[#FF6B6B] flex items-center gap-2 cursor-pointer font-medium"
                                style={{ color: 'var(--text-muted)' }}
                                aria-label="Go to Home"
                            >
                                <span>←</span> Customer Storefront
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--accent-primary)',
                                display: 'inline-block',
                                boxShadow: '0 0 8px var(--accent-primary)'
                            }} />
                            <span
                                className="text-xs font-bold tracking-[0.2em] uppercase"
                                style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--accent-primary)' }}
                            >
                                Seller Portal {user?.fullname ? `• ${user.fullname}` : ''}
                            </span>
                        </div>
                    </div>

                    {/* ── Page Header & Action Controls ── */}
                    <div className="pt-8 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        <div>
                            <span className="text-[11px] uppercase tracking-[0.25em] font-bold" style={{ color: 'var(--accent-primary)' }}>
                                Inventory Management
                            </span>
                            <h1
                                className="text-3xl lg:text-5xl font-bold uppercase tracking-tight leading-tight mt-1"
                                style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--text-primary)' }}
                            >
                                Your Vault
                            </h1>
                            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                                Manage listed pieces, update pricing, remove outdated inventory, or create new listings.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Reset / Refresh Button */}
                            <button
                                onClick={handleReset}
                                disabled={isRefreshing}
                                className="py-3 px-5 text-[11px] uppercase tracking-[0.15em] font-bold border transition-all cursor-pointer flex items-center gap-2"
                                style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                title="Reset/Reload items from server database"
                            >
                                <span style={{ display: 'inline-block', transform: isRefreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s' }}>
                                    ↺
                                </span>
                                {isRefreshing ? 'Syncing...' : 'Reset / Refresh'}
                            </button>

                            {/* Quick Add Modal Button */}
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="py-3 px-5 text-[11px] uppercase tracking-[0.15em] font-bold border border-[#FF6B6B] bg-transparent text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-black transition-all cursor-pointer"
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                                + Quick Add
                            </button>

                            {/* Full Creator Studio Button */}
                            <button
                                onClick={() => navigate('/seller/create-product')}
                                className="py-3 px-6 text-[11px] uppercase tracking-[0.2em] font-bold bg-[#FF6B6B] text-black hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(255,107,107,0.3)]"
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                                + New Listing Studio
                            </button>
                        </div>
                    </div>

                    {/* ── Status Bar ── */}
                    <div className="py-4 flex justify-between items-center text-xs" style={{ color: 'var(--text-muted)' }}>
                        <div>
                            Showing <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>{sellerProducts?.length || 0}</span> products in your vault
                        </div>
                    </div>

                    {/* ── Product Grid ── */}
                    {sellerProducts && sellerProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                            {sellerProducts.map(product => {
                                const imageUrl = product.image && product.image.length > 0
                                    ? (typeof product.image[0] === 'string' ? product.image[0] : (product.image[0].url || product.image[0].secure_url))
                                    : '/cart_img.jpg';

                                return (
                                    <div
                                        onClick={() => { navigate(`/seller/product/${product._id}`) }}
                                        key={product._id}
                                        className="group cursor-pointer flex flex-col p-4 relative transition-all duration-400 hover:border-[#FF6B6B] hover:shadow-[0_10px_30px_var(--shadow-color)]"
                                        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
                                    >
                                        {/* Floating Action Controls (Edit & Remove) */}
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
                                            {/* Quick Edit Button */}
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
                                                    backgroundColor: 'var(--bg-surface-elevated)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-primary)',
                                                    width: '26px',
                                                    height: '26px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    fontSize: '13px',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.borderColor = '#FF6B6B';
                                                    e.currentTarget.style.color = '#FF6B6B';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                                    e.currentTarget.style.color = 'var(--text-primary)';
                                                }}
                                            >
                                                ✎
                                            </button>

                                            {/* Remove Button */}
                                            <button
                                                onClick={(e) => onRemoveItem(e, product._id, product.title)}
                                                title="Remove from Vault"
                                                style={{
                                                    backgroundColor: 'rgba(255, 107, 107, 0.9)',
                                                    border: 'none',
                                                    color: '#000',
                                                    width: '26px',
                                                    height: '26px',
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

                                        {/* Image Container */}
                                        <div className="aspect-[4/5] overflow-hidden mb-4 relative" style={{ backgroundColor: 'var(--bg-surface-elevated)' }}>
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                onError={(e) => { e.currentTarget.src = '/cart_img.jpg' }}
                                            />
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
                                                Vault Item
                                            </span>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex flex-col gap-2 flex-grow justify-between">
                                            <div>
                                                <h3
                                                    className="text-base font-bold leading-snug transition-colors duration-300 group-hover:text-[#FF6B6B] uppercase tracking-wide"
                                                    style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--text-primary)' }}
                                                >
                                                    {product.title}
                                                </h3>

                                                <p
                                                    className="text-[12px] line-clamp-2 leading-relaxed mt-1"
                                                    style={{ color: 'var(--text-muted)' }}
                                                >
                                                    {product.description}
                                                </p>
                                            </div>

                                            <div className="mt-4 pt-3 border-t flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
                                                <span
                                                    className="text-[13px] uppercase tracking-[0.15em] font-bold"
                                                    style={{ color: 'var(--accent-primary)' }}
                                                >
                                                    {product.price?.currency || 'USD'} {Number(product.price?.amount || 0).toLocaleString()}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/seller/product/${product._id}`);
                                                    }}
                                                    className="py-1 px-2.5 bg-[#FF6B6B]/15 border border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-black text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                                                >
                                                    + Variants ({product.variants?.length || 0}) →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center flex flex-col items-center p-12 mb-24" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                            <span className="text-[11px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color: 'var(--accent-primary)' }}>
                                Empty Vault
                            </span>
                            <h2 className="text-2xl mb-4 uppercase tracking-widest font-bold" style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--text-primary)' }}>
                                No products in your archive yet.
                            </h2>
                            <p className="max-w-md mx-auto text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                                You haven't added any curated pieces to your archive yet. Begin by adding an item or syncing from the database.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="py-3 px-6 text-[11px] uppercase tracking-[0.15em] font-bold bg-[#FF6B6B] text-black hover:bg-white transition-all cursor-pointer"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    + Add First Item
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="py-3 px-6 text-[11px] uppercase tracking-[0.15em] font-bold border transition-all cursor-pointer"
                                    style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                >
                                    ↺ Sync Database
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Quick Add Product Modal ── */}
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
                                    + Add Item To Vault
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
                                        placeholder="https://... or leave empty for default preview"
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
                                        Add To Vault
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Quick Edit Product Modal ── */}
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
                <footer className="border-t py-12 text-center backdrop-blur-md mt-16" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
                    <span
                        className="text-[11px] uppercase tracking-[0.35em] font-bold"
                        style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--accent-primary)' }}
                    >
                        Fynix. Seller Studio © {new Date().getFullYear()}
                    </span>
                </footer>
            </div>
        </>
    );
};

export default Dashboard;