import React from 'react'
import { useParams } from 'react-router'
import { useProduct } from '../hooks/useProduct';
import { useEffect, useState } from 'react';

const ProductDetails = () => {

  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  const { handleGetProductById } = useProduct();

  async function fetchProductDetails() {
    setLoading(true)
    const data = await handleGetProductById(productId)
    setProduct(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProductDetails()
  }, [productId])

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#ff6b6b] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#a78a88] text-sm tracking-widest uppercase">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#ff6b6b] text-6xl mb-4">404</p>
          <p className="text-[#e2e2e2] text-xl">Product not found</p>
          <p className="text-[#a78a88] text-sm mt-2">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const hasImages = product.image && product.image.length > 0
  const images = hasImages ? product.image.slice(0, 7) : []

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="h-screen bg-black text-[#e2e2e2] flex flex-col overflow-hidden">

      {/* ── Header Bar ── */}
      <header className="flex-shrink-0 border-b border-[#1a1a1a] px-4 sm:px-6 py-3 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#ff6b6b]" />
        <span className="text-[#ff6b6b] font-bold tracking-[0.2em] text-sm uppercase">FYNIX</span>
        <span className="text-[#2a2a2a] mx-1">/</span>
        <span className="text-[#a78a88] text-sm truncate">{product.title}</span>
      </header>

      {/* ── Scrollable Page Body ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ══════════════════════════════════════
                LEFT PANEL — Image Gallery
            ══════════════════════════════════════ */}
            <div className="lg:w-[55%] flex-shrink-0">

              {/* Image viewer: vertical thumbnails on the left + main image */}
              <div className="flex gap-3">

                {/* Vertical Thumbnail Strip (left of main image) */}
                {images.length > 1 && (
                  <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide" style={{ maxHeight: '420px' }}>
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === idx
                          ? 'border-[#ff6b6b] shadow-[0_0_12px_rgba(255,107,107,0.5)]'
                          : 'border-[#1f1f1f] hover:border-[#a78a88] opacity-60 hover:opacity-100'
                          }`}
                      >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}


                {/* Main Image */}
                <div className="relative flex-1 rounded-2xl bg-[#0d0d0d] border border-[#1f1f1f] overflow-hidden flex items-center justify-center group"
                  style={{ aspectRatio: '1 / 1', maxHeight: '420px' }}
                >
                  {hasImages ? (
                    <img
                      src={images[selectedImage]}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-[#2a2a2a]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5A.75.75 0 0121 3.75v16.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V3.75A.75.75 0 013.75 3z" />
                      </svg>
                      <span className="text-xs tracking-widest uppercase text-[#3a3a3a]">No image</span>
                    </div>
                  )}

                  {/* Currency badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm border border-[#ff6b6b]/30 text-[#ff6b6b] text-xs font-semibold px-2 py-1 rounded-full">
                    {product.currency}
                  </div>

                  {/* Image counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm border border-[#1f1f1f] text-[#a78a88] text-xs px-2 py-1 rounded-full">
                      {selectedImage + 1} / {images.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Meta Info Cards */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-3">
                  <p className="text-[#a78a88] text-xs uppercase tracking-widest mb-1">Listed</p>
                  <p className="text-[#e0bfbd] text-sm font-medium">{formatDate(product.createdAt)}</p>
                </div>
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-3">
                  <p className="text-[#a78a88] text-xs uppercase tracking-widest mb-1">Product ID</p>
                  <p className="text-[#e0bfbd] text-sm font-medium font-mono truncate">{product._id}</p>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════
                RIGHT PANEL — Product Info
            ══════════════════════════════════════ */}
            <div className="flex-1 flex flex-col gap-5">

              {/* Title */}
              <div>
                <p className="text-[#a78a88] text-xs uppercase tracking-[0.2em] mb-1">Product</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#e2e2e2] leading-tight capitalize">
                  {product.title}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-end gap-2">
                <span className="text-4xl sm:text-5xl font-black text-[#ff6b6b]">
                  {product.price?.amount?.toLocaleString()}
                </span>
                <span className="text-[#a78a88] text-lg mb-1">{product.currency}</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[#ff6b6b]/30 via-[#1f1f1f] to-transparent" />

              {/* Description */}
              <div>
                <p className="text-[#a78a88] text-xs uppercase tracking-[0.2em] mb-2">Description</p>
                <p className="text-[#e0bfbd] text-base leading-relaxed">
                  {product.description || 'No description provided.'}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#1a1a1a]" />

              {/* Seller Info */}
              <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#ff6b6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[#a78a88] text-xs uppercase tracking-widest">Seller</p>
                  <p className="text-[#e0bfbd] text-sm font-mono truncate">{product.seller}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <span className="text-[10px] text-[#ff6b6b] bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 px-2 py-1 rounded-full uppercase tracking-widest">
                    Verified
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Add to Cart */}
                <button
                  id="btn-add-to-cart"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-[#ff6b6b] text-[#ff6b6b] font-semibold text-sm tracking-widest uppercase transition-all duration-300 hover:bg-[#ff6b6b]/10 hover:shadow-[0_0_20px_rgba(255,107,107,0.2)] active:scale-95 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  Add to Cart
                </button>

                {/* Buy Now */}
                <button
                  id="btn-buy-now"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#ff6b6b] text-black font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:bg-[#ff8585] hover:shadow-[0_0_30px_rgba(255,107,107,0.5)] active:scale-95 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🔒', label: 'Secure Payment' },
                  { icon: '↩', label: 'Easy Returns' },
                  { icon: '✦', label: 'Quality Assured' },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex flex-col items-center gap-1.5 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl py-3 px-2"
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <span className="text-[#a78a88] text-[10px] text-center uppercase tracking-wider leading-tight">{badge.label}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProductDetails