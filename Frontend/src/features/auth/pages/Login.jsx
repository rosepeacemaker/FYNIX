import React, { useState, useEffect } from "react";
import { useAuth } from '../hook/useAuth';
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import FunkyFiberLogo from "../../shared/Components/FunkyFiberLogo";

// Curated high-resolution (1920x1080) aesthetic fashion images for full-screen slider
const SLIDES = [
    {
        url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop",
        tagline: "VANGUARD SILHOUETTE",
        category: "COLLECTION 01"

    },
    {
        url: "https://i.pinimg.com/736x/c8/57/05/c857053418069917859115da2d33bdc7.jpg",

        tagline: "HAUTE COUTURE",
        category: "EDITORIAL"
    },
    {
        url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop",
        tagline: "RUNWAY ROYALTY",
        category: "COLLECTION 02"
    },
    {
        url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1920&auto=format&fit=crop",
        tagline: "STREET LUXE",
        category: "STREET STYLE"
    },
    {
        url: "https://i.pinimg.com/1200x/6f/e2/48/6fe2489b4383494aa33f8bd9b69472bf.jpg",
        tagline: "BOLD SILHOUETTE",
        category: "LIMITED EDITION"
    }
];

export default function Login() {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance background slider every 4.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await handleLogin({ email: form.email, password: form.password });
            console.log(user);
            if (user.role === "buyer") {
                navigate("/home");
            } else if (user.role === "seller") {
                navigate("/seller/dashboard");
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-neutral-950 select-none flex">

            {/* ── FULL-BLEED HIGH-RES BACKGROUND SLIDER ── */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                {/* Atmosphere Blurred Glow Layer */}
                {SLIDES.map((slide, index) => (
                    <div
                        key={`blur-${index}`}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-80 scale-110" : "opacity-0 scale-100"
                            }`}
                    >
                        <img
                            src={slide.url}
                            alt=""
                            className="w-full h-full object-contain object-center filter  scale-[0.85] blur-2xl saturate-150 brightness-90"
                        />
                    </div>


                ))}

                {/* Sharp High-Res Foreground Slider Images */}
                {SLIDES.map((slide, index) => (
                    <div
                        key={`slide-${index}`}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-105"
                            }`}
                    >
                        <img
                            src={slide.url}
                            alt={slide.tagline}
                            className="w-full h-full object-cover object-center filter contrast-[1.05] saturate-[0.95]"
                        />
                    </div>
                ))}

                {/* Ambient Soft Glow & Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#ff6b6b]/20 via-transparent to-[#ffb347]/10 pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* ── LEFT SIDE: TRANSLUCENT FROSTED GLASS LOGIN FORM (30% WIDTH) ── */}
            <div className="w-full md:w-[30%] h-[80] flex items-center justify-center px-6 sm:px-8 md:px-8 lg:px-10 bg-black/45 backdrop-blur-2xl border-r border-white/10 z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="w-full max-w-xs py-4 md:py-0">

                    {/* Brand */}
                    <div className="mb-4 flex flex-col items-center justify-center md:items-start md:justify-start">
                        <FunkyFiberLogo className="h-10 sm:h-12 w-auto drop-shadow-md" />
                        <p className="mt-1.5 text-[11px] text-neutral-300 tracking-wide leading-relaxed">
                            Welcome back. Sign in to your account.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">

                        {/* Email */}
                        <div className="space-y-1">
                            <label
                                htmlFor="email"
                                className="block text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-300"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@snitch.com"
                                className="w-full bg-transparent p-1 border-0 border-b border-white/30 text-white text-[13px] py-1.5 placeholder:text-neutral-400 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
                                style={{ fontFamily: "Inter, sans-serif", borderRadius: 0 }}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label
                                htmlFor="password"
                                className="block text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-300"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••"
                                    className="w-full bg-transparent p-1 border-0 border-b border-white/30 text-white text-[13px] py-1.5 pr-14 placeholder:text-neutral-400 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
                                    style={{ fontFamily: "Inter, sans-serif", borderRadius: 0 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-bold tracking-[0.15em] uppercase text-neutral-400 hover:text-[#ff6b6b] transition-colors duration-200"
                                    style={{ fontFamily: "Montserrat, sans-serif" }}
                                >
                                    {showPassword ? "hide" : "show"}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-1">
                            <button
                                type="submit"
                                className="w-full py-2.5 bg-[#ff6b6b] text-black text-[10px] font-black tracking-[0.25em] uppercase hover:bg-white transition-all duration-300 shadow-lg shadow-[#ff6b6b]/30 cursor-pointer"
                                style={{ fontFamily: "Montserrat, sans-serif", borderRadius: 0 }}
                            >
                                Log in
                            </button>
                        </div>

                        {/* Sign up */}
                        <p className="text-center text-[11px] text-neutral-300 tracking-wide">
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                className="text-white hover:text-[#ff6b6b] transition-colors duration-200 font-semibold underline underline-offset-4 decoration-[#ff6b6b]/40"
                            >
                                Sign up
                            </a>
                        </p>
                        <ContinueWithGoogle />
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-[9px] tracking-[0.2em] uppercase text-neutral-400 text-center md:text-left"
                        style={{ fontFamily: "Montserrat, sans-serif" }}>
                        © 2026 FUNKY FIBER. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>

            {/* ── RIGHT SIDE: WATERMARK, SLIDER PREVIEW & CONTROLS (70% WIDTH) ── */}
            <div className="hidden md:flex md:w-[70%] h-full relative flex-col justify-between p-10 lg:p-16 z-10 pointer-events-none">

                {/* Top Right Category Tag */}
                <div className="relative z-10 flex items-center justify-end space-x-3 text-right pointer-events-auto">
                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#ff6b6b] bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-lg">
                        {SLIDES[currentSlide].category}
                    </span>
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b] animate-pulse shadow-[0_0_10px_#ff6b6b]" />
                </div>

                {/* Center Right Watermark & Tagline */}
                <div className="relative z-10 flex flex-col items-end my-auto space-y-2 pointer-events-none">
                    <p className="text-[11px] font-bold tracking-[0.35em] text-white/90 uppercase drop-shadow-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                        {SLIDES[currentSlide].tagline}
                    </p>
                    <span
                        className="text-5xl lg:text-7xl font-black uppercase tracking-[0.15em] text-white/[0.22] select-none leading-none whitespace-nowrap drop-shadow-2xl"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        FUNKY FIBER
                    </span>
                </div>

                {/* Bottom Right Slider Navigation Controls */}
                <div className="relative z-10 flex items-end justify-between backdrop-blur-xl bg-black/45 border border-white/20 p-4 rounded-xl shadow-2xl pointer-events-auto">

                    {/* Slide Number Counter */}
                    <div className="flex items-baseline space-x-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
                        <span className="text-xl font-black text-white">
                            {String(currentSlide + 1).padStart(2, '0')}
                        </span>
                        <span className="text-xs text-neutral-400 font-bold">
                            / {String(SLIDES.length).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Interactive Slide Indicator Bars */}
                    <div className="flex items-center space-x-2">
                        {SLIDES.map((_, idx) => (
                            <button
                                key={`dot-${idx}`}
                                onClick={() => setCurrentSlide(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${idx === currentSlide
                                    ? "w-8 bg-[#ff6b6b] shadow-[0_0_12px_#ff6b6b]"
                                    : "w-2 bg-white/30 hover:bg-white/60"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Manual Arrow Controls */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePrevSlide}
                            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-[#ff6b6b] hover:bg-[#ff6b6b]/30 transition-all duration-300 cursor-pointer backdrop-blur-md"
                            aria-label="Previous slide"
                        >
                            ‹
                        </button>
                        <button
                            onClick={handleNextSlide}
                            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-[#ff6b6b] hover:bg-[#ff6b6b]/30 transition-all duration-300 cursor-pointer backdrop-blur-md"
                            aria-label="Next slide"
                        >
                            ›
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
}