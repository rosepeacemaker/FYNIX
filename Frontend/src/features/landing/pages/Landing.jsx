import React from "react";
import "../../../app/App.css";
import { useNavigate } from "react-router";
import BackgroundVideo from "../../../components/backgroundvideo/BackgroundVideo";

const Landing = () => {

    const navigate = useNavigate();
    return (
        <>

            <main className="landing-page">
                <BackgroundVideo />
                {/* landing content */}
                <div className="landing-content">

                    <p className="landing-small-text">Step into the future of fashion</p>
                    <h1 className="landing-title">
                        FUNKY FIBER</h1>

                    <p className="landing-tagline">Fashion that moves with you.</p>

                    <div className="landing-buttons">
                        <button className="landing-btn primary-btn" onClick={() => { navigate("/login") }}>Login</button>
                        <button className="landing-btn secondary-btn" onClick={() => { navigate("/register") }}>Register</button>
                    </div>

                </div>
            </main>


        </>
    );

};

export default Landing;