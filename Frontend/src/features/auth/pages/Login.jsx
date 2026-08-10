import React, { useState } from "react";
import { useAuth } from '../hook/useAuth';
import { useNavigate } from "react-router";
// import ContinueWithGoogle from "../components/ContinueWithGoogle";

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
            await handleLogin({
                email: form.email,
                password: form.password,
            });
            navigate("/");
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <div className="flex h-screen w-full bg-black overflow-hidden">

            {/* ── LEFT · FORM PANEL ── */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-10 md:px-16 lg:px-24 bg-black overflow-hidden">
                <div className="w-full max-w-sm">

                    {/* Brand */}
                    <div className="mb-3 flex flex-col items-center justify-center md:items-start md:justify-start">
                        <h1 className="text-5xl font-black uppercase tracking-[0.12em] text-white leading-none"
                            style={{ fontFamily: "Montserrat, sans-serif" }}>
                            FYNIX
                        </h1>
                        <p className="mt-3 text-[13px] text-neutral-500 tracking-wide leading-relaxed">
                            Welcome back. Sign in to your account.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email */}
                        <div className="space-y-2">
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
                                placeholder="you@snitch.com"
                                className="w-full bg-transparent border-0 border-b border-neutral-800 text-white text-[15px] py-3 placeholder:text-neutral-700 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
                                style={{ fontFamily: "Inter, sans-serif", borderRadius: 0 }}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
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
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••"
                                    className="w-full bg-transparent border-0 border-b border-neutral-800 text-white text-[15px] py-3 pr-14 placeholder:text-neutral-700 focus:outline-none focus:border-[#ff6b6b] transition-colors duration-300"
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

                        {/* Submit */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-4 bg-[#ff6b6b] text-black text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white transition-colors duration-300 cursor-pointer"
                                style={{ fontFamily: "Montserrat, sans-serif", borderRadius: 0 }}
                            >
                                Log in
                            </button>
                        </div>

                        {/* Sign up */}
                        <p className="text-center text-[11px] text-neutral-600 tracking-wide pt-1">
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                className="text-neutral-300 hover:text-[#ff6b6b] transition-colors duration-200 font-semibold"
                            >
                                Sign up
                            </a>
                        </p>
                        {/* <ContinueWithGoogle /> */}
                    </form>

                    {/* Footer */}
                    <p className="mt-16 text-[9px] tracking-[0.25em] uppercase text-neutral-800"
                        style={{ fontFamily: "Montserrat, sans-serif" }}>
                        © 2026 FYNIX. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>

            {/* ── RIGHT · IMAGE PANEL ── */}
            <div className="hidden md:block md:w-1/2 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" />
                <img
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=85&fit=crop&auto=format"
                    alt="FYNIX fashion model"
                    className="w-full h-full object-cover object-top"
                    style={{ filter: "contrast(1.08) saturate(0.9)" }}
                />
                <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-10"
                    style={{ background: "linear-gradient(to top, rgba(255,107,107,0.06), transparent)" }} />
                <div className="absolute bottom-10 right-8 z-20 pointer-events-none">
                    <span
                        className="text-5xl font-black uppercase tracking-[0.15em] text-white/[0.05] select-none leading-none"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        FYNIX
                    </span>
                </div>
            </div>

        </div>
    );
}