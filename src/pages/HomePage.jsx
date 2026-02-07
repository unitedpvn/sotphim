import React, { useEffect, useState } from 'react';
import { fetcher, getImageUrl, getTmdbImage } from '../utils/api';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';
import { Play, History, ChevronRight, Info } from 'lucide-react';

const CategorySection = ({ title, slug }) => {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        fetcher(`/danh-sach/${slug}?limit=12`).then(res => setMovies(res?.data?.items || []));
    }, [slug]);

    if (movies.length === 0) return null;

    return (
        <section className="mb-10">
            <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-lg md:text-xl font-black text-white uppercase border-l-4 border-red-600 pl-3">
                    {title}
                </h2>
                <Link to={`/danh-sach/${slug}`} className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-white transition">
                    Xem tất cả <ChevronRight className="w-3 h-3" />
                </Link>
            </div>
            {/* ĐÃ SỬA: gap-2 cho mobile, gap-4 cho PC (Gần nhau hơn) */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                {movies.map(movie => <MovieCard key={movie._id} movie={movie} />)}
            </div>
        </section>
    );
};

const HomePage = () => {
    const [bannerMovies, setBannerMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [historyList, setHistoryList] = useState([]);

    useEffect(() => {
        document.title = "Sọt Phim - Xem phim online miễn phí";
        const loadData = async () => {
            const res = await fetcher('/danh-sach/phim-moi?limit=5');
            if (res?.data?.items) {
                const movies = res.data.items;
                const fullMovies = await Promise.all(movies.map(async (movie) => {
                    try {
                        const imgRes = await fetcher(`/phim/${movie.slug}/images`);
                        const backdrop = imgRes?.data?.images?.find(img => img.type === 'backdrop')?.file_path;
                        return { ...movie, backdrop_path: backdrop };
                    } catch (e) {
                        return movie;
                    }
                }));
                setBannerMovies(fullMovies);
            }
        };
        loadData();
        setHistoryList(JSON.parse(localStorage.getItem('watch_history_list')) || []);
    }, []);

    useEffect(() => {
        if (bannerMovies.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % bannerMovies.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [bannerMovies]);

    const currentMovie = bannerMovies[currentIndex];

    return (
        <div className="pb-10 max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
            {/* HERO BANNER */}
            <div className="mt-4 mb-10">
                {currentMovie && (
                    <div className="relative w-full h-[220px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-2xl group border border-gray-800">
                        <img 
                            src={getTmdbImage(currentMovie.backdrop_path) || getImageUrl(currentMovie.thumb_url)} 
                            alt={currentMovie.name}
                            className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/40 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 p-4 md:p-12 w-full md:w-2/3 z-10">
                            <span className="bg-red-600 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded mb-3 inline-block uppercase shadow-lg">
                                Top Đề Cử
                            </span>
                            
                            <h1 className="text-xl md:text-5xl font-black text-white mb-2 leading-tight drop-shadow-2xl line-clamp-2">
                                {currentMovie.name}
                            </h1>
                            <p className="text-gray-300 text-xs md:text-lg mb-4 font-medium italic hidden md:block">
                                {currentMovie.origin_name}
                            </p>
                            
                            <div className="flex gap-3">
                                <Link 
                                    to={`/phim/${currentMovie.slug}`}
                                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 md:px-8 md:py-3 rounded-full font-bold flex items-center gap-2 transition text-xs md:text-base shadow-lg shadow-red-600/30"
                                >
                                    <Play className="fill-white w-3 h-3 md:w-5 md:h-5" /> XEM NGAY
                                </Link>
                                <Link 
                                    to={`/phim/${currentMovie.slug}`}
                                    className="bg-gray-800/80 hover:bg-white hover:text-black text-white px-5 py-2 md:px-8 md:py-3 rounded-full font-bold flex items-center gap-2 transition text-xs md:text-base border border-gray-600 backdrop-blur-sm"
                                >
                                    <Info className="w-3 h-3 md:w-5 md:h-5" /> CHI TIẾT
                                </Link>
                            </div>
                        </div>
                        
                        <div className="absolute bottom-4 right-4 flex gap-1.5">
                            {bannerMovies.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-red-600 w-6' : 'bg-gray-600 w-1.5'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* LỊCH SỬ XEM */}
            {historyList.length > 0 && (
                <section className="mb-10">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                        <History className="text-red-500 w-5 h-5" />
                        <h2 className="text-lg md:text-xl font-bold text-white uppercase">Tiếp Tục Xem</h2>
                    </div>
                    {/* Gap nhỏ hơn */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                        {historyList.map(movie => <MovieCard key={movie.slug} movie={movie} />)}
                    </div>
                </section>
            )}

            <CategorySection title="Phim Mới Cập Nhật" slug="phim-moi" />
            <CategorySection title="Phim Bộ Hot" slug="phim-bo" />
            <CategorySection title="Phim Lẻ Hay" slug="phim-le" />
            <CategorySection title="Hoạt Hình" slug="hoat-hinh" />
        </div>
    );
};

export default HomePage;