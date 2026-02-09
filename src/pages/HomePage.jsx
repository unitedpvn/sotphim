import React, { useEffect, useState } from 'react';
import { fetcher, getImageUrl, getTmdbImage } from '../utils/api';
import { Link } from 'react-router-dom';
import { Play, Info, Star, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';

import MovieSlider from '../components/MovieSlider';
import Top10Slider from '../components/Top10Slider';
import MovieCard from '../components/MovieCard';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Slider đơn giản (Dưới cùng)
const SimpleSlider = ({ title, movies, slug, iconColor = "border-red-600" }) => {
    if (!movies || movies.length === 0) return null;
    return (
        <section className="mb-12 px-4 md:px-8 lg:px-16 animate-fade-in relative z-20">
            <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
                <h2 className={`text-xl md:text-2xl font-bold text-white border-l-4 ${iconColor} pl-3 uppercase tracking-wider`}>{title}</h2>
                <Link to={`/danh-sach/${slug}`} className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full transition">Xem thêm <ChevronRight className="w-3 h-3"/></Link>
            </div>
            <Swiper modules={[Navigation]} navigation spaceBetween={12} slidesPerView={2.3} breakpoints={{ 640: { slidesPerView: 3.3 }, 1024: { slidesPerView: 5.3 }, 1280: { slidesPerView: 6.3 } }}>
                {movies.map(movie => (<SwiperSlide key={movie._id} className="!h-auto"><MovieCard movie={movie} /></SwiperSlide>))}
            </Swiper>
        </section>
    );
};

const HomePage = () => {
    const [data, setData] = useState({ banner: [], moi: [], bo: [], le: [], hh: [], tv: [], han: [], trung: [], aumy: [], rap: [], sap: [] });

    useEffect(() => {
        document.title = "Sọt Phim - Xem phim online miễn phí";
        const load = async () => {
            const [banner, moi, bo, le, hh, tv, han, trung, aumy, rap, sap] = await Promise.all([
                fetcher('/danh-sach/phim-moi?limit=6'),
                fetcher('/danh-sach/phim-moi?limit=12'), fetcher('/danh-sach/phim-bo?limit=12'), fetcher('/danh-sach/phim-le?limit=12'),
                fetcher('/danh-sach/hoat-hinh?limit=12'), fetcher('/danh-sach/tv-shows?limit=12'), fetcher('/quoc-gia/han-quoc?limit=12'),
                fetcher('/quoc-gia/trung-quoc?limit=12'), fetcher('/quoc-gia/au-my?limit=12'), fetcher('/danh-sach/phim-chieu-rap?limit=12'),
                fetcher('/danh-sach/phim-sap-chieu?limit=12'),
            ]);
            
            // Xử lý ảnh banner
            let bannerItems = banner?.data?.items || [];
            bannerItems = await Promise.all(bannerItems.map(async (m) => {
                const imgRes = await fetcher(`/phim/${m.slug}/images`);
                const backdrop = imgRes?.data?.images?.find(img => img.type === 'backdrop')?.file_path;
                return { ...m, backdrop_path: backdrop };
            }));

            setData({
                banner: bannerItems, moi: moi?.data?.items, bo: bo?.data?.items, le: le?.data?.items,
                hh: hh?.data?.items, tv: tv?.data?.items, han: han?.data?.items, trung: trung?.data?.items,
                aumy: aumy?.data?.items, rap: rap?.data?.items, sap: sap?.data?.items
            });
        };
        load();
    }, []);

    // FIX MỤC KHÁM PHÁ (Topic)
    const topics = [
        { name: "Short Drama", slug: "short-drama", color: "rgb(50, 79, 209)" },
        { name: "Tình Cảm", slug: "tinh-cam", color: "rgb(102, 102, 153)" },
        { name: "Viễn Tưởng", slug: "vien-tuong", color: "rgb(27, 133, 108)" },
        { name: "Hành Động", slug: "hanh-dong", color: "rgb(119, 97, 180)" },
        { name: "Hài Hước", slug: "hai-huoc", color: "rgb(205, 126, 95)" },
        { name: "Cổ Trang", slug: "co-trang", color: "rgb(167, 57, 57)" },
        { name: "+4 Chủ đề", slug: "xem-chung", color: "rgb(46, 50, 69)" }, // Trỏ tạm về xem-chung hoặc trang nào có data
    ];

    return (
        <div className="pb-20 bg-[#080B1D]">
            {/* HERO BANNER */}
            <div className="relative w-full h-[55vh] md:h-[85vh] mb-10 group">
                <Swiper modules={[Autoplay, EffectFade, Pagination]} effect="fade" autoplay={{ delay: 5000 }} pagination={{ clickable: true }} loop={true} className="w-full h-full">
                    {data.banner.map((movie) => (
                        <SwiperSlide key={movie._id}>
                            <div className="relative w-full h-full">
                                <img src={getTmdbImage(movie.backdrop_path) || getImageUrl(movie.poster_url)} alt={movie.name} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080B1D] via-[#080B1D]/20 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#080B1D] via-[#080B1D]/60 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 lg:p-24 flex flex-col justify-end h-full z-10">
                                    <div className="max-w-4xl animate-fade-in-up">
                                        <div className="flex gap-2 mb-3"><span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">HOT</span><span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded">{movie.year}</span></div>
                                        <h1 className="text-3xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-2xl">{movie.name}</h1>
                                        <div className="flex gap-4">
                                            <Link to={`/phim/${movie.slug}`} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 shadow-lg"><Play className="fill-white w-5 h-5" /> XEM NGAY</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* TOPIC GRID */}
            <div className="container mx-auto px-4 md:px-8 lg:px-16 mb-16">
                <h3 className="text-xl font-bold text-white mb-5 border-l-4 border-blue-500 pl-3">Bạn đang quan tâm gì?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {topics.map((topic, index) => (
                        <Link 
                            key={index} 
                            to={topic.slug === 'xem-chung' ? '/xem-chung' : `/the-loai/${topic.slug}`} 
                            className="relative h-24 rounded-lg overflow-hidden group cursor-pointer shadow-md hover:-translate-y-1 transition-transform block"
                        >
                            <div className="absolute inset-0 transition-opacity" style={{ backgroundColor: topic.color }}></div>
                            <div className="absolute inset-0 p-3 flex flex-col justify-between">
                                <h4 className="text-white font-bold text-sm md:text-base leading-tight uppercase truncate">{topic.name}</h4>
                                <div className="flex items-center gap-1 text-[10px] md:text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                                    <span>Xem chủ đề</span><ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* TOP 10 */}
            <Top10Slider title="Phim Thịnh Hành" movies={data.bo} />

            {/* KHỐI QUỐC GIA & HOẠT HÌNH (GỘP CHUNG - MIX MÀU) */}
            <div className="relative py-12 my-8">
                {/* Background Mix Màu ảo diệu */}
                <div className="absolute inset-0 bg-[#080B1D]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>

                <div className="relative z-10 flex flex-col gap-8">
                    <MovieSlider title="Phim Hàn Quốc" movies={data.han} slug="han-quoc" gradient="linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(103, 65, 150) 130%)" />
                    <MovieSlider title="Phim Trung Quốc" movies={data.trung} slug="trung-quoc" gradient="linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(247, 161, 11) 130%)" />
                    <MovieSlider title="Phim Âu Mỹ" movies={data.aumy} slug="au-my" gradient="linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(11, 161, 247) 130%)" />
                    <MovieSlider title="Hoạt Hình Anime" movies={data.hh} slug="hoat-hinh" gradient="linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(16, 185, 129) 130%)" />
                </div>
            </div>

            {/* MỤC DƯỚI CÙNG */}
            <div className="flex flex-col gap-10 bg-[#0b0e1b] py-10">
                <SimpleSlider title="Phim Mới Cập Nhật" movies={data.moi} slug="phim-moi" iconColor="border-red-500" />
                <SimpleSlider title="Phim Chiếu Rạp" movies={data.rap} slug="phim-chieu-rap" iconColor="border-yellow-500" />
                <SimpleSlider title="Phim Sắp Chiếu" movies={data.sap} slug="phim-sap-chieu" iconColor="border-blue-500" />
            </div>
        </div>
    );
};

export default HomePage;