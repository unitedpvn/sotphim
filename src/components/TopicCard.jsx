import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const TopicCard = ({ name, slug, color }) => {
    return (
        <Link 
            to={slug.startsWith('/') ? slug : `/the-loai/${slug}`} 
            className="relative h-[100px] rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            {/* Mask màu nền */}
            <div 
                className="absolute inset-0 transition-opacity duration-300" 
                style={{ backgroundColor: color }}
            ></div>

            {/* Nội dung */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <h3 className="text-white font-bold text-lg leading-tight uppercase truncate drop-shadow-md">
                    {name}
                </h3>
                
                <div className="flex items-center gap-2 text-xs font-medium text-white/90 bg-black/20 w-fit px-2 py-1 rounded hover:bg-black/40 transition-colors">
                    <span>Xem chủ đề</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>

            {/* Họa tiết trang trí ẩn */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
        </Link>
    );
};

export default TopicCard;