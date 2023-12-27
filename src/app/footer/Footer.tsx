import React from "react";
import {
    AiOutlineInstagram,
    AiOutlineLinkedin,
    AiOutlineGithub,
} from "react-icons/ai";

export default function Footer() {
    return (
        <footer className="py-6 w-full flex justify-center text-xs gap-2 text-neutral-700 items-center lg:col-span-2 absolute bottom-0 [mix-blend-mode:multiply]">
            <p className="h-full">Coded by Luis Henrique |</p>
            <div className="flex gap-2">
                <a href="https://www.instagram.com/luissshc_/">
                    <AiOutlineInstagram />
                </a>
                <a href="https://www.linkedin.com/in/luis-henrique-6a7425165/">
                    <AiOutlineLinkedin />
                </a>
                <a href="https://github.com/luissshc29">
                    <AiOutlineGithub />
                </a>
            </div>
        </footer>
    );
}
