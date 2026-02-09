import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetcher, getImageUrl } from '../utils/api';
import { Play, Clock, Calendar, Globe, Star, Video, X } from 'lucide-react';

const DetailPage = () => {
    const { slug } = useParams();
    const [movie, setMovie] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        setMovie(null);
        fetcher(`/phim/${slug}`).then(res => {
            if(res?.status === 'success') {
                setMovie(res.data.item);
                document.title = `${res.data.item.name} - Sọt Phim`;
            }
        });
        window.scrollTo(0,0);
    }, [slug]);

    if (!movie) return <div className="min-h-screen flex items-center justify-center bg-[#080B1D]"><div className="w-12 h-12 border-4 border-red-600 rounded-full animate-spin border-t-transparent"></div></div>;

    // --- LOGIC KIỂM TRA MỚI (CHẶT CHẼ HƠN) ---
    const episodeList = movie.episodes?.[0]?.server_data || [];
    const firstEp = episodeList[0];
    const status = movie.episode_current ? movie.episode_current.toLowerCase() : '';
    const trailerId = movie.trailer_url?.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^&?]*)/)?.[1];
    
    // Điều kiện ẩn nút Xem Phim:
    // 1. Danh sách tập rỗng.
    // 2. Trạng thái phim chứa chữ "trailer" hoặc "sắp chiếu".
    // 3. Tên tập đầu tiên là "trailer".
    const isNotPlayable = 
        episodeList.length === 0 || 
        status.includes('trailer') || 
        status.includes('sắp chiếu') ||
        (firstEp && firstEp.name.toLowerCase().includes('trailer'));

    const rating = movie.tmdb?.vote_average || movie.imdb?.vote_average || 8.5;
    const voteCount = movie.tmdb?.vote_count || movie.imdb?.vote_count || 100;

    return (
        <div className="bg-[#080B1D] min-h-screen pb-20 font-sans text-gray-300">
            
            {/* 1. BACKGROUND */}
            <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
                <img 
                    src={getImageUrl(movie.poster_url || movie.thumb_url)} 
                    className="w-full h-full object-cover blur-sm opacity-40 scale-105" 
                    alt="cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B1D] via-[#080B1D]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#080B1D]/60 via-transparent to-transparent"></div>
            </div>

            {/* 2. MAIN CONTENT */}
            <div className="container mx-auto px-4 md:px-8 lg:px-16 -mt-[40vh] md:-mt-[45vh] relative z-10">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    
                    {/* POSTER */}
                    <div className="w-[220px] md:w-[300px] lg:w-[340px] mx-auto md:mx-0 flex-shrink-0">
                        <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group">
                            <img 
                                src={getImageUrl(movie.thumb_url)} 
                                className="w-full h-full object-cover aspect-[2/3] transition-transform duration-700 group-hover:scale-105" 
                                alt={movie.name} 
                            />
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
                                    {movie.quality}
                                </span>
                                <span className="bg-yellow-500 text-black text-xs font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
                                    {movie.lang}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* INFO */}
                    <div className="flex-1 pt-2 md:pt-10 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 leading-tight drop-shadow-xl">
                            {movie.name}
                        </h1>
                        <h2 className="text-lg md:text-xl text-gray-400 mb-6 font-medium italic">
                            {movie.origin_name} ({movie.year})
                        </h2>

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-8">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span className="text-white font-bold text-lg">{rating.toFixed(1)}</span>
                                <span className="text-gray-500 text-xs">({voteCount} votes)</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-red-500"/> {movie.time}</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-red-500"/> {movie.year}</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span className="flex items-center gap-1"><Globe className="w-4 h-4 text-red-500"/> {movie.country?.[0]?.name}</span>
                            </div>
                        </div>

                        {/* --- NÚT BẤM (Đã sửa logic) --- */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10">
                            
                            {/* Nếu KHÔNG phải là (Trailer/Sắp Chiếu/Rỗng) -> Hiện nút Xem Ngay */}
                            {!isNotPlayable ? (
                                <Link 
                                    to={`/xem-phim/${movie.slug}?tap=${firstEp.slug}`}
                                    className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all shadow-lg shadow-red-600/30 hover:scale-105 hover:shadow-red-600/50"
                                >
                                    <div className="bg-white text-red-600 rounded-full p-1 group-hover:scale-110 transition-transform">
                                        <Play className="w-4 h-4 fill-current" />
                                    </div>
                                    <span className="text-lg">XEM NGAY</span>
                                </Link>
                            ) : (
                                /* Ngược lại -> Hiện nút Sắp Chiếu (Disable) */
                                <button disabled className="bg-gray-800/80 text-gray-400 px-8 py-4 rounded-full font-bold flex items-center gap-3 cursor-not-allowed border border-white/10">
                                    <Clock className="w-5 h-5" />
                                    <span className="text-lg">SẮP CHIẾU</span>
                                </button>
                            )}

                            {trailerId && (
                                <button 
                                    onClick={() => setShowTrailer(true)}
                                    className="group bg-white/10 hover:bg-white text-white hover:text-black px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all backdrop-blur-md border border-white/20 hover:border-white"
                                >
                                    <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="text-lg">TRAILER</span>
                                </button>
                            )}
                        </div>

                        {/* CONTENT BOX */}
                        <div className="bg-[#131728] p-6 md:p-8 rounded-2xl border border-white/5 shadow-inner">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {movie.category?.map(cat => (
                                    <Link key={cat.id} to={`/the-loai/${cat.slug}`} className="text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded transition-colors">
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="mb-6">
                                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2 uppercase tracking-wide border-l-4 border-red-600 pl-3">
                                    Nội Dung Phim
                                </h3>
                                <div 
                                    className="text-gray-400 leading-7 text-justify text-sm md:text-base font-light" 
                                    dangerouslySetInnerHTML={{__html: movie.content}} 
                                />
                            </div>

                            <div>
                                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2 uppercase tracking-wide border-l-4 border-blue-600 pl-3">
                                    Diễn Viên
                                </h3>
                                <p className="text-gray-400 text-sm leading-6">
                                    {movie.actor?.length ? movie.actor.join(', ') : 'Đang cập nhật'}
                                </p>
                            </div>
                        </div>

                        {/* LIST TẬP (Chỉ hiện khi xem được) */}
                        {!isNotPlayable && movie.episodes?.length > 0 && (
                            <div className="mt-8 bg-[#131728] p-6 rounded-2xl border border-white/5">
                                {movie.episodes.map((server, idx) => (
                                    <div key={idx} className="mb-4 last:mb-0">
                                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{server.server_name}</p>
                                        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2">
                                            {server.server_data.map(ep => (
                                                <Link 
                                                    key={ep.slug}
                                                    to={`/xem-phim/${movie.slug}?tap=${ep.slug}`}
                                                    className="bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white text-center py-2 rounded text-xs font-bold transition-colors truncate border border-white/5"
                                                    title={ep.name}
                                                >
                                                    {ep.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* TRAILER MODAL */}
            {showTrailer && trailerId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-fade-in backdrop-blur-sm">
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                        <button onClick={() => setShowTrailer(false)} className="absolute top-4 right-4 text-white bg-black/50 hover:bg-red-600 p-2 rounded-full transition z-10">
                            <X className="w-6 h-6" />
                        </button>
                        <iframe 
                            src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
                            title="Trailer"
                            className="w-full h-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailPage;