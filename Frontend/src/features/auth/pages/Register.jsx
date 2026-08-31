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
        <div className="relative h-screen w-full overflow-hidden bg-black">

            {/* Full-bleed background image behind entire page */}
            <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Funky Fiber background model"
                className="absolute inset-0 w-full h-full object-cover object-top filter contrast-[1.08] saturate-[0.9]"
            />

            {/* Global dark & coral ambient glow overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B6B]/15 via-transparent to-[#FF6B6B]/05 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-[#FF6B6B]/10 via-transparent to-transparent pointer-events-none" />

            {/* Page content */}
            <div className="relative z-10 flex h-full w-full">

                {/* ── LEFT · MERGED FROSTED GLASS FORM PANEL ── */}
                <div className="w-full md:w-1/2 flex items-center justify-center px-6 sm:px-10 md:px-12 lg:px-16 bg-gradient-to-r from-black/40 via-black/20 to-transparent backdrop-blur-md overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="w-full max-w-xs py-4 md:py-0">

                        {/* Brand Logo */}
                        <div className="mb-3 mt-1 flex flex-col items-center justify-center md:items-start md:justify-start">
                            <FunkyFiberLogo className="h-10 sm:h-12 w-auto" />
                            <p className="mt-1 text-[11px] text-neutral-400 tracking-wide leading-relaxed text-center md:text-left">
                                Be the first to know about what's happening around you.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-2.5">

                            {/* Full Name */}
                            <div className="space-y-0.5">
                                <label
                                    htmlFor="fullname"
                                    className="block text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400"
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
                                    className="w-full bg-transparent border-0 border-b border-neutral-700 text-white text-[13px] py-1.5 placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
                                    style={{ fontFamily: "Inter, sans-serif", borderRadius: 0 }}
                                />
                            </div>

                            {/* Contact */}
                            <div className="space-y-0.5">
                                <label
                                    htmlFor="contact"
                                    className="block text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400"
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
                                    className="w-full bg-transparent border-0 border-b border-neutral-700 text-white text-[13px] py-1.5 placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
                                    style={{ fontFamily: "Inter, sans-serif", borderRadius: 0 }}
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-0.5">
                                <label
                                    htmlFor="email"
                                    className="block text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400"
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
                                    className="w-full bg-transparent border-0 border-b border-neutral-700 text-white text-[13px] py-1.5 placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
                                    style={{ fontFamily: "Inter, sans-serif", borderRadius: 0 }}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-0.5">
                                <label
                                    htmlFor="password"
                                    className="block text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400"
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
                                        className="w-full bg-transparent border-0 border-b border-neutral-700 text-white text-[13px] py-1.5 pr-14 placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
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

                            {/* Seller checkbox */}
                            <div className="flex items-center gap-2.5 pt-0.5">
                                <div className="relative flex items-center">
                                    <input
                                        id="isSeller"
                                        name="isSeller"
                                        type="checkbox"
                                        checked={form.isSeller}
                                        onChange={handleChange}
                                        className="peer w-3.5 h-3.5 appearance-none border border-neutral-700 bg-transparent checked:bg-[#ff6b6b] checked:border-[#ff6b6b] transition-colors duration-200 cursor-pointer"
                                        style={{ borderRadius: 0 }}
                                    />
                                    {/* checkmark */}
                                    <svg
                                        className="absolute left-0.5 top-0.5 w-2.5 h-2.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-150"
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

                            {/* Submit Button */}
                            <div className="pt-1">
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-[#ff6b6b] text-black text-[10px] font-black tracking-[0.25em] uppercase hover:bg-white transition-colors duration-300 cursor-pointer"
                                    style={{ fontFamily: "Montserrat, sans-serif", borderRadius: 0 }}
                                >
                                    Sign up
                                </button>
                            </div>
                            <ContinueWithGoogle />

                            {/* Sign in */}
                            <p className="text-center text-[11px] text-neutral-400 tracking-wide">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="text-white hover:text-[#ff6b6b] transition-colors duration-200 font-semibold"
                                >
                                    Sign in
                                </a>
                            </p>
                        </form>

                        {/* Footer */}
                        <p className="mt-4 text-[9px] tracking-[0.2em] uppercase text-neutral-500 text-center md:text-left"
                            style={{ fontFamily: "Montserrat, sans-serif" }}>
                            © 2026 FUNKY FIBER. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>

                {/* ── RIGHT · WATERMARK ── */}
                <div className="hidden md:flex md:w-1/2 relative items-end justify-end p-10 lg:p-16 pointer-events-none">
                    <span
                        className="text-4xl lg:text-6xl font-black uppercase tracking-[0.15em] text-white/[0.08] select-none leading-none whitespace-nowrap"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        FUNKY FIBER
                    </span>
                </div>

            </div>
        </div>
    );
}
