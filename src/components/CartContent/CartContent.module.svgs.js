import React from "react";

const Add = (props) => {
    return (
        <svg width={props.size || '45'} height={props.size || '45'} viewBox="0 0 45 45" fill={"none"} xmlns="http://www.w3.org/2000/svg" onClick={props.onClick}>
            <g clip-path="url(#clip0_150_1451)">
                <rect x="0.5" y="0.5" width="44" height="44" stroke="#1D1F22" />
                <path d="M22.5 15V30" stroke="#1D1F22" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15 22.5H30" stroke="#1D1F22" stroke-linecap="round" stroke-linejoin="round" />

            </g>
            <defs>
                <clipPath id="clip0_150_1451">
                    <rect width="45" height="45" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

const Remove = (props) => {
    return (
        <svg width={props.size || '45'} height={props.size || '45'} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={props.onClick}>
            <rect x="0.5" y="0.5" width="44" height="44" stroke="#1D1F22" />
            <path d="M15 22.5H30" stroke="#1D1F22" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    );
};
export {Add, Remove};