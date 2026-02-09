import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import MovieCard from './MovieCard';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Import CSS
import 'swiper/css';
import 'swiper/css/navigation';

const MovieSlider = ({ title, movies, slug, gradient }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (!movies || movies.length === 0) return null;

    return (
        <section className="mb-8 md:mb-12 px-4 md:px-8 lg:px-12 animate-fade-in">
            {/* CONTAINER CHÍNH - STYLE RỔ PHIM */}
            <div className="flex flex-col xl:flex-row bg-[#151f30] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                
                {/* 1. CỘT TRÁI (INTRO BOX) */}
                {/* Trên Mobile/Tablet: Nằm ngang. Trên PC rộng (xl): Nằm dọc bên trái */}
                <div className="xl:w-[280px] flex-shrink-0 relative overflow-hidden group">
                    {/* Background Gradient */}
                    <div 
                        className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                        style={{ background: gradient }}
                    ></div>
                    
                    {/* Họa tiết trang trí */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl opacity-50"></div>

                    {/* Nội dung */}
                    <div className="relative z-10 h-full p-6 md:p-8 flex flex-row xl:flex-col justify-between items-center xl:items-start gap-4">
                        <div>
                            <h2 className="text-xl md:text-2xl xl:text-3xl font-black text-white uppercase leading-tight drop-shadow-md tracking-wide">
                                {title}
                            </h2>
                            <div className="hidden xl:block w-12 h-1.5 bg-white/40 rounded-full mt-4"></div>
                        </div>

                        {/* Nút Xem thêm */}
                        <Link 
                            to={`/danh-sach/${slug}`} 
                            className="flex items-center gap-2 text-xs md:text-sm font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 md:px-5 md:py-3 rounded-xl transition-all shadow-sm hover:shadow-md border border-white/10 whitespace-nowrap"
                        >
                            Xem toàn bộ <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* 2. CỘT PHẢI (SLIDER CONTENT) */}
                <div className="flex-1 min-w-0 bg-[#0b0e1b] relative p-4 md:p-6">
                    {/* Nút điều hướng (Góc trên phải) */}
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                        <button ref={prevRef} className="sw-button w-8 h-8 rounded-full bg-gray-800/80 hover:bg-red-600 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm border border-white/10">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button ref={nextRef} className="sw-button w-8 h-8 rounded-full bg-gray-800/80 hover:bg-red-600 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm border border-white/10">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        spaceBetween={14}
                        slidesPerView={2.2} 
                        breakpoints={{
                            640: { slidesPerView: 3.2, spaceBetween: 14 },
                            768: { slidesPerView: 4.2, spaceBetween: 16 },
                            1024: { slidesPerView: 4.5, spaceBetween: 18 },
                            1280: { slidesPerView: 5.2, spaceBetween: 20 }, // Màn hình rộng
                        }}
                        className="w-full h-full pt-8 xl:pt-2 !pb-2" // Thêm padding top để tránh đè nút nav
                    >
                        {movies.map((movie) => (
                            <SwiperSlide key={movie._id} className="!h-auto">
                                <MovieCard movie={movie} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default MovieSlider;