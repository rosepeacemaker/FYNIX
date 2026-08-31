import React, { useState } from "react";
import { useAuth } from '../hook/useAuth';
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import FunkyFiberLogo from "../../shared/Components/FunkyFiberLogo";

export default function Register() {

    const { handleRegister } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullname: "",
        contact: "",
        email: "",
        password: "",
        isSeller: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await handleRegister({
            email: form.email,
            password: form.password,
            fullname: form.fullname,
            contact: form.contact,
            isSeller: form.isSeller
        });

        navigate("/");
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">

            {/* ── LEFT · FORM PANEL ── */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-6 sm:px-10 md:px-16 lg:px-24 bg-[#1B1B1B]/70 backdrop-blur-lg overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="w-full max-w-sm py-6 md:py-0">

                    {/* Brand Logo */}
                    <div className="mb-5 flex flex-col items-center justify-center md:items-start md:justify-start">
                        <FunkyFiberLogo className="h-14 sm:h-16 w-auto" />
                        <p className="mt-2 text-[12px] text-neutral-500 tracking-wide leading-relaxed text-center md:text-left">
                            Be the first to know about what's happening around you.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Full Name */}
                        <div className="space-y-1">
                            <label
                                htmlFor="fullname"
                                className="block text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                                Full Name
                            </label>
                            <input
                                id="fullname"
                                name="fullname"
                                type="text"
                                required
                                autoComplete="name"
                                value={form.fullname}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                                className="w-full bg-transparent border-0 border-b border-neutral-800 text-white text-[13px] py-2 placeholder:text-neutral-700 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
                                style={{ fontFamily: "Inter, sans-serif", borderRadius: 0 }}
                            />
                        </div>

                        {/* Contact */}
                        <div className="space-y-1">
                            <label
                                htmlFor="contact"
                                className="block text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                                Contact
                            </label>
                            <input
                                id="contact"
                                name="contact"
                                type="tel"
                                required
                                autoComplete="tel"
                                value={form.contact}
                                onChange={handleChange}
                                placeholder="+1 555 000 0000"
                                className="w-full bg-transparent border-0 border-b border-neutral-800 text-white text-[13px] py-2 placeholder:text-neutral-700 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
                                style={{ fontFamily: "Inter, sans-serif", borderRadius: 0 }}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label
                                htmlFor="email"
                                className="block text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500"
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
                                placeholder="you@fynix.com"
                                className="w-full bg-transparent border-0 border-b border-neutral-800 text-white text-[13px] py-2 placeholder:text-neutral-700 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
                                style={{ fontFamily: "Inter, sans-serif", borderRadius: 0 }}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label
                                htmlFor="password"
                                className="block text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500"
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
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••"
                                    className="w-full bg-transparent border-0 border-b border-neutral-800 text-white text-[13px] py-2 pr-14 placeholder:text-neutral-700 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
                                    style={{ fontFamily: "Inter, sans-serif", borderRadius: 0 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-bold tracking-[0.15em] uppercase text-neutral-600 hover:text-[#ff6b6b] transition-colors duration-200"
                                    style={{ fontFamily: "Montserrat, sans-serif" }}
                                >
                                    {showPassword ? "hide" : "show"}
                                </button>
                            </div>
                        </div>

                        {/* Seller checkbox */}
                        <div className="flex items-center gap-3 pt-1">
                            <div className="relative flex items-center">
                                <input
                                    id="isSeller"
                                    name="isSeller"
                                    type="checkbox"
                                    checked={form.isSeller}
                                    onChange={handleChange}
                                    className="peer w-4 h-4 appearance-none border border-neutral-700 bg-transparent checked:bg-[#ff6b6b] checked:border-[#ff6b6b] transition-colors duration-200 cursor-pointer"
                                    style={{ borderRadius: 0 }}
                                />
                                {/* checkmark */}
                                <svg
                                    className="absolute left-0.5 top-0.5 w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-150"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                >
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <label
                                htmlFor="isSeller"
                                className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 cursor-pointer select-none"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                                Register as Seller
                            </label>


                        </div>

                        {/* Submit  Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full py-2.5 bg-[#ff6b6b] text-black text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white transition-colors duration-300 cursor-pointer"
                                style={{ fontFamily: "Montserrat, sans-serif", borderRadius: 0 }}
                            >
                                Sign up
                            </button>
                        </div>
                        <ContinueWithGoogle />

                        {/* Sign in */}
                        <p className="text-center text-[11px] text-neutral-600 tracking-wide">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="text-neutral-300 hover:text-[#ff6b6b] transition-colors duration-200 font-semibold"
                            >
                                Sign in
                            </a>
                        </p>
                    </form>

                    {/* Footer */}
                    <p className="mt-8 text-[11px] tracking-[0.25em] uppercase text-neutral-800 text-center md:text-left"
                        style={{ fontFamily: "Montserrat, sans-serif" }}>
                        © 2026 FUNKY FIBER. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>

            {/* ── RIGHT · IMAGE PANEL ── */}
            <div className="hidden md:block md:w-1/2 relative overflow-hidden">

                {/* Left-edge seamless blend */}
                <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />

                {/* Top vignette */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />

                {/* Bottom vignette */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" />

                {/* Model image — fashion editorial */}
                <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Funky Fiber fashion model"
                    className="w-full h-full object-cover object-top"
                    style={{ filter: "contrast(1.08) saturate(0.9)" }}
                />

                {/* Subtle coral bottom glow */}
                <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-10"
                    style={{ background: "linear-gradient(to top, rgba(255,107,107,0.06), transparent)" }} />

                {/* Ghost watermark */}
                <div className="absolute bottom-10 right-8 md:right-12 lg:right-16 z-20 pointer-events-none">
                    <span
                        className="text-4xl lg:text-6xl font-black uppercase tracking-[0.15em] text-white/[0.05] select-none leading-none whitespace-nowrap"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        FUNKY FIBER
                    </span>
                </div>
            </div>

        </div>
    );
}
