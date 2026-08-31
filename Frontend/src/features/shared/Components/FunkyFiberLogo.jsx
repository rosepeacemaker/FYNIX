import React from "react";

export default function FunkyFiberLogo({ className = "h-11 w-auto" }) {
    return (
        <svg
            viewBox="0 0 340 76"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Paytone+One&family=Montserrat:wght@800;900&display=swap');
                    .funky-text {
                        font-family: 'Paytone One', sans-serif;
                        font-weight: 900;
                    }
                    .fiber-text {
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 900;
                        letter-spacing: 3px;
                    }
                `}</style>
            </defs>

            {/* Outer white accent loop */}
            <path
                d="M 10 38 C 10 14, 38 6, 170 6 C 302 6, 330 14, 330 38 C 330 62, 302 70, 170 70 C 38 70, 10 62, 10 38 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeOpacity="0.85"
            />

            {/* Main Coral Pebble / Balloon Fill */}
            <path
                d="M 14 38 C 14 18, 40 10, 170 10 C 300 10, 326 18, 326 38 C 326 58, 300 66, 170 66 C 40 66, 14 58, 14 38 Z"
                fill="#FF6B6B"
            />

            {/* Inner Dark Badge for "FUNKY" inside balloon */}
            <rect
                x="26"
                y="18"
                width="114"
                height="40"
                rx="20"
                fill="#1B1B1B"
            />

            {/* "FUNKY" text inside inner dark badge */}
            <text
                x="83"
                y="44"
                textAnchor="middle"
                fill="#FFFFFF"
                className="funky-text"
                fontSize="20"
                letterSpacing="1"
            >
                FUNKY
            </text>

            {/* "FIBER" text inside balloon */}
            <text
                x="154"
                y="46"
                fill="#1B1B1B"
                className="fiber-text"
                fontSize="26"
            >
                FIBER
            </text>

            {/* ™ symbol inside balloon */}
            <text
                x="300"
                y="30"
                fill="#1B1B1B"
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="bold"
            >
                ™
            </text>
        </svg>
    );
}
