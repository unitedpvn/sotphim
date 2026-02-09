import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SliderNavigation = ({ prevRef, nextRef }) => {
    return (
        <div className="flex gap-2">
            <button 
                ref={prevRef} 
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button 
                ref={nextRef} 
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed group"
            >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
};

export default SliderNavigation;