import React, { useEffect, useState } from 'react';
import { fetcher, getImageUrl, getTmdbImage } from '../utils/api';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import MovieSlider from '../components/MovieSlider';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const HomePage = () => {
    const [bannerMovies, setBannerMovies] = useState([]);
    const [categories, setCategories] = useState({
        phimMoi: [], phimBo: [], phimLe: [], hoatHinh: [], tvShows: [],
        hanQuoc: [], trungQuoc: [], auMy: []
    });

    useEffect(() => {
        document.title = "Sọt Phim - Xem phim online miễn phí";
        const loadData = async () => {
            // Banner
            const bannerRes = await fetcher('/danh-sach/phim-moi?limit=6');
            if (bannerRes?.data?.items) {
                const movies = await Promise.all(bannerRes.data.items.map(async (m) => {
                    const imgRes = await fetcher(`/phim/${m.slug}/images`);
                    const backdrop = imgRes?.data?.images?.find(img => img.type === 'backdrop')?.file_path;
                    return { ...m, backdrop_path: backdrop };
                }));
                setBannerMovies(movies);
            }

            // Categories
            const [moi, bo, le, hh, tv, han, trung, aumy] = await Promise.all([
                fetcher('/danh-sach/phim-moi?limit=12'),
                fetcher('/danh-sach/phim-bo?limit=12'),
                fetcher('/danh-sach/phim-le?limit=12'),
                fetcher('/danh-sach/hoat-hinh?limit=12'),
                fetcher('/danh-sach/tv-shows?limit=12'),
                fetcher('/quoc-gia/han-quoc?limit=12'),
                fetcher('/quoc-gia/trung-quoc?limit=12'),
                fetcher('/quoc-gia/au-my?limit=12'),
            ]);

            setCategories({
                phimMoi: moi?.data?.items || [],
                phimBo: bo?.data?.items || [],
                phimLe: le?.data?.items || [],
                hoatHinh: hh?.data?.items || [],
                tvShows: tv?.data?.items || [],
                hanQuoc: han?.data?.items || [],
                trungQuoc: trung?.data?.items || [],
                auMy: aumy?.data?.items || [],
            });
        };
        loadData();
    }, []);

    // Danh sách 4 chủ đề chính
    const topics = [
        { name: "Hành Động", slug: "hanh-dong", color: "from-blue-600 to-blue-900" },
        { name: "Tình Cảm", slug: "tinh-cam", color: "from-pink-500 to-rose-900" },
        { name: "Cổ Trang", slug: "co-trang", color: "from-orange-500 to-red-900" },
        { name: "Hoạt Hình", slug: "hoat-hinh", color: "from-green-500 to-emerald-900" },
    ];

    return (
        <div className="pb-20 bg-[#080B1D]">
            
            {/* HERO BANNER */}
            <div className="relative w-full h-[50vh] md:h-[85vh] mb-12 group">
                <Swiper
                    modules={[Autoplay, EffectFade, Pagination]}
                    effect="fade"
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    loop={true}
                    className="w-full h-full"
                >
                    {bannerMovies.map((movie) => (
                        <SwiperSlide key={movie._id}>
                            <div className="relative w-full h-full">
                                <img 
                                    src={getTmdbImage(movie.backdrop_path) || getImageUrl(movie.poster_url)} 
                                    alt={movie.name}
                                    className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080B1D] via-[#080B1D]/20 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#080B1D] via-[#080B1D]/60 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 lg:p-24 flex flex-col justify-end h-full z-10">
                                    <div className="max-w-4xl animate-fade-in-up">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="bg-red-600 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded shadow-lg shadow-red-600/40">HOT</span>
                                            <span className="text-yellow-400 font-bold flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400" /> {movie.year}</span>
                                            <span className="text-white/80 border border-white/20 px-2 py-0.5 rounded text-xs">{movie.quality}</span>
                                        </div>
                                        <h1 className="text-3xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-2xl">{movie.name}</h1>
                                        <p className="text-gray-300 text-sm md:text-xl font-medium italic mb-8 line-clamp-2 md:w-3/4">{movie.origin_name}</p>
                                        <div className="flex gap-4">
                                            <Link to={`/phim/${movie.slug}`} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 transition transform hover:scale-105 shadow-xl shadow-red-600/30">
                                                <Play className="fill-white w-5 h-5" /> XEM NGAY
                                            </Link>
                                            <Link to={`/phim/${movie.slug}`} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 transition backdrop-blur-md border border-white/10">
                                                <Info className="w-5 h-5" /> CHI TIẾT
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* TOPIC GRID */}
            <div className="container mx-auto px-4 md:px-8 lg:px-12 mb-16">
                <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-red-600 pl-3">Bạn đang quan tâm gì?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {topics.map((topic, index) => (
                        <Link key={index} to={`/the-loai/${topic.slug}`} className="relative h-28 rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:-translate-y-1 transition-transform">
                            <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-80 group-hover:opacity-100 transition-all`}></div>
                            <span className="absolute inset-0 flex items-center justify-center font-black text-white text-lg z-10 drop-shadow-md uppercase tracking-wide">{topic.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* LIST PHIM (Gradient chuẩn Rổ Phim) */}
            <div className="flex flex-col gap-8">
                <MovieSlider 
                    title="Phim Hàn Quốc Mới" 
                    movies={categories.hanQuoc} 
                    slug="han-quoc" 
                    gradient="linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(103, 65, 150) 130%)" // Tím trắng
                />
                
                <MovieSlider 
                    title="Phim Trung Quốc Mới" 
                    movies={categories.trungQuoc} 
                    slug="trung-quoc" 
                    gradient="linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(247, 161, 11) 130%)" // Cam trắng
                />

                <MovieSlider 
                    title="Phim Âu Mỹ Mới" 
                    movies={categories.auMy} 
                    slug="au-my" 
                    gradient="linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(11, 161, 247) 130%)" // Xanh trắng
                />

                <MovieSlider 
                    title="Phim Hoạt Hình" 
                    movies={categories.hoatHinh} 
                    slug="hoat-hinh" 
                    gradient="linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(16, 185, 129) 130%)" // Xanh lá trắng
                />

                 <MovieSlider 
                    title="TV Shows" 
                    movies={categories.tvShows} 
                    slug="tv-shows" 
                    gradient="linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(236, 72, 153) 130%)" // Hồng trắng
                />
            </div>
        </div>
    );
};

export default HomePage;