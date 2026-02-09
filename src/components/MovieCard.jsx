import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/api';
import { Play } from 'lucide-react';

const MovieCard = ({ movie }) => {
    return (
        <Link to={`/phim/${movie.slug}`} className="group relative block h-full select-none">
            {/* Khung Ảnh */}
            <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-[#1a1d2e] shadow-md group-hover:shadow-xl transition-all duration-300">
                {/* Nhãn trên góc */}
                <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                    <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        {movie.quality || 'HD'}
                    </span>
                </div>
                
                <div className="absolute top-2 right-2 z-20">
                     <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                        {movie.episode_current || 'Full'}
                    </span>
                </div>

                <img 
                    src={getImageUrl(movie.thumb_url)} 
                    alt={movie.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                
                {/* Lớp phủ đen + Nút Play (Chỉ hiện khi hover vào ĐÚNG card này) */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                        <Play className="fill-black text-black w-4 h-4 ml-0.5" />
                    </div>
                </div>
            </div>

            {/* Thông tin bên dưới */}
            <div className="mt-2.5">
                <h3 className="text-white font-bold text-sm truncate group-hover:text-red-500 transition-colors">
                    {movie.name}
                </h3>
                <p className="text-gray-500 text-xs truncate mt-0.5 group-hover:text-gray-400">
                    {movie.origin_name} ({movie.year})
                </p>
            </div>
        </Link>
    );
};

export default MovieCard;