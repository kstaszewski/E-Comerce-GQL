import React from "react";

const Add = (props) => {
    return (
        <svg width={props.size || '45'} height={props.size || '45'} viewBox="0 0 45 45" fill={"none"} xmlns="http://www.w3.org/2000/svg" onClick={props.onClick}>
            <g clipPath="url(#clip0_150_1451)">
                <rect x="0.5" y="0.5" width="44" height="44" stroke="#1D1F22" />
                <path d="M22.5 15V30" stroke="#1D1F22" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 22.5H30" stroke="#1D1F22" strokeLinecap="round" strokeLinejoin="round" />

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
            <path d="M15 22.5H30" stroke="#1D1F22" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    );
};

const PrevImage = (props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={props.onClick}>
            <rect width="24" height="24" fill="black" fillOpacity="0.73" />
            <path d="M14.25 6.06857L8.625 11.6876L14.25 17.3066" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const NextImage = (props) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={props.onClick}>
            <rect width="24" height="24" transform="matrix(-1 0 0 1 24 0)" fill="black" fillOpacity="0.73" />
            <path d="M9.75 6.06857L15.375 11.6876L9.75 17.3066" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export {Add, Remove, PrevImage, NextImage};