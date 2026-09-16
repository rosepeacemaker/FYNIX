import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../cart/hook/useCart';

// Helper to normalize attributes from various backend serialization formats
const getNormalizedAttributes = (variant) => {
  if (!variant?.attributes) return {};
  if (typeof variant.attributes === 'string') {
    try {
      return JSON.parse(variant.attributes);
    } catch {
      return {};
    }
  }
  if (typeof variant.attributes === 'object' && !Array.isArray(variant.attributes)) {
    return variant.attributes;
  }
  return {};
};

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();
  const { handleGetProductById } = useProduct();
  const { handleAddItem } = useCart();

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  async function fetchProductDetails() {
    try {
      const data = await handleGetProductById(productId);
      setProduct(data?.product || data);
    } catch (error) {
      console.error("Failed to fetch product details", error);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  // Set initial selected attributes when product loads
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const firstAttrs = getNormalizedAttributes(product.variants[0]);
      setSelectedAttributes(firstAttrs);
    }
  }, [product]);

  // Extract all unique attribute keys and their available values across variants
  const availableAttributes = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return {};
    const attrs = {};
    product.variants.forEach(variant => {
      const vAttrs = getNormalizedAttributes(variant);
      Object.entries(vAttrs).forEach(([key, value]) => {
        if (!key || value === undefined || value === null) return;
        if (!attrs[key]) attrs[key] = new Set();
        attrs[key].add(String(value));
      });
    });
    const result = {};
    Object.keys(attrs).forEach(key => {
      result[key] = Array.from(attrs[key]);
    });
    return result;
  }, [product]);

  // Match the active variant based on selected attributes
  const activeVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    
    // First attempt: exact match across all keys
    const exact = product.variants.find(v => {
      const vAttrs = getNormalizedAttributes(v);
      const vKeys = Object.keys(vAttrs);
      const sKeys = Object.keys(selectedAttributes);
      if (vKeys.length === 0 && sKeys.length === 0) return true;
      const isMatch = sKeys.every(k => String(vAttrs[k]) === String(selectedAttributes[k]));
      return isMatch && vKeys.length === sKeys.length;
    });

    if (exact) return exact;

    // Fallback attempt: best partial match
    return product.variants.find(v => {
      const vAttrs = getNormalizedAttributes(v);
      return Object.keys(selectedAttributes).some(k => String(vAttrs[k]) === String(selectedAttributes[k]));
    }) || product.variants[0];
  }, [product, selectedAttributes]);

  useEffect(() => {
    setSelectedImage(0);
  }, [activeVariant]);

  const handleAttributeChange = (attrName, value) => {
    const newAttrs = { ...selectedAttributes, [attrName]: value };

    // Check if there is an exact variant with this combination
    const exactMatch = product.variants.find(v => {
      const vAttrs = getNormalizedAttributes(v);
      return Object.keys(newAttrs).every(k => String(newAttrs[k]) === String(vAttrs[k])) &&
             Object.keys(vAttrs).every(k => String(newAttrs[k]) === String(vAttrs[k]));
    });

    if (exactMatch) {
      setSelectedAttributes(getNormalizedAttributes(exactMatch));
    } else {
      // Find any variant that has this chosen attribute value
      const fallbackVariant = product.variants.find(v => {
        const vAttrs = getNormalizedAttributes(v);
        return String(vAttrs[attrName]) === String(value);
      });
      if (fallbackVariant) {
        setSelectedAttributes(getNormalizedAttributes(fallbackVariant));
      } else {
        setSelectedAttributes(newAttrs);
      }
    }
  };

  const handleAddToCart = () => {
    const isOutOfStock = activeVariant && activeVariant.stock !== undefined && activeVariant.stock <= 0;
    if (isOutOfStock) {
      triggerToast("Selected variant is currently out of stock");
      return;
    }

    handleAddItem({
      productId: productId,
      variantId: activeVariant?._id
    });
    triggerToast(`Added "${product.title}" to cart`);
  };

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#121212]">
        <p style={{ fontFamily: "'Inter', sans-serif", color: '#FF6B6B' }} className="text-xs uppercase tracking-[0.25em] font-bold animate-pulse">
          Retrieving piece...
        </p>
      </div>
    );
  }

  // Resolve display images (prefer active variant's images, fallback to product images)
  const displayImages = (activeVariant?.image && activeVariant.image.length > 0)
    ? activeVariant.image
    : (product.image && product.image.length > 0 ? product.image : [{ url: '/cart_img.jpg' }]);

  const currentMainImage = typeof displayImages[selectedImage] === 'string'
    ? displayImages[selectedImage]
    : (displayImages[selectedImage]?.url || displayImages[selectedImage]?.secure_url || '/cart_img.jpg');

  // Resolve display price
  const displayPrice = activeVariant?.price?.amount
    ? activeVariant.price
    : product.price;

  const hasVariants = product.variants && product.variants.length > 0;
  const isOutOfStock = activeVariant && activeVariant.stock !== undefined && activeVariant.stock <= 0;

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
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: '#FF6B6B',
          color: '#000',
          padding: '8px 18px',
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
        className="w-full min-h-[calc(100vh-75px)] flex flex-col items-center justify-center py-4 px-4 md:px-8 bg-[#121212] selection:bg-[#FF6B6B]/30"
        style={{ fontFamily: "'Inter', sans-serif", color: '#E2E2E2' }}
      >
        <div className="w-full max-w-3xl">
          {/* Breadcrumb / Back Link */}
          <div className="mb-2.5 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-[11px] transition-colors duration-200 text-[#AAA] hover:text-[#FF6B6B] flex items-center gap-1.5 cursor-pointer font-medium uppercase tracking-wider"
            >
              <span>←</span> Back
            </button>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#FF6B6B]">
              FYNIX Exclusive
            </span>
          </div>

          {/* ── Compact Product Card Container ── */}
          <div className="w-full bg-[#1B1B1B] border border-[#2E2E2E] p-4 md:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col md:flex-row gap-5 lg:gap-6 items-center md:items-stretch">

              {/* ── LEFT: Image Column ── */}
              <div className="w-full md:w-[42%] flex flex-col justify-between">
                {/* Main Image */}
                <div className="relative w-full aspect-[4/5] max-h-[300px] bg-[#141414] border border-[#2A2A2A] overflow-hidden group">
                  <img
                    src={currentMainImage}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = '/cart_img.jpg'; }}
                  />

                  {displayImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#1B1B1B]/80 border border-[#3A3A3A] text-white hover:border-[#FF6B6B]"
                        aria-label="Previous image"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button
                        onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#1B1B1B]/80 border border-[#3A3A3A] text-white hover:border-[#FF6B6B]"
                        aria-label="Next image"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails list */}
                {displayImages.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-0.5 scrollbar-hide">
                    {displayImages.map((img, idx) => {
                      const thumbUrl = typeof img === 'string' ? img : (img?.url || img?.secure_url || '/cart_img.jpg');
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`w-10 h-11 flex-shrink-0 border overflow-hidden transition-all duration-200 ${selectedImage === idx ? 'border-[#FF6B6B] opacity-100 scale-105' : 'border-[#333] opacity-50 hover:opacity-100'}`}
                        >
                          <img
                            src={thumbUrl}
                            alt={`Thumb ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = '/cart_img.jpg'; }}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── RIGHT: Details & Actions Column ── */}
              <div className="w-full md:w-[58%] flex flex-col justify-between gap-3">
                <div>
                  {/* Category / Badge */}
                  <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#FF6B6B] block mb-0.5">
                    Authentic FYNIX
                  </span>

                  {/* Title */}
                  <h1
                    className="text-lg md:text-xl font-bold uppercase tracking-tight leading-snug"
                    style={{ fontFamily: "'Montserrat', sans-serif", color: '#E2E2E2' }}
                  >
                    {product.title}
                  </h1>

                  {/* Price */}
                  <div className="mt-1 flex items-center gap-2.5">
                    <span
                      className="text-base md:text-lg uppercase tracking-[0.15em] font-bold"
                      style={{ color: '#FF6B6B' }}
                    >
                      {displayPrice?.currency || 'USD'} {Number(displayPrice?.amount || (typeof displayPrice === 'number' ? displayPrice : 0)).toLocaleString()}
                    </span>

                    {/* Stock Status Badge */}
                    {activeVariant && activeVariant.stock !== undefined ? (
                      <span className={`text-[8px] uppercase tracking-[0.15em] font-bold px-1.5 py-0.5 border ${activeVariant.stock > 0 ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' : 'border-rose-500/40 text-rose-400 bg-rose-500/10'}`}>
                        {activeVariant.stock > 0 ? `${activeVariant.stock} in stock` : 'Out of stock'}
                      </span>
                    ) : (
                      <span className="text-[8px] uppercase tracking-[0.15em] font-bold px-1.5 py-0.5 border border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                        In Stock
                      </span>
                    )}
                  </div>

                  <div className="h-px w-full my-2 bg-[#2E2E2E]" />

                  {/* Attribute Selectors (Size, Color, etc.) */}
                  {hasVariants && Object.keys(availableAttributes).length > 0 ? (
                    Object.entries(availableAttributes).map(([attrName, values]) => (
                      <div key={attrName} className="mb-2">
                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#AAA] block mb-1">
                          Select {attrName}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {values.map(val => {
                            const isSelected = String(selectedAttributes[attrName]) === String(val);
                            return (
                              <button
                                key={val}
                                onClick={() => handleAttributeChange(attrName, val)}
                                className={`px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] font-bold transition-all duration-200 border cursor-pointer ${isSelected ? 'border-[#FF6B6B] bg-[#FF6B6B] text-black shadow-[0_0_8px_rgba(255,107,107,0.3)]' : 'border-[#383838] bg-[#141414] text-[#C8C6C5] hover:border-[#FF6B6B]'}`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="mb-2">
                      <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#888] block mb-1">
                        Edition / Size
                      </span>
                      <span className="inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] font-bold border border-[#383838] bg-[#141414] text-[#AAA]">
                        Standard Edition (One Size)
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <div className="mt-1">
                    <p className="text-[11px] text-[#A0A0A0] leading-relaxed line-clamp-2">
                      {product.description || 'Exclusive designer piece crafted with high precision and premium tailoring.'}
                    </p>
                  </div>
                </div>

                {/* ── Action Buttons ── */}
                <div className="flex flex-col gap-2 pt-1.5 border-t border-[#2E2E2E]">
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={`py-2.5 px-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-200 text-center ${isOutOfStock ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700' : 'cursor-pointer bg-[#FF6B6B] text-black hover:bg-white shadow-[0_0_10px_rgba(255,107,107,0.25)]'}`}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>

                    <button
                      onClick={() => {
                        if (!isOutOfStock) {
                          handleAddToCart();
                          navigate('/cart');
                        }
                      }}
                      disabled={isOutOfStock}
                      className={`py-2.5 px-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-200 border text-center ${isOutOfStock ? 'border-neutral-800 text-neutral-600 cursor-not-allowed' : 'border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B]/15 cursor-pointer'}`}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Quick Feature Guarantees */}
                  <div className="grid grid-cols-3 text-center text-[8.5px] uppercase tracking-[0.08em] text-[#888] pt-0.5">
                    <div className="border-r border-[#2E2E2E] pr-1">Free Shipping $150+</div>
                    <div className="border-r border-[#2E2E2E] pr-1">14-Day Returns</div>
                    <div>100% Authentic</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;