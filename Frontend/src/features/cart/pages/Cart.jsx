import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart'
import { Link } from 'react-router'
import { useTheme } from '../../../context/ThemeContext'

/* ─── Design tokens (FYNIX Dynamic Palette) ─────────────────────────── */
const CORAL = 'var(--accent-primary)'
const BG = 'var(--bg-main)'
const SURF = 'var(--bg-surface)'
const SURF2 = 'var(--border-color)'
const GRAY = 'var(--text-secondary)'
const TEXT = 'var(--text-primary)'

/* ─── Quantity stepper ────────────────────────────────────────────────────── */
const QuantityStepper = ({ qty, onDecrement, onIncrement }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${SURF2}`, backgroundColor: BG, flexShrink: 0 }}>
    <button
      onClick={onDecrement}
      style={{ padding: '8px 14px', color: TEXT, cursor: 'pointer', background: 'none', border: 'none', fontSize: '18px', lineHeight: 1, transition: 'color 0.3s' }}
      onMouseEnter={e => (e.currentTarget.style.color = CORAL)}
      onMouseLeave={e => (e.currentTarget.style.color = TEXT)}
      aria-label="Decrease quantity"
    >−</button>
    <span style={{ padding: '8px 14px', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', color: TEXT, borderLeft: `1px solid ${SURF2}`, borderRight: `1px solid ${SURF2}`, minWidth: '36px', textAlign: 'center' }}>
      {qty}
    </span>
    <button
      onClick={onIncrement}
      style={{ padding: '8px 14px', color: TEXT, cursor: 'pointer', background: 'none', border: 'none', fontSize: '18px', lineHeight: 1, transition: 'color 0.3s' }}
      onMouseEnter={e => (e.currentTarget.style.color = CORAL)}
      onMouseLeave={e => (e.currentTarget.style.color = TEXT)}
      aria-label="Increase quantity"
    >+</button>
  </div>
)

/* ─── Helper to extract item details ─────────────────────────────────────── */
// After the aggregation pipeline:
//   item.product  → full populated product doc
//   item.product.variants → the single matched variant object (unwound + matched)
//   item.variant  → raw variant ObjectId (string after JSON serialisation)
//   item.quantity → number
const getItemDetails = (item) => {
  if (!item) return { title: 'Untitled', price: 0, currency: 'USD', imageUrl: '/cart_img.jpg', productId: '', variantId: '', cartItemId: '' }

  // product is always a populated object from the aggregation
  const product = (item.product && typeof item.product === 'object') ? item.product : {}

  // variant data lives in product.variants (the pipeline unwinds & matches it)
  const variant = (product.variants && typeof product.variants === 'object' && !Array.isArray(product.variants))
    ? product.variants
    : {}

  const title = product?.title || item?.title || 'Untitled Piece'
  const description = product?.description || item?.description || ''

  // Price: prefer variant price, fall back to stored item price
  const variantPrice = variant?.price          // { amount, currency }
  const itemPrice = item?.price             // { amount, currency } stored at add-time
  const priceSource = variantPrice || itemPrice || product?.price || {}

  const price = typeof priceSource === 'number'
    ? priceSource
    : (priceSource?.amount ?? 0)

  const currency = priceSource?.currency
    || product?.price?.currency
    || item?.currency
    || 'USD'

  // Image resolution: variant images first, then product images
  const getUrl = (img) => {
    if (!img) return null
    if (typeof img === 'string') return img
    if (typeof img === 'object') return img.url || img.secure_url || img.previewUrl || img.preview || null
    return null
  }

  let imageUrl = null
  const imgSources = [
    variant?.images,
    variant?.image,
    product?.images,
    product?.image,
    item?.image,
    item?.images,
  ]

  for (const src of imgSources) {
    if (!src) continue
    if (typeof src === 'string') { imageUrl = src; break }
    if (Array.isArray(src) && src.length > 0) {
      const url = getUrl(src[0])
      if (url) { imageUrl = url; break }
    }
    if (typeof src === 'object' && !Array.isArray(src)) {
      const url = getUrl(src)
      if (url) { imageUrl = url; break }
    }
  }

  if (!imageUrl) imageUrl = '/cart_img.jpg'

  // productId: from populated product object
  const productId = product?._id
    ? String(product._id)
    : (typeof item.product === 'string' ? item.product : '')

  // variantId: item.variant holds the raw ObjectId (string after JSON)
  const variantId = variant?._id
    ? String(variant._id)
    : (typeof item.variant === 'string' ? item.variant
      : (item.variant?._id ? String(item.variant._id) : ''))

  return { title, description, price, currency, imageUrl, product, variant, productId, variantId, cartItemId: item?._id }
}

/* ─── Single cart item card ───────────────────────────────────────────────── */
const CartItemCard = ({ item, onRemove, onDecrement, onIncrement }) => {
  const [hovered, setHovered] = useState(false)
  const { title, description, price, currency, imageUrl, productId, variantId, cartItemId } = getItemDetails(item)
  const qty = item?.quantity || 1

  return (
    <div
      className="fynix-cart-item-card"
      style={{ display: 'flex', flexDirection: 'row', gap: '20px', padding: '20px', backgroundColor: SURF, border: `1px solid ${SURF2}`, position: 'relative', borderBottomColor: hovered ? CORAL : SURF2, transition: 'border-color 0.3s ease', boxSizing: 'border-box' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Coral sweep bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', width: '100%', backgroundColor: CORAL, transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' }} />

      {/* Image */}
      <div className="fynix-cart-item-img" style={{ width: '140px', minWidth: '140px', height: '160px', overflow: 'hidden', backgroundColor: SURF2, flexShrink: 0 }}>
        <img
          src={imageUrl}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' }}
          onError={(e) => { e.currentTarget.src = '/cart_img.jpg' }}
        />
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, minWidth: 0 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '16px', letterSpacing: '0.05em', textTransform: 'uppercase', color: TEXT, margin: 0, wordBreak: 'break-word' }}>
              {title}
            </h3>
            <button
              onClick={() => onRemove({ productId, variantId, cartItemId })}
              aria-label="Remove item"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#777', fontSize: '18px', lineHeight: 1, padding: '4px 8px', transition: 'color 0.3s', flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = CORAL)}
              onMouseLeave={e => (e.currentTarget.style.color = '#777')}
            >✕</button>
          </div>
          {variantId?.attributes && Object.keys(variant.attributes).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {Object.entries(variant.attributes).map(([key, val]) => (
                <span
                  key={key}
                  style={{
                    backgroundColor: '#242424',
                    border: '1px solid #383838',
                    padding: '2px 6px',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    color: '#E2E2E2'
                  }}
                >
                  <span style={{ color: '#888' }}>{key}:</span> {val}
                </span>
              ))}
            </div>
          )}
          {description && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: GRAY, letterSpacing: '0.01em', margin: '0 0 8px', wordBreak: 'break-word' }}>
              {description}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
          <QuantityStepper
            qty={qty}
            onDecrement={() => onDecrement({ productId, variantId, cartItemId, qty })}
            onIncrement={() => onIncrement({ productId, variantId, cartItemId })}
          />
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '20px', letterSpacing: '0.03em', color: CORAL, whiteSpace: 'nowrap' }}>
            {currency} {(price * qty).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─── Empty state ─────────────────────────────────────────────────────────── */
const EmptyCart = () => (
  <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={CORAL} strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
    <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '28px', letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT, textAlign: 'center', margin: 0 }}>
      Your Cart Is Empty
    </p>
    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: GRAY, textAlign: 'center', maxWidth: '320px', margin: 0 }}>
      Looks like you haven't added any pieces yet. Explore the collection and find your next statement.
    </p>
    <Link
      to="/home"
      style={{ display: 'inline-block', padding: '16px 40px', backgroundColor: CORAL, color: '#000', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'transform 0.3s, box-shadow 0.3s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255,107,107,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
    >Explore Collection</Link>
  </div>
)


/* ─── Main Cart page ──────────────────────────────────────────────────────── */
const Cart = () => {
  const cartItems = useSelector((state) => state.cart?.items || [])
  const user = useSelector((state) => state.auth?.user)
  const { theme, toggleTheme } = useTheme()
  const {
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleRemoveCartItem,
  } = useCart()

  useEffect(() => {
    handleGetCart()
  }, [])

  const handleIncrement = ({ productId, variantId }) => {
    handleIncrementCartItem({ productId, variantId })
  }

  const handleDecrement = ({ productId, variantId, cartItemId, qty }) => {
    if (qty > 1) {
      handleDecrementCartItem({ productId, variantId })
    } else {
      handleRemoveCartItem({ productId, variantId, cartItemId })
    }
  }

  const handleRemove = ({ productId, variantId, cartItemId }) => {
    handleRemoveCartItem({ productId, variantId, cartItemId })
  }


  const firstItemDetails = cartItems?.[0] ? getItemDetails(cartItems[0]) : null
  const currency = firstItemDetails?.currency || 'USD'
  const subtotal = cartItems?.reduce((sum, item) => {
    const { price } = getItemDetails(item)
    const qty = item.quantity || 1
    return sum + price * qty
  }, 0) || 0
  const itemCount = cartItems?.length || 0


  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        html, body { overflow-y: auto !important; height: auto !important; }
        @media (max-width: 1024px) {
          .fynix-cart-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .fynix-cart-summary {
            position: static !important;
          }
          .fynix-cart-main {
            padding: 28px 20px !important;
          }
          .fynix-cart-header {
            padding: 12px 20px !important;
          }
        }
        @media (max-width: 640px) {
          .fynix-cart-item-card {
            flex-direction: column !important;
          }
          .fynix-cart-item-img {
            width: 100% !important;
            height: 180px !important;
            min-width: unset !important;
          }
          .fynix-cart-main {
            padding: 20px 12px !important;
          }
          .fynix-cart-header {
            padding: 12px 12px !important;
          }
          .fynix-cart-nav {
            display: none !important;
          }
        }
      `}</style>
      <div style={{ minHeight: '100vh', backgroundColor: BG, color: TEXT, fontFamily: 'Inter, sans-serif', overflowY: 'auto' }}>

        {/* ── Navbar ── */}
        <header className="fynix-cart-header" style={{ backgroundColor: 'var(--bg-nav)', borderBottom: `1px solid ${SURF2}`, position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1440px', margin: '0 auto', padding: '14px 64px' }}>
            <Link to="/home" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '26px', letterSpacing: '0.1em', textTransform: 'uppercase', color: TEXT, textDecoration: 'none', transition: 'transform 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >Funky Fiber</Link>
            <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              {['SHOP', 'COLLECTIONS', 'NEW ARRIVALS'].map(label => (
                <Link key={label} to="/home" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT, textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = CORAL)}
                  onMouseLeave={e => (e.currentTarget.style.color = TEXT)}
                >{label}</Link>
              ))}
              {user && (
                <Link to="/cart" style={{ color: CORAL, borderBottom: `2px solid ${CORAL}`, paddingBottom: '2px', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textDecoration: 'none' }}>
                  🛍 {itemCount > 0 && `(${itemCount})`}
                </Link>
              )}
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none flex items-center justify-center cursor-pointer ml-2"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 2px 8px var(--shadow-color)'
                }}
              >
                {theme === 'dark' ? (
                  <svg className="w-4 h-4 transition-transform duration-500 hover:rotate-90 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 transition-transform duration-500 hover:-rotate-45 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                )}
              </button>
            </nav>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="fynix-cart-main" style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 48px' }}>
          {/* Title row */}
          <div style={{ marginBottom: '40px', borderBottom: `1px solid ${SURF2}`, paddingBottom: '20px' }}>
            <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '32px', letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT, margin: 0 }}>
              Your Cart
              {itemCount > 0 && (
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: CORAL, verticalAlign: 'middle', marginLeft: '14px' }}>
                  {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
                </span>
              )}
            </h1>
          </div>

          {itemCount === 0 ? <EmptyCart /> : (
            <div className="fynix-cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'start' }}>
              {/* Left: items */}
              <div className="fynix-cart-items-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cartItems.map((item, index) => {
                  const { productId, variantId, cartItemId } = getItemDetails(item)
                  const itemKey = item._id || `${productId}-${variantId || index}`
                  return (
                    <CartItemCard
                      key={itemKey}
                      item={item}
                      onRemove={handleRemove}
                      onDecrement={handleDecrement}
                      onIncrement={handleIncrement}
                    />
                  )
                })}
              </div>

              {/* Right: summary */}
              <div className="fynix-cart-summary" style={{ position: 'sticky', top: '88px', backgroundColor: SURF, border: `1px solid ${SURF2}`, padding: '28px' }}>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '0.1em', textTransform: 'uppercase', color: TEXT, marginBottom: '28px', paddingBottom: '16px', borderBottom: `1px solid ${SURF2}` }}>
                  Order Summary
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                  {[
                    { label: 'Subtotal', value: `${currency} ${subtotal.toLocaleString()}`, highlight: false },
                    { label: 'Estimated Shipping', value: 'COMPLIMENTARY', highlight: true },
                    { label: 'Tax', value: 'Calculated at checkout', highlight: false },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: GRAY }}>{label}</span>
                      <span style={{ color: highlight ? CORAL : TEXT, fontFamily: highlight ? 'Montserrat, sans-serif' : 'Inter, sans-serif', fontWeight: highlight ? 700 : 400, fontSize: highlight ? '11px' : '13px', letterSpacing: highlight ? '0.1em' : '0.01em' }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: `1px solid ${SURF2}`, paddingTop: '20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT }}>Total</span>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '26px', letterSpacing: '0.03em', color: CORAL }}>
                    {currency} {subtotal.toLocaleString()}
                  </span>
                </div>

                <button
                  style={{ width: '100%', padding: '18px', backgroundColor: CORAL, color: '#000', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s', marginBottom: '12px' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255,107,107,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                >Proceed to Checkout</button>

                <Link
                  to="/"
                  style={{ display: 'block', width: '100%', padding: '15px', textAlign: 'center', border: `1px solid ${CORAL}`, color: CORAL, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background-color 0.3s', boxSizing: 'border-box' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,107,107,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >Continue Shopping</Link>

                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', textAlign: 'center', marginTop: '20px' }}>
                  🔒 Secure SSL Encrypted Transaction
                </p>
              </div>
            </div>
          )}
        </main>

        {/* ── Footer ── */}
        <footer style={{ backgroundColor: '#0e0e0e', borderTop: `1px solid ${SURF2}`, marginTop: '80px' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '18px', letterSpacing: '0.1em', textTransform: 'uppercase', color: TEXT }}>FYNIX</div>
            <nav style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {['Privacy Policy', 'Terms of Service', 'Shipping & Returns', 'Contact'].map(label => (
                <Link key={label} to="/" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: GRAY, textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
                  onMouseLeave={e => (e.currentTarget.style.color = GRAY)}
                >{label}</Link>
              ))}
            </nav>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: GRAY }}>
              © 2026 FYNIX STUDIOS. ALL RIGHTS RESERVED.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Cart
