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
        <section className="mb-16 pt-8 pb-12 px-4 md:px-8 lg:px-16 animate-fade-in relative">
            {/* Background riêng cho Top 10 để tách biệt */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#080b1d] -z-10"></div>
            
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase flex items-center gap-3">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 text-5xl font-mono italic">TOP 10</span>
                    <span className="border-l-2 border-white/20 pl-3">{title}</span>
                </h2>
                <div className="flex gap-2">
                    <button ref={prevRef} className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-600 text-white flex items-center justify-center transition disabled:opacity-30 border border-white/10"><ChevronLeft className="w-6 h-6" /></button>
                    <button ref={nextRef} className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-600 text-white flex items-center justify-center transition disabled:opacity-30 border border-white/10"><ChevronRight className="w-6 h-6" /></button>
                </div>
            </div>

            <Swiper
                modules={[Navigation]}
                navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                }}
                spaceBetween={20}
                slidesPerView={1.2}
                breakpoints={{
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3.5 },
                    1280: { slidesPerView: 4.5 },
                }}
                className="!overflow-visible px-2"
            >
                {movies.slice(0, 10).map((movie, index) => (
                    <SwiperSlide key={movie._id} className="pt-8 group">
                        <Link to={`/phim/${movie.slug}`} className="flex items-end relative h-[280px]">
                            
                            {/* SỐ THỨ HẠNG (SVG để viền đẹp hơn) */}
                            <svg viewBox="0 0 100 150" className="h-full w-auto absolute -left-6 md:-left-12 bottom-0 z-10 drop-shadow-2xl">
                                <text x="0" y="130" 
                                      fill="#080B1D" 
                                      stroke="#666" 
                                      strokeWidth="3" 
                                      fontSize="150" 
                                      fontWeight="900" 
                                      fontStyle="italic"
                                      className="group-hover:stroke-red-600 transition-colors duration-300"
                                >
                                    {index + 1}
                                </text>
                            </svg>

                            {/* POSTER (Đẩy sang phải để nhường chỗ cho số) */}
                            <div className="relative w-full ml-12 md:ml-20 h-[85%] rounded-lg overflow-hidden border border-white/10 shadow-lg group-hover:scale-105 group-hover:-translate-y-4 transition-transform duration-300 bg-[#1a1d2e]">
                                <img 
                                    src={getImageUrl(movie.poster_url || movie.thumb_url)} 
                                    alt={movie.name} 
                                    className="w-full h-full object-cover"
                                />
                                {/* Nhãn Tập */}
                                <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md">
                                    {movie.episode_current || 'Full'}
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Top10Slider;