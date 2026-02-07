import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black py-8 border-t border-gray-800 mt-10">
            <div className="container mx-auto px-4 text-center">
                <div className="mb-4">
                    <span className="text-2xl font-black text-white">SỌT</span>
                    <span className="text-2xl font-black text-red-600">PHIM</span>
                </div>
                <p className="text-gray-500 text-sm">
                    Website xem phim online miễn phí chất lượng cao.
                </p>
                <div className="mt-6 pt-6 border-t border-gray-900 text-gray-600 text-xs">
                    <p>nguyen293 made with Gemini & Ophim API</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;