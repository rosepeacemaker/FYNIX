import React, { useState } from "react";
import { useAuth } from '../hook/useAuth';
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import FunkyFiberLogo from "../../shared/Components/FunkyFiberLogo";

export default function Login() {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

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
            console.log(user)
            if (user.role == "buyer") {
                navigate("/");
            } else if (user.role == "seller") {
                navigate("/seller/dashboard");
            }
        } catch (error) {

            console.error("Login failed", error);
        }
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

                        {/* Brand */}
                        <div className="mb-4 flex flex-col items-center justify-center md:items-start md:justify-start">
                            <FunkyFiberLogo className="h-10 sm:h-12 w-auto" />
                            <p className="mt-1.5 text-[11px] text-neutral-400 tracking-wide leading-relaxed">
                                Welcome back. Sign in to your account.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">

                            {/* Email */}
                            <div className="space-y-1">
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
                                    placeholder="you@snitch.com"
                                    className="w-full bg-transparent border-0 border-b border-neutral-700 text-white text-[13px] py-1.5 placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
                                    style={{ fontFamily: "Inter, sans-serif", borderRadius: 0 }}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
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
                                        autoComplete="current-password"
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

                            {/* Submit */}
                            <div className="pt-1">
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-[#ff6b6b] text-black text-[10px] font-black tracking-[0.25em] uppercase hover:bg-white transition-colors duration-300 cursor-pointer"
                                    style={{ fontFamily: "Montserrat, sans-serif", borderRadius: 0 }}
                                >
                                    Log in
                                </button>
                            </div>

                            {/* Sign up */}
                            <p className="text-center text-[11px] text-neutral-400 tracking-wide">
                                Don't have an account?{" "}
                                <a
                                    href="/register"
                                    className="text-white hover:text-[#ff6b6b] transition-colors duration-200 font-semibold"
                                >
                                    Sign up
                                </a>
                            </p>
                            <ContinueWithGoogle />
                        </form>

                        {/* Footer */}
                        <p className="mt-6 text-[9px] tracking-[0.2em] uppercase text-neutral-500 text-center md:text-left"
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