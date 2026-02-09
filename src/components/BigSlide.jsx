import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Thumbs, FreeMode, Navigation } from 'swiper/modules'; // Import Navigation
import { Play, Star, ChevronRight } from 'lucide-react';
import { getImageUrl, getTmdbImage } from '../utils/api';

// Import CSS
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

const BigSlide = ({ title, movies }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    if (!movies || movies.length === 0) return null;

    return (
        <section className="mt-20 mb-12 px-4 md:px-0 animate-fade-in relative z-20 pb-10">
            
            {/* Header Section */}
            <div className="container mx-auto px-4 lg:px-16 mb-6 flex justify-between items-center border-b border-white/10 pb-3">
                <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 uppercase tracking-wide drop-shadow-sm">
                    {title}
                </h2>
                <Link to="/danh-sach/hoat-hinh" className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-1 transition-colors">
                    Xem thêm <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* --- MAIN SLIDER (LỚN) --- */}
            <div className="w-full relative bg-[#050714] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                <Swiper
                    loop={true}
                    spaceBetween={0}
                    effect={'fade'}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs, EffectFade, Autoplay]}
                    className="w-full h-[500px] md:h-[600px] big-slide-main"
                >
                    {movies.slice(0, 10).map((movie) => (
                        <SwiperSlide key={movie._id}>
                            <div className="relative w-full h-full flex items-center">
                                
                                {/* 1. Background Blur (Lớp nền mờ ảo) */}
                                <div className="absolute inset-0">
                                    <img 
                                        src={getTmdbImage(movie.backdrop_path) || getImageUrl(movie.poster_url)} 
                                        alt="bg" 
                                        className="w-full h-full object-cover blur-lg opacity-40 scale-110"
                                    />
                                    {/* Overlay Gradient tối màu để làm nổi bật chữ */}
                                    <div className="absolute inset-0 bg-[#080B1D]/80 mix-blend-multiply"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#080B1D] via-[#080B1D]/60 to-transparent"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#080B1D] via-transparent to-transparent"></div>
                                </div>

                                {/* 2. Content Chính */}
                                <div className="container mx-auto px-4 lg:px-24 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
                                    
                                    {/* Cột Trái: Poster (Nghiêng nhẹ nghệ thuật) */}
                                    <div className="hidden md:block md:col-span-4 lg:col-span-3">
                                        <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.4)] border-2 border-white/10 transform -rotate-3 hover:rotate-0 transition-transform duration-500 ease-out origin-bottom-right group">
                                            <img 
                                                src={getImageUrl(movie.poster_url || movie.thumb_url)} 
                                                alt={movie.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    </div>

                                    {/* Cột Phải: Thông tin phim */}
                                    <div className="col-span-1 md:col-span-8 lg:col-span-9 text-center md:text-left pt-10 md:pt-0">
                                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 leading-tight drop-shadow-2xl uppercase tracking-tight">
                                            {movie.name}
                                        </h2>
                                        <h3 className="text-lg md:text-xl text-gray-300 mb-6 font-medium italic opacity-80">
                                            {movie.origin_name} ({movie.year})
                                        </h3>

                                        {/* Tags: Điểm số, Chất lượng... */}
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                                            <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-sm">
                                                <Star className="w-4 h-4 fill-current" /> 
                                                {movie.tmdb?.vote_average || 8.5}
                                            </div>
                                            <span className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-sm font-bold border border-white/10 backdrop-blur-sm">
                                                {movie.quality || 'HD'}
                                            </span>
                                            <span className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg shadow-red-600/20">
                                                {movie.episode_current || 'Full'}
                                            </span>
                                        </div>

                                        {/* Thể loại */}
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                                            {movie.category?.slice(0, 4).map((cat) => (
                                                <span key={cat.id} className="text-gray-400 text-xs border border-white/10 bg-black/20 px-3 py-1.5 rounded-full hover:bg-white hover:text-black transition cursor-default">
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Mô tả (Chỉ hiện trên PC để đỡ rối) */}
                                        <p className="hidden md:block text-gray-300 text-base leading-relaxed mb-8 line-clamp-3 md:w-3/4 opacity-90 font-light">
                                            {movie.content ? movie.content.replace(/<[^>]+>/g, '') : 'Đang cập nhật nội dung...'}
                                        </p>

                                        {/* Nút Xem Ngay */}
                                        <div className="flex justify-center md:justify-start">
                                            <Link 
                                                to={`/phim/${movie.slug}`} 
                                                className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-10 py-4 rounded-full font-black flex items-center gap-3 shadow-xl shadow-red-900/40 transition-all transform hover:scale-105 hover:-translate-y-1"
                                            >
                                                <div className="bg-white text-red-600 rounded-full p-1 group-hover:rotate-12 transition-transform">
                                                    <Play className="w-4 h-4 fill-current" /> 
                                                </div>
                                                XEM NGAY
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* --- THUMBNAIL SLIDER (MENU BÊN DƯỚI) --- */}
            {/* Đẩy lên âm margin (-mt) để đè lên phần dưới của slider lớn */}
            <div className="container mx-auto px-4 lg:px-24 -mt-16 relative z-30">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={true}
                    spaceBetween={12}
                    slidesPerView={3}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    breakpoints={{
                        640: { slidesPerView: 4, spaceBetween: 12 },
                        768: { slidesPerView: 5, spaceBetween: 16 },
                        1024: { slidesPerView: 6, spaceBetween: 20 },
                        1280: { slidesPerView: 7, spaceBetween: 20 },
                    }}
                    className="thumbs-swiper !overflow-visible" // Quan trọng: Để bóng đổ không bị cắt
                >
                    {movies.slice(0, 10).map((movie) => (
                        <SwiperSlide key={movie._id} className="cursor-pointer group !h-auto pt-4"> {/* pt-4 để có chỗ cho hiệu ứng hover lên */}
                            <div className="aspect-[2/3] rounded-lg overflow-hidden border-2 border-white/20 group-[.swiper-slide-thumb-active]:border-red-500 transition-all duration-300 shadow-xl bg-black transform group-[.swiper-slide-thumb-active]:-translate-y-4 group-[.swiper-slide-thumb-active]:scale-110 group-hover:-translate-y-2">
                                <img 
                                    src={getImageUrl(movie.thumb_url)} 
                                    alt={movie.name}
                                    className="w-full h-full object-cover opacity-50 group-[.swiper-slide-thumb-active]:opacity-100 group-hover:opacity-100 transition-opacity duration-300"
                                />
                                {/* Overlay icon play nhỏ */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-[.swiper-slide-thumb-active]:opacity-100 transition-opacity">
                                    <div className="bg-red-600/80 rounded-full p-1.5 shadow-lg backdrop-blur-sm">
                                        <Play className="w-3 h-3 fill-white text-white" />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default BigSlide;