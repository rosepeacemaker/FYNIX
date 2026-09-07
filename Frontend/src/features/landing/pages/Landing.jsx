import React from "react";
import "../../../app/App.css";
import { useNavigate } from "react-router";
import BackgroundVideo from "../../../components/backgroundvideo/BackgroundVideo";

const Landing = () => {

    const navigate = useNavigate();
    return (
        <main className="landing-page relative min-h-screen w-screen flex flex-col items-center justify-center gap-5">
            <BackgroundVideo />
            {/* landing content */}
            <div className="landing-content">
                <p className="landing-small-text">Step into the future of fashion</p>
                <h1 className="landing-title">
                    FUNKY FIBER</h1>

                <p className="text-3xl font-semibold text-[#FF6B6B]">Fashion that moves with you.</p>

                <div className="landing-buttons">
                    <button onClick={() => { navigate("/login") }}>Login</button>
                    <button onClick={() => { navigate("/register") }}>Register</button>
                </div>
            </div>
        </main>
    );
};

export default Landing;