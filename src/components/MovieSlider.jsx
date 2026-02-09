import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/api';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

const Top10Slider = ({ title, movies }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (!movies || movies.length === 0) return null;

    return (
        <section className="relative mb-20 pt-12 pb-16 overflow-hidden">
            {/* Background gradient với noise texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10"></div>
            <div className="absolute inset-0 opacity-[0.015] -z-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px'
            }}></div>
            
            {/* Decorative gradient orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] -z-10"></div>
            
            <div className="px-4 md:px-8 lg:px-16 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="relative">
                        {/* Decorative line */}
                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 via-orange-500 to-transparent rounded-full"></div>
                        
                        <h2 className="text-3xl md:text-5xl font-black text-white flex items-center gap-4">
                            <span className="relative inline-block">
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-500 via-orange-500 to-red-600 
                                               font-black italic tracking-tight drop-shadow-lg"
                                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
                                    TOP 10
                                </span>
                                {/* Animated underline */}
                                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full 
                                              animate-pulse shadow-lg shadow-red-500/50"></div>
                            </span>
                            <span className="text-lg md:text-2xl font-normal text-gray-300 border-l-2 border-white/20 pl-4 tracking-wide">
                                {title}
                            </span>
                        </h2>
                        
                        {/* Subtitle */}
                        <p className="text-sm text-gray-500 mt-3 ml-1 tracking-wide uppercase font-semibold">
                            Phim hot nhất tuần
                        </p>
                    </div>
                    
                    {/* Navigation buttons */}
                    <div className="flex gap-3">
                        <button 
                            ref={prevRef} 
                            className="group w-12 h-12 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-red-600 hover:to-orange-600 
                                     text-white flex items-center justify-center transition-all duration-300 
                                     disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 hover:border-transparent
                                     backdrop-blur-sm hover:scale-110 hover:shadow-lg hover:shadow-red-500/50"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
                        </button>
                        <button 
                            ref={nextRef} 
                            className="group w-12 h-12 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-red-600 hover:to-orange-600 
                                     text-white flex items-center justify-center transition-all duration-300 
                                     disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 hover:border-transparent
                                     backdrop-blur-sm hover:scale-110 hover:shadow-lg hover:shadow-red-500/50"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>

                {/* Swiper */}
                <Swiper
                    modules={[Navigation]}
                    navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}
                    spaceBetween={24}
                    slidesPerView={1.5}
                    breakpoints={{
                        480: { slidesPerView: 2, spaceBetween: 20 },
                        640: { slidesPerView: 3, spaceBetween: 20 },
                        768: { slidesPerView: 4, spaceBetween: 20 },
                        1024: { slidesPerView: 5, spaceBetween: 24 },
                        1280: { slidesPerView: 6, spaceBetween: 24 },
                        1536: { slidesPerView: 7, spaceBetween: 28 },
                    }}
                    className="!overflow-visible"
                >
                    {movies.slice(0, 10).map((movie, index) => (
                        <SwiperSlide key={movie._id} className="group">
                            <Link 
                                to={`/phim/${movie.slug}`} 
                                className="block relative h-[240px] transition-transform duration-500 ease-out
                                         hover:scale-105 hover:-translate-y-2"
                            >
                                {/* Ranking Number - Large stroke style */}
                                <div className="absolute -left-3 -top-4 z-20 pointer-events-none">
                                    <svg 
                                        viewBox="0 0 80 120" 
                                        className="w-20 h-auto drop-shadow-2xl"
                                        style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' }}
                                    >
                                        <defs>
                                            <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" style={{ stopColor: '#1e293b', stopOpacity: 1 }} />
                                                <stop offset="100%" style={{ stopColor: '#0f172a', stopOpacity: 1 }} />
                                            </linearGradient>
                                        </defs>
                                        <text 
                                            x="5" 
                                            y="90" 
                                            fill={`url(#gradient-${index})`}
                                            stroke="#374151"
                                            strokeWidth="3"
                                            fontSize="110" 
                                            fontWeight="900" 
                                            fontStyle="italic"
                                            className="transition-all duration-300"
                                            style={{ 
                                                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                                                paintOrder: 'stroke fill'
                                            }}
                                        >
                                            {index + 1}
                                        </text>
                                        {/* Gradient stroke on hover */}
                                        <text 
                                            x="5" 
                                            y="90" 
                                            fill="none"
                                            stroke="url(#gradient-stroke)"
                                            strokeWidth="3"
                                            fontSize="110" 
                                            fontWeight="900" 
                                            fontStyle="italic"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                                        >
                                            {index + 1}
                                        </text>
                                        <defs>
                                            <linearGradient id="gradient-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
                                                <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                {/* Poster card */}
                                <div className="relative ml-8 h-full rounded-xl overflow-hidden border border-white/10 
                                              shadow-2xl bg-slate-800 group-hover:shadow-red-500/20 transition-all duration-500
                                              group-hover:border-red-500/30">
                                    {/* Glow effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-transparent to-transparent 
                                                  opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                                    
                                    {/* Image */}
                                    <img 
                                        src={getImageUrl(movie.poster_url || movie.thumb_url)} 
                                        alt={movie.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 
                                                 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    
                                    {/* Gradient overlay at bottom */}
                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"></div>
                                    
                                    {/* Episode badge - top right */}
                                    <div className="absolute top-3 right-3 z-20">
                                        <div className="px-3 py-1.5 rounded-md bg-gradient-to-br from-red-600 to-orange-600 
                                                      text-white text-xs font-bold shadow-lg backdrop-blur-sm
                                                      border border-white/20 group-hover:scale-110 transition-transform duration-300">
                                            {movie.episode_current || 'Full'}
                                        </div>
                                    </div>
                                    
                                    {/* Quality badge - top left */}
                                    <div className="absolute top-3 left-3 z-20">
                                        <div className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm
                                                      text-white text-xs font-semibold border border-white/20">
                                            HD
                                        </div>
                                    </div>
                                    
                                    {/* Movie info on hover */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 z-20 translate-y-2 opacity-0 
                                                  group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <h4 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
                                            {movie.name}
                                        </h4>
                                        {movie.origin_name && (
                                            <p className="text-gray-400 text-xs line-clamp-1">
                                                {movie.origin_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Ranking badge - bottom of card */}
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 
                                              opacity-0 group-hover:opacity-100 transition-all duration-300
                                              group-hover:-translate-y-1">
                                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-orange-600 
                                                  text-white text-xs font-bold shadow-xl border border-white/30">
                                        #{index + 1}
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
            `}</style>
        </section>
    );
};

export default Top10Slider;