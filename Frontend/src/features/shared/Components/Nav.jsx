import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'

const Nav = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)

    return (
        <nav className="px-8 lg:px-16 xl:px-24 py-6 flex items-center justify-between border-b backdrop-blur-md bg-[#1b1b1b]/80 sticky top-0 z-50" style={{ borderColor: '#2A2A2A' }}>
            <Link to="/"
                className="text-lg font-black tracking-[0.35em] uppercase hover:opacity-80 transition-opacity"
                style={{ fontFamily: "'Montserrat', sans-serif", color: '#FF6B6B' }}
            >
                FYNIX
            </Link>
            <div className="flex gap-6 items-center text-[11px] uppercase tracking-[0.2em] font-bold" style={{ color: '#E2E2E2' }}>
                {user ? (
                    <>
                        <span style={{ color: '#FF6B6B' }}>{user.fullname}</span>
                        {user.role === 'seller' && (
                            <Link to="/seller/dashboard" className="transition-colors hover:text-[#FF6B6B]">Seller Dashboard</Link>
                        )}
                        <Link
                            to="/cart"
                            className="relative flex items-center hover:opacity-70 transition-opacity"
                            style={{ color: '#FF6B6B' }}
                            aria-label="Shopping cart"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            {cartItems?.length > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-black"
                                    style={{
                                        backgroundColor: '#FF6B6B',
                                        width: '16px',
                                        height: '16px',
                                        fontSize: '9px',
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 800,
                                        letterSpacing: 0,
                                    }}
                                >
                                    {cartItems.length > 9 ? '9+' : cartItems.length}
                                </span>
                            )}
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="transition-colors hover:text-[#FF6B6B]">Sign In</Link>
                        <Link to="/register" className="transition-colors hover:text-[#FF6B6B]">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Nav