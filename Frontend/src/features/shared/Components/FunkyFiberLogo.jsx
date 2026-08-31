import React from "react";

export default function FunkyFiberLogo({ className = "h-14 w-auto" }) {
    return (
        <svg
            viewBox="0 0 320 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@700;900&family=Paytone+One&display=swap');
                    .funky-brand-text {
                        font-family: 'Paytone One', 'Fredoka', 'Arial Black', sans-serif;
                        font-weight: 900;
                    }
                    .fiber-brand-text {
                        font-family: 'Paytone One', 'Fredoka', 'Arial Black', sans-serif;
                        font-weight: 900;
                        letter-spacing: 2px;
                    }
                `}</style>
            </defs>

            {/* Outer white accent loop 1 */}
            <path
                d="M 10 48 C 5 24, 28 6, 68 6 C 112 6, 132 28, 126 54 C 120 80, 58 86, 22 78 C 10 74, 4 60, 10 48 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeOpacity="0.85"
            />

            {/* Outer white accent loop 2 */}
            <path
                d="M 16 50 C 10 28, 32 10, 70 10 C 108 10, 125 30, 120 52 C 114 75, 60 80, 26 73 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeOpacity="0.95"
            />

            {/* Green Pebble Fill */}
            <path
                d="M 20 50 C 14 30, 36 14, 70 14 C 102 14, 118 32, 114 50 C 108 70, 58 74, 28 68 C 20 65, 14 58, 20 50 Z"
                fill="#FF6B6B"
            />

            {/* "FUNKY" text inside pebble */}
            <g transform="translate(66, 52) rotate(-8)">
                <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#000000"
                    className="funky-brand-text"
                    fontSize="24"
                    letterSpacing="1"
                >
                    FUNKY
                </text>
            </g>

            {/* "FIBER" text */}
            <g transform="translate(132, 57)">
                {/* Thick white outline */}
                <text
                    x="0"
                    y="0"
                    fill="#1b1b1b"
                    stroke="#ffffff"
                    strokeWidth="5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="fiber-brand-text"
                    fontSize="38"
                >
                    FIBER
                </text>
                {/* Inner dark fill */}
                <text
                    x="0"
                    y="0"
                    fill="#1b1b1b"
                    className="fiber-brand-text"
                    fontSize="38"
                >
                    FIBER
                </text>
                {/* TM symbol */}
                <text
                    x="142"
                    y="-20"
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                >
                    ™
                </text>
            </g>
        </svg>
    );
}
