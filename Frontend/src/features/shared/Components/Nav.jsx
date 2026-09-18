import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'
import { useTheme } from '../../../context/ThemeContext'

const Nav = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)
    const { theme, toggleTheme } = useTheme()

    return (
        <nav
            className="px-8 lg:px-16 xl:px-24 py-5 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-50 transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg-nav)', borderColor: 'var(--border-subtle)' }}
        >
            <Link to="/home"
                className="text-lg font-black tracking-[0.35em] uppercase hover:opacity-80 transition-opacity"
                style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--accent-primary)' }}
            >
                Funky Fiber
            </Link>
            <div className="flex gap-5 sm:gap-6 items-center text-[11px] uppercase tracking-[0.2em] font-bold" style={{ color: 'var(--text-primary)' }}>
                {user ? (
                    <>
                        <span style={{ color: 'var(--accent-primary)' }}>{user.fullname}</span>
                        {user.role === 'seller' && (
                            <Link to="/seller/dashboard" className="transition-colors hover:text-[var(--accent-primary)]">Seller Dashboard</Link>
                        )}
                        <Link
                            to="/cart"
                            className="relative flex items-center hover:opacity-70 transition-opacity"
                            style={{ color: 'var(--accent-primary)' }}
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
                                        backgroundColor: 'var(--accent-primary)',
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
                        <Link to="/login" className="transition-colors hover:text-[var(--accent-primary)]">Sign In</Link>
                        <Link to="/register" className="transition-colors hover:text-[var(--accent-primary)]">Sign Up</Link>
                    </>
                )}

                {/* ── Theme Switcher Icon (Top Right Navbar) ── */}
                <button
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    className="p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none flex items-center justify-center cursor-pointer ml-1"
                    style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 2px 8px var(--shadow-color)'
                    }}
                >
                    {theme === 'dark' ? (
                        /* Sun Icon (Switch to Light) */
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
                        /* Moon Icon (Switch to Dark) */
                        <svg className="w-4 h-4 transition-transform duration-500 hover:-rotate-45 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                    )}
                </button>
            </div>
        </nav>
    )
}

export default Nav