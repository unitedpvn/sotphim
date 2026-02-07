import React from 'react';
import { Link } from 'react-router-dom'; // 1. Phải import Link
import { getImageUrl } from '../utils/api';
import { Play } from 'lucide-react';

const MovieCard = ({ movie }) => {
    return (
        // 2. Phải dùng thẻ Link to="..."
        <Link to={`/phim/${movie.slug}`} className="group relative block bg-gray-900 rounded-lg overflow-hidden h-full">
            <div className="aspect-[2/3] relative overflow-hidden">
                <img 
                    src={getImageUrl(movie.thumb_url)} 
                    alt={movie.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                        <Play className="text-white fill-white ml-1 w-6 h-6" />
                    </div>
                </div>
                
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
                    {movie.episode_current || movie.quality || 'HD'}
                </div>
            </div>

            <div className="p-3">
                <h3 className="text-white font-bold text-sm line-clamp-1 group-hover:text-red-500 transition-colors uppercase">
                    {movie.name}
                </h3>
                <p className="text-gray-500 text-xs truncate mt-1">
                    {movie.origin_name} ({movie.year})
                </p>
            </div>
        </Link>
    );
};

export default MovieCard;