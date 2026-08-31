import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../cart/hook/useCart';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const navigate = useNavigate();
  const { handleGetProductById } = useProduct();
  const { handleAddItem } = useCart()




  async function fetchProductDetails() {
    try {
      const data = await handleGetProductById(productId);
      // Handle both cases depending on how API is structured
      setProduct(data?.product || data);
    } catch (error) {
      console.error("Failed to fetch product details", error);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedAttributes(product.variants[0].attributes || {});
    }
  }, [product]);

  const activeVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find(v => {
      if (!v.attributes) return false;
      const vKeys = Object.keys(v.attributes);
      const sKeys = Object.keys(selectedAttributes);
      const isMatch = vKeys.every(k => v.attributes[k] === selectedAttributes[k]);
      // If they don't have exactly the same keys, they shouldn't perfectly match, 
      // but we might only care about matching what's available.
      return vKeys.length === sKeys.length && isMatch;
    });
  }, [product, selectedAttributes]);


  console.log({ product, activeVariant })

  const availableAttributes = useMemo(() => {
    if (!product?.variants) return {};
    const attrs = {};
    product.variants.forEach(variant => {
      if (variant.attributes) {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          if (!attrs[key]) attrs[key] = new Set();
          attrs[key].add(value);
        });
      }
    });
    Object.keys(attrs).forEach(key => {
      attrs[key] = Array.from(attrs[key]);
    });
    return attrs;
  }, [product]);

  useEffect(() => {
    setSelectedImage(0);
  }, [activeVariant]);

  const handleAttributeChange = (attrName, value) => {
    const newAttrs = { ...selectedAttributes, [attrName]: value };

    // Find if an exact match exists for this combination
    const exactMatch = product.variants.find(v => {
      const vAttrs = v.attributes || {};
      return Object.keys(newAttrs).every(k => newAttrs[k] === vAttrs[k]) &&
        Object.keys(vAttrs).every(k => newAttrs[k] === vAttrs[k]);
    });

    if (exactMatch) {
      setSelectedAttributes(exactMatch.attributes);
    } else {
      // Find any variant that has this newly selected attribute to fallback nicely
      const fallbackVariant = product.variants.find(v => v.attributes && v.attributes[attrName] === value);
      if (fallbackVariant) {
        setSelectedAttributes(fallbackVariant.attributes);
      } else {
        setSelectedAttributes(newAttrs);
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center selection:bg-[#C9A96E]/30" style={{ backgroundColor: '#fbf9f6' }}>
        <p style={{ fontFamily: "'Inter', sans-serif", color: '#B5ADA3' }} className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse">
          Retrieving piece...
        </p>
      </div>
    );
  }

  console.log(product)

  // Fallbacks
  const displayImages = (activeVariant?.image && activeVariant.image.length > 0)
    ? activeVariant.image
    : (product.image && product.image.length > 0 ? product.image : [{ url: '/snitch_editorial_warm.png' }]);

  const displayPrice = activeVariant?.price?.amount
    ? activeVariant.price
    : product.price;

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen selection:bg-[#FF6B6B]/30 pb-24"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >

        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-12 lg:pt-20">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

            {/* ── LEFT: Image Gallery ── */}
            <div className="w-full lg:w-[70%] flex flex-col-reverse md:flex-row gap-4 lg:gap-6">

              {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
              {displayImages.length > 1 && (
                <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-20 lg:w-24 flex-shrink-0 md:max-h-[calc(100vh-200px)]">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 md:w-full aspect-[4/5] overflow-hidden transition-all duration-300 ${selectedImage === idx ? 'opacity-100 ring-2 ring-[#FF6B6B]' : 'opacity-50 hover:opacity-100'}`}
                      style={{ backgroundColor: '#1B1B1B' }}
                    >
                      <img
                        src={img.url || img} alt={`View ${idx + 1}`} className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/cart_img.jpg' }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="relative w-full aspect-4/5 overflow-hidden group bg-[#1B1B1B] border border-[#2A2A2A]">
                <img
                  src={displayImages[selectedImage]?.url || displayImages[0]?.url || displayImages[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  onError={(e) => { e.currentTarget.src = '/cart_img.jpg' }}
                />
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                      className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border bg-[#1B1B1B]/80 border-[#3A3A3A] text-white hover:border-[#FF6B6B]"
                      aria-label="Previous image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border bg-[#1B1B1B]/80 border-[#3A3A3A] text-white hover:border-[#FF6B6B]"
                      aria-label="Next image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── RIGHT: Product Details ── */}
            <div className="w-full lg:w-[30%] lg:sticky lg:top-24 flex flex-col pt-4 bg-[#2A2A2A]/40 p-6 border border-[#3A3A3A]">

              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-tight mb-4"
                style={{ fontFamily: "'Montserrat', sans-serif", color: '#E2E2E2' }}
              >
                {product.title}
              </h1>

              <div className="mb-6">
                <span
                  className="text-lg uppercase tracking-[0.2em] font-bold"
                  style={{ color: '#FF6B6B' }}
                >
                  {displayPrice?.currency || 'USD'} {displayPrice?.amount?.toLocaleString()}
                </span>
              </div>

              <div className="h-px w-full mb-6 bg-[#3A3A3A]" />

              {/* Options/Variants */}
              {Object.entries(availableAttributes).map(([attrName, values]) => (
                <div key={attrName} className="mb-6">
                  <h3 className="text-[10px] uppercase tracking-[0.24em] font-bold mb-3" style={{ color: '#FF6B6B' }}>
                    {attrName}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {values.map(val => {
                      const isSelected = selectedAttributes[attrName] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleAttributeChange(attrName, val)}
                          className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-bold transition-all duration-300 border ${isSelected ? 'border-[#FF6B6B] bg-[#FF6B6B] text-black' : 'border-[#3A3A3A] bg-[#1B1B1B] text-[#E2E2E2] hover:border-[#FF6B6B]'}`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Stock Information */}
              {activeVariant && activeVariant.stock !== undefined && (
                <div className="mb-6">
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${activeVariant.stock > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {activeVariant.stock > 0 ? `${activeVariant.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-[10px] uppercase tracking-[0.24em] font-bold mb-3" style={{ color: '#FF6B6B' }}>
                  The Details
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#C8C6C5' }}>
                  {product.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 mt-auto">
                <button
                  className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(255,107,107,0.3)] hover:shadow-[0_0_25px_rgba(255,107,107,0.6)]"
                  style={{
                    backgroundColor: '#FF6B6B',
                    color: '#000000',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                  onClick={() => {
                    console.log("ADDING:", {
                      productId,
                      variantId: activeVariant?._id,
                    })

                    handleAddItem({
                      productId: productId,
                      variantId: activeVariant?._id
                    })
                  }}
                >
                  Add to Cart
                </button>

                <button
                  className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-300 border cursor-pointer hover:bg-[#FF6B6B]/10"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: '#FF6B6B',
                    color: '#FF6B6B',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  Buy Now
                </button>
              </div>

              {/* Extra elegant details */}
              <div className="mt-10 space-y-3 text-[10px] uppercase tracking-[0.1em]" style={{ color: '#C8C6C5' }}>
                <div className="flex justify-between border-b pb-3 border-[#3A3A3A]">
                  <span>Shipping</span>
                  <span>Complimentary over USD 150</span>
                </div>
                <div className="flex justify-between border-b pb-3 border-[#3A3A3A]">
                  <span>Returns</span>
                  <span>Within 14 days of delivery</span>
                </div>
                <div className="flex justify-between border-b pb-3 border-[#3A3A3A]">
                  <span>Authenticity</span>
                  <span>100% Guaranteed</span>
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