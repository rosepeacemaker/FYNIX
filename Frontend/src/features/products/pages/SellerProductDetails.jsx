import React, { useEffect, useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useParams, useNavigate } from 'react-router';

// Helper icons
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

// Helper to normalize attributes from various backend serialization formats (Objects, Maps, Arrays, JSON strings)
const getNormalizedAttributes = (variant) => {
  if (!variant) return {};
  let attrs = variant.attributes;
  if (!attrs) return {};

  if (typeof attrs === 'string') {
    try {
      attrs = JSON.parse(attrs);
    } catch {
      return {};
    }
  }

  if (Array.isArray(attrs)) {
    const result = {};
    attrs.forEach(item => {
      if (item && typeof item === 'object') {
        const k = item.key || item.name || item.attribute || item.title || item.type;
        const v = item.value || item.val || item.name;
        if (k && v !== undefined && v !== null) {
          result[String(k)] = String(v);
        }
      }
    });
    return result;
  }

  if (attrs instanceof Map || (typeof attrs === 'object' && typeof attrs.entries === 'function' && !Object.keys(attrs).length)) {
    const result = {};
    try {
      attrs.forEach((value, key) => {
        if (key && value !== undefined && value !== null) {
          result[String(key)] = String(value);
        }
      });
      return result;
    } catch {}
  }

  if (typeof attrs === 'object') {
    const result = {};
    Object.entries(attrs).forEach(([key, value]) => {
      if (key && value !== undefined && value !== null) {
        result[String(key)] = String(value);
      }
    });
    return result;
  }

  return {};
};

const ATTRIBUTE_PRESETS = [
    { label: 'Size', key: 'Size', suggestions: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Free Size'] },
    { label: 'Color', key: 'Color', suggestions: ['Black', 'White', 'Coral', 'Grey', 'Navy', 'Beige', 'Brown', 'Olive', 'Red'] },
    { label: 'Material', key: 'Material', suggestions: ['100% Cotton', 'Linen', 'Silk', 'Denim', 'Leather', 'Wool', 'Polyester'] },
    { label: 'Fit', key: 'Fit', suggestions: ['Slim Fit', 'Regular Fit', 'Oversized', 'Relaxed Fit', 'Boxy'] },
    { label: 'Custom', key: '', suggestions: [] }
];

const SellerProductDetails = () => {
    const [product, setProduct] = useState(null);
    const [localVariants, setLocalVariants] = useState([]);
    const [isAddingVariant, setIsAddingVariant] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate();

    // UI state for dynamic attributes list
    const [attributeInputs, setAttributeInputs] = useState([
        { preset: 'Size', key: 'Size', value: 'M' }
    ]);

    // New variant state
    const [newVariant, setNewVariant] = useState({
        image: [],
        stock: 10,
        priceAmount: ''
    });

    const { productId } = useParams();
    const { handleGetProductById, handleAddProductVariant } = useProduct();

    const triggerToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    async function fetchProductDetails() {
        setLoading(true);
        try {
            const data = await handleGetProductById(productId);
            const prod = data?.product || data;
            setProduct(prod);
            if (prod?.variants) {
                setLocalVariants(prod.variants);
            }
        } catch (error) {
            console.error("Failed to fetch product details", error);
            triggerToast("Failed to fetch product details");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    // Handlers for modifying existing variant stock natively
    const handleStockChange = (index, newStock) => {
        const updatedVariants = [...localVariants];
        updatedVariants[index] = { ...updatedVariants[index], stock: Number(newStock) };
        setLocalVariants(updatedVariants);
    };

    // Attribute input handlers
    const handlePresetSelect = (index, selectedKey) => {
        const updated = [...attributeInputs];
        const presetObj = ATTRIBUTE_PRESETS.find(p => p.key === selectedKey);
        updated[index] = {
            preset: selectedKey,
            key: selectedKey,
            value: presetObj?.suggestions?.[0] || ''
        };
        setAttributeInputs(updated);
    };

    const handleAttributeKeyChange = (index, key) => {
        const updated = [...attributeInputs];
        updated[index].key = key;
        setAttributeInputs(updated);
    };

    const handleAttributeValueChange = (index, value) => {
        const updated = [...attributeInputs];
        updated[index].value = value;
        setAttributeInputs(updated);
    };

    const handleAddAttribute = () => {
        // Find next unused preset if available
        const usedKeys = attributeInputs.map(a => a.key);
        const nextPreset = ATTRIBUTE_PRESETS.find(p => p.key && !usedKeys.includes(p.key)) || ATTRIBUTE_PRESETS[ATTRIBUTE_PRESETS.length - 1];
        setAttributeInputs(prev => [
            ...prev,
            {
                preset: nextPreset.key,
                key: nextPreset.key,
                value: nextPreset.suggestions?.[0] || ''
            }
        ]);
    };

    const handleRemoveAttribute = (index) => {
        if (attributeInputs.length <= 1) return;
        setAttributeInputs(prev => prev.filter((_, i) => i !== index));
    };

    // Image Upload Handlers
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const availableSlots = 7 - newVariant.image.length;
        const filesToAdd = files.slice(0, availableSlots);

        if (files.length > availableSlots) {
            triggerToast(`Maximum 7 images allowed. ${filesToAdd.length} added.`);
        }

        const newImageObjects = filesToAdd.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file)
        }));

        setNewVariant(prev => ({
            ...prev,
            image: [...prev.image, ...newImageObjects]
        }));

        e.target.value = '';
    };

    const handleRemoveImage = (index) => {
        const imageToRemove = newVariant.image[index];
        if (imageToRemove?.previewUrl) {
            URL.revokeObjectURL(imageToRemove.previewUrl);
        }
        setNewVariant(prev => ({
            ...prev,
            image: prev.image.filter((_, i) => i !== index)
        }));
    };

    // Submit New Variant
    const handleAddNewVariant = async () => {
        // Collect attributes dictionary
        const attributesObj = {};
        for (const attr of attributeInputs) {
            const k = attr.key.trim();
            const v = attr.value.trim();
            if (k && v) {
                attributesObj[k] = v;
            }
        }

        if (Object.keys(attributesObj).length === 0) {
            alert("Please provide at least one valid attribute (e.g. Size: M).");
            return;
        }

        const variantToSave = {
            image: newVariant.image,
            stock: Number(newVariant.stock) || 0,
            attributes: attributesObj,
            price: newVariant.priceAmount ? Number(newVariant.priceAmount) : undefined
        };

        setIsSubmitting(true);
        try {
            await handleAddProductVariant(productId, variantToSave);
            triggerToast("Variant created successfully!");
            setIsAddingVariant(false);

            // Clean up preview URLs
            newVariant.image.forEach(img => {
                if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
            });

            // Reset form
            setAttributeInputs([{ preset: 'Size', key: 'Size', value: 'M' }]);
            setNewVariant({ image: [], stock: 10, priceAmount: '' });

            // Refresh full product data from server
            await fetchProductDetails();
        } catch (error) {
            console.error("Failed to add variant", error);
            triggerToast("Failed to save variant. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center text-[#FF6B6B] font-bold text-sm tracking-widest uppercase">
                Loading Product Vault...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-[#E2E2E2] gap-4">
                <p className="text-lg">Product Not Found</p>
                <button
                    onClick={() => navigate('/seller/dashboard')}
                    className="px-6 py-2 bg-[#FF6B6B] text-black text-xs font-bold uppercase tracking-wider"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            {/* Toast */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 9999,
                    backgroundColor: '#FF6B6B',
                    color: '#000',
                    padding: '10px 20px',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    boxShadow: '0 8px 24px rgba(255,107,107,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span>✓</span> {toastMessage}
                </div>
            )}

            <div
                className="min-h-screen bg-[#121212] text-[#E2E2E2] selection:bg-[#FF6B6B]/30 pb-24"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                <div className="w-full max-w-6xl mx-auto px-4 md:px-8">

                    {/* ── Top Bar ── */}
                    <div className="pt-8 pb-4 flex items-center justify-between border-b border-[#2E2E2E]">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/seller/dashboard')}
                                className="text-xs transition-colors duration-200 text-[#AAA] hover:text-[#FF6B6B] flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider"
                                aria-label="Go back to dashboard"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                        <span
                            className="text-xs font-bold tracking-[0.25em] uppercase text-[#FF6B6B]"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            FYNIX SELLER STUDIO
                        </span>
                    </div>

                    <main className="mt-8">

                        {/* ── Base Product Info ── */}
                        <section className="bg-[#1B1B1B] border border-[#2E2E2E] p-6 md:p-8 mb-8 flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-full md:w-1/3 max-w-[280px]">
                                <div className="w-full aspect-[4/5] bg-[#141414] border border-[#2E2E2E] overflow-hidden">
                                    {product.image && product.image.length > 0 ? (
                                        <img
                                            src={typeof product.image[0] === 'string' ? product.image[0] : (product.image[0].url || product.image[0].secure_url)}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.currentTarget.src = '/cart_img.jpg'; }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#777] text-xs">No Image</div>
                                    )}
                                </div>
                                {product.image && product.image.length > 1 && (
                                    <div className="flex gap-2 mt-2 overflow-x-auto">
                                        {product.image.slice(1).map((img, i) => (
                                            <img
                                                key={i}
                                                src={typeof img === 'string' ? img : (img.url || img.secure_url)}
                                                alt={`Thumb ${i}`}
                                                className="w-12 h-14 object-cover bg-[#141414] border border-[#2E2E2E] shrink-0"
                                                onError={(e) => { e.currentTarget.src = '/cart_img.jpg'; }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#FF6B6B] block mb-1">
                                        Base Product Details
                                    </span>
                                    <h1
                                        className="text-2xl md:text-3xl font-bold uppercase tracking-wide leading-tight mb-3"
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                    >
                                        {product.title}
                                    </h1>
                                    <p className="text-[#A0A0A0] text-sm mb-6 leading-relaxed max-w-2xl">
                                        {product.description || 'No description provided.'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 pt-4 border-t border-[#2E2E2E]">
                                    <div>
                                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold block mb-0.5">Base Price</span>
                                        <span className="text-xl font-bold tracking-wide text-[#FF6B6B]">
                                            {product.price?.currency || 'USD'} {Number(product.price?.amount || (typeof product.price === 'number' ? product.price : 0)).toLocaleString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold block mb-0.5">Total Variants</span>
                                        <span className="text-xl font-bold tracking-wide text-[#E2E2E2]">
                                            {localVariants.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── Variants & Inventory Management ── */}
                        <section className="bg-[#1B1B1B] border border-[#2E2E2E] p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-6 border-b border-[#2E2E2E] gap-4">
                                <div>
                                    <h2
                                        className="text-xl uppercase font-bold tracking-wider"
                                        style={{ fontFamily: "'Montserrat', sans-serif", color: '#E2E2E2' }}
                                    >
                                        Variants & Stock Attributes
                                    </h2>
                                    <p className="text-xs text-[#888] mt-0.5">
                                        Manage sizes, colorways, inventory levels, and custom pricing for buyers.
                                    </p>
                                </div>

                                {!isAddingVariant && (
                                    <button
                                        onClick={() => setIsAddingVariant(true)}
                                        className="bg-[#FF6B6B] text-black px-5 py-2.5 uppercase tracking-wider text-xs font-bold hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,107,107,0.3)]"
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                    >
                                        <PlusIcon /> Add New Variant
                                    </button>
                                )}
                            </div>

                            {/* ── Add New Variant Form ── */}
                            {isAddingVariant && (
                                <div className="bg-[#141414] border border-[#3A3A3A] p-6 mb-10 shadow-2xl">
                                    <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#2E2E2E]">
                                        <h3
                                            className="text-base uppercase font-bold tracking-wider text-[#FF6B6B]"
                                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        >
                                            Configure New Variant
                                        </h3>
                                        <button
                                            onClick={() => setIsAddingVariant(false)}
                                            className="text-[#888] hover:text-[#FF6B6B] text-xs uppercase tracking-wider cursor-pointer font-bold"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* LEFT COLUMN: Attributes & Pricing */}
                                        <div className="space-y-6">

                                            {/* Attributes Section */}
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#AAA]">
                                                        Attributes (Size, Color, etc.) *
                                                    </label>
                                                </div>

                                                <div className="space-y-4">
                                                    {attributeInputs.map((attr, index) => {
                                                        const currentPreset = ATTRIBUTE_PRESETS.find(p => p.key === attr.preset) || ATTRIBUTE_PRESETS[ATTRIBUTE_PRESETS.length - 1];

                                                        return (
                                                            <div key={index} className="bg-[#1B1B1B] border border-[#2E2E2E] p-4 relative">
                                                                {attributeInputs.length > 1 && (
                                                                    <button
                                                                        onClick={() => handleRemoveAttribute(index)}
                                                                        className="absolute top-2 right-2 text-[#888] hover:text-[#FF6B6B] p-1 cursor-pointer transition-colors"
                                                                        title="Remove attribute"
                                                                    >
                                                                        <TrashIcon />
                                                                    </button>
                                                                )}

                                                                {/* Preset / Type Selector */}
                                                                <div className="flex flex-wrap gap-2 mb-3">
                                                                    {ATTRIBUTE_PRESETS.map(preset => (
                                                                        <button
                                                                            key={preset.label}
                                                                            type="button"
                                                                            onClick={() => handlePresetSelect(index, preset.key)}
                                                                            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all border ${attr.preset === preset.key ? 'bg-[#FF6B6B] text-black border-[#FF6B6B]' : 'bg-[#141414] text-[#888] border-[#333] hover:border-[#666]'}`}
                                                                        >
                                                                            {preset.label}
                                                                        </button>
                                                                    ))}
                                                                </div>

                                                                {/* Key & Value Inputs */}
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <div>
                                                                        <span className="text-[9px] uppercase tracking-wider text-[#777] block mb-1 font-bold">Attribute Name</span>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="e.g. Size"
                                                                            value={attr.key}
                                                                            onChange={(e) => handleAttributeKeyChange(index, e.target.value)}
                                                                            className="w-full bg-[#141414] border border-[#333] text-white text-xs px-3 py-2 outline-none focus:border-[#FF6B6B]"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[9px] uppercase tracking-wider text-[#777] block mb-1 font-bold">Selected Value</span>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="e.g. M"
                                                                            value={attr.value}
                                                                            onChange={(e) => handleAttributeValueChange(index, e.target.value)}
                                                                            className="w-full bg-[#141414] border border-[#333] text-white text-xs px-3 py-2 outline-none focus:border-[#FF6B6B]"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Quick Suggestion Pills */}
                                                                {currentPreset.suggestions.length > 0 && (
                                                                    <div className="mt-3 pt-2 border-t border-[#262626]">
                                                                        <span className="text-[9px] uppercase tracking-wider text-[#666] block mb-1.5 font-medium">Quick Choices:</span>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {currentPreset.suggestions.map(sug => (
                                                                                <button
                                                                                    key={sug}
                                                                                    type="button"
                                                                                    onClick={() => handleAttributeValueChange(index, sug)}
                                                                                    className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider cursor-pointer border transition-all ${attr.value === sug ? 'border-[#FF6B6B] text-[#FF6B6B] bg-[#FF6B6B]/10' : 'border-[#2E2E2E] bg-[#141414] text-[#AAA] hover:border-[#FF6B6B]'}`}
                                                                                >
                                                                                    {sug}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <button
                                                    onClick={handleAddAttribute}
                                                    type="button"
                                                    className="mt-3 text-xs uppercase tracking-wider text-[#FF6B6B] hover:text-white flex items-center gap-1.5 cursor-pointer font-bold"
                                                >
                                                    <PlusIcon /> Add Another Attribute (e.g. Color)
                                                </button>
                                            </div>

                                            {/* Stock & Optional Price */}
                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div>
                                                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#AAA] mb-1.5">
                                                        Inventory Stock *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={newVariant.stock}
                                                        onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                                                        className="w-full bg-[#1B1B1B] border border-[#333] text-white text-sm px-3 py-2 outline-none focus:border-[#FF6B6B]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#AAA] mb-1.5">
                                                        Variant Price (Optional)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={newVariant.priceAmount}
                                                        onChange={(e) => setNewVariant({ ...newVariant, priceAmount: e.target.value })}
                                                        placeholder={`Default (${product.price?.amount || product.price || 0})`}
                                                        className="w-full bg-[#1B1B1B] border border-[#333] text-white text-sm px-3 py-2 outline-none focus:border-[#FF6B6B] placeholder:text-[#555]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT COLUMN: Variant Images */}
                                        <div className="flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#AAA]">
                                                        Variant Images (Max 7, Optional)
                                                    </label>
                                                    <span className="text-[10px] text-[#888] font-bold">
                                                        {newVariant.image.length}/7
                                                    </span>
                                                </div>

                                                {newVariant.image.length > 0 && (
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                                                        {newVariant.image.map((img, index) => (
                                                            <div key={index} className="relative aspect-[4/5] bg-[#1B1B1B] border border-[#333]">
                                                                <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                                <button
                                                                    onClick={() => handleRemoveImage(index)}
                                                                    type="button"
                                                                    className="absolute top-1 right-1 bg-black/80 p-1 text-[#FF6B6B] hover:bg-black transition-colors cursor-pointer"
                                                                >
                                                                    <TrashIcon />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {newVariant.image.length < 7 && (
                                                    <label className="border border-dashed border-[#333] hover:border-[#FF6B6B] p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#1B1B1B]/50">
                                                        <span className="text-xs uppercase tracking-wider font-bold text-[#AAA] mb-1">
                                                            + Upload Variant Images
                                                        </span>
                                                        <span className="text-[10px] text-[#666]">PNG, JPG, WEBP up to 5MB</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleImageUpload}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>

                                            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-[#2E2E2E]">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAddingVariant(false)}
                                                    className="px-6 py-2.5 text-xs uppercase tracking-wider text-[#888] hover:text-white font-bold cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isSubmitting}
                                                    onClick={handleAddNewVariant}
                                                    className="bg-[#FF6B6B] text-black px-8 py-2.5 uppercase tracking-wider text-xs font-bold hover:bg-white transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(255,107,107,0.3)]"
                                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                                >
                                                    {isSubmitting ? 'Saving Variant...' : 'Save Variant'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Existing Variants List ── */}
                            {localVariants.length === 0 ? (
                                <div className="py-16 text-center flex flex-col items-center bg-[#141414] border border-[#2E2E2E] p-8">
                                    <p className="text-sm font-bold uppercase tracking-wider text-[#AAA] mb-2">
                                        No variants created yet
                                    </p>
                                    <p className="text-xs text-[#666] max-w-sm mb-6">
                                        Add variants (e.g. Size M / Black) so buyers can select their preferred fit and color on the store.
                                    </p>
                                    <button
                                        onClick={() => setIsAddingVariant(true)}
                                        className="bg-[#FF6B6B] text-black px-6 py-2.5 uppercase tracking-wider text-xs font-bold hover:bg-white transition-all cursor-pointer"
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                    >
                                        + Create First Variant
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {localVariants.map((variant, idx) => {
                                        const variantImg = (variant.image && variant.image.length > 0)
                                            ? (typeof variant.image[0] === 'string' ? variant.image[0] : (variant.image[0].url || variant.image[0].secure_url))
                                            : (product.image && product.image.length > 0 ? (typeof product.image[0] === 'string' ? product.image[0] : product.image[0].url) : '/cart_img.jpg');

                                        return (
                                            <div
                                                key={variant._id || idx}
                                                className="bg-[#141414] border border-[#2E2E2E] flex flex-col justify-between relative group hover:border-[#FF6B6B] transition-all"
                                            >
                                                <div className="p-4 flex gap-4 items-start">
                                                    {/* Variant Image */}
                                                    <div className="w-16 h-20 bg-[#1E1E1E] border border-[#333] shrink-0 overflow-hidden">
                                                        <img
                                                            src={variantImg}
                                                            alt="Variant"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.currentTarget.src = '/cart_img.jpg'; }}
                                                        />
                                                    </div>

                                                    {/* Attributes & Price */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                                            {Object.entries(getNormalizedAttributes(variant)).map(([key, val]) => (
                                                                <span
                                                                    key={key}
                                                                    className="bg-[#1E1E1E] border border-[#383838] px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold text-[#E2E2E2]"
                                                                >
                                                                    <span className="text-[#888]">{key}:</span> {val}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="text-xs font-bold text-[#FF6B6B]">
                                                            {variant.price?.amount
                                                                ? `${variant.price.currency || product.price?.currency || 'USD'} ${Number(variant.price.amount).toLocaleString()}`
                                                                : 'Base Product Price'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Stock Row */}
                                                <div className="mt-auto border-t border-[#2E2E2E] bg-[#1B1B1B] flex items-center px-4 py-2.5 justify-between">
                                                    <span className="text-[10px] text-[#888] uppercase tracking-wider font-bold">
                                                        Stock Units
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={variant.stock !== undefined ? variant.stock : 0}
                                                            onChange={(e) => handleStockChange(idx, e.target.value)}
                                                            className="w-16 bg-[#141414] border border-[#333] py-1 px-2 text-right focus:outline-none focus:border-[#FF6B6B] text-xs font-bold text-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </section>

                    </main>
                </div>
            </div>
        </>
    );
};

export default SellerProductDetails;