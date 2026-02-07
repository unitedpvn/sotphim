import React, { useEffect, useState } from 'react';
import { fetcher, getImageUrl } from '../utils/api';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';
import { Play, History, ChevronRight } from 'lucide-react';

const CategorySection = ({ title, slug }) => {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        fetcher(`/danh-sach/${slug}?limit=12`).then(res => { 
            // Lấy ít phim hơn 1 chút (12 phim = 2 hàng) để trang chủ load nhanh và đỡ rối
            setMovies(res?.data?.items || []);
        });
    }, [slug]);

    if (movies.length === 0) return null;

    return (
        <section className="mb-16 container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                {/* Tiêu đề to và nổi bật hơn */}
                <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-wide border-l-4 border-red-600 pl-4">
                    {title}
                </h2>
                
                {/* Nút Xem thêm nổi bật */}
                <Link 
                    to={`/danh-sach/${slug}`} 
                    className="group flex items-center gap-1 text-xs md:text-sm font-bold text-gray-400 hover:text-white bg-gray-900 hover:bg-red-600 px-4 py-2 rounded-full transition-all duration-300"
                >
                    XEM THÊM <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Grid thoáng hơn (gap-6) */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {movies.map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>
        </section>
    );
};

const HomePage = () => {
    const [bannerMovie, setBannerMovie] = useState(null);
    const [historyList, setHistoryList] = useState([]);

    useEffect(() => {
        fetcher('/home').then(res => {
            if (res?.data?.items?.length > 0) {
                const random = Math.floor(Math.random() * 6);
                setBannerMovie(res.data.items[random]);
            }
        });

        const history = JSON.parse(localStorage.getItem('watch_history_list')) || [];
        setHistoryList(history);
    }, []);

    return (
        <div className="pb-20">
            {/* HERO BANNER - Giữ nguyên vẻ đẹp */}
            {bannerMovie && (
                <div className="relative w-full h-[60vh] md:h-[85vh] mb-12 group">
                    <div className="absolute inset-0">
                        <img 
                            src={getImageUrl(bannerMovie.poster_url || bannerMovie.thumb_url)} 
                            alt={bannerMovie.name}
                            className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/30 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-black/40 to-transparent"></div>
                    </div>

                    <div className="absolute bottom-0 left-0 p-6 md:p-16 w-full md:w-2/3 z-10">
                        <span className="bg-red-600 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded mb-4 inline-block uppercase tracking-wider shadow-lg shadow-red-600/50">
                            Phim Đề Cử
                        </span>
                        <h1 className="text-3xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
                            {bannerMovie.name}
                        </h1>
                        <p className="text-gray-200 text-sm md:text-lg mb-8 line-clamp-3 font-medium drop-shadow-md w-full md:w-3/4">
                            {bannerMovie.content ? bannerMovie.content.replace(/<[^>]+>/g, '') : `${bannerMovie.origin_name} (${bannerMovie.year})`}
                        </p>
                        <div className="flex gap-4">
                            <Link 
                                to={`/phim/${bannerMovie.slug}`}
                                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 transition transform hover:scale-105 shadow-xl shadow-red-600/30"
                            >
                                <Play className="fill-white w-5 h-5" />
                                XEM NGAY
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* LỊCH SỬ XEM */}
            {historyList.length > 0 && (
                <section className="mb-16 container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                        <div className="p-2 bg-red-600/20 rounded-full">
                            <History className="text-red-500 w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                            Phim Đã Xem
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {historyList.map(movie => (
                            <MovieCard key={movie.slug} movie={movie} />
                        ))}
                    </div>
                </section>
            )}

            {/* CÁC LIST PHIM */}
            <CategorySection title="Phim Mới Cập Nhật" slug="phim-moi" />
            <CategorySection title="Phim Bộ Thịnh Hành" slug="phim-bo" />
            <CategorySection title="Phim Lẻ Đặc Sắc" slug="phim-le" />
            <CategorySection title="Hoạt Hình - Anime" slug="hoat-hinh" />
            <CategorySection title="TV Shows" slug="tv-shows" />
        </div>
    );
};

export default HomePage;