import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetcher, getImageUrl } from '../utils/api';
import { Play, Clock, Calendar, Globe, Users, Film, Star, Video, X } from 'lucide-react';

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
    }, [slug]);

    if (!movie) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const firstEp = movie.episodes?.[0]?.server_data?.[0];
    
    // Lấy ID Trailer Youtube
    const trailerId = movie.trailer_url?.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^&?]*)/)?.[1];
    
    // Lấy điểm số thật
    const rating = movie.tmdb?.vote_average || movie.imdb?.vote_average || 0;
    const votes = movie.tmdb?.vote_count || movie.imdb?.vote_count || 0;

    return (
        <div className="bg-[#111827] pb-10 min-h-screen">
            {/* 1. BACKGROUND BLUR (Giữ lại kiểu cũ sang trọng) */}
            <div className="relative w-full h-[500px]">
                <img 
                    src={getImageUrl(movie.poster_url || movie.thumb_url)} 
                    className="w-full h-full object-cover opacity-30 mask-image-gradient"
                    alt="cover"
                />
                {/* Lớp phủ gradient để làm mờ chân ảnh */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/60 to-transparent"></div>
            </div>

            {/* 2. MAIN CONTENT (Đẩy lên đè background) */}
            <div className="container mx-auto px-4 -mt-[400px] relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* CỘT TRÁI: POSTER & NÚT */}
                    <div className="w-full md:w-[300px] flex-shrink-0">
                        <div className="rounded-lg overflow-hidden shadow-2xl border border-gray-800 relative group">
                            <img 
                                src={getImageUrl(movie.thumb_url)} 
                                className="w-full object-cover aspect-[2/3]" 
                                alt={movie.name}
                            />
                            {/* Nhãn chất lượng */}
                            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                {movie.quality}
                            </div>
                        </div>

                        {/* Nút bấm (Xếp dọc cho gọn) */}
                        <div className="flex flex-col gap-3 mt-4">
                            {firstEp ? (
                                <Link 
                                    to={`/xem-phim/${movie.slug}?tap=${firstEp.slug}`}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition uppercase shadow-lg shadow-red-600/30"
                                >
                                    <Play className="fill-white w-5 h-5" /> Xem Phim
                                </Link>
                            ) : (
                                <button className="w-full bg-gray-700 text-gray-400 py-3 rounded-lg font-bold cursor-not-allowed">
                                    ĐANG CẬP NHẬT
                                </button>
                            )}

                            {trailerId && (
                                <button 
                                    onClick={() => setShowTrailer(true)}
                                    className="w-full bg-gray-800 hover:bg-white hover:text-black text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 border border-gray-700 transition"
                                >
                                    <Video className="w-5 h-5" /> Xem Trailer
                                </button>
                            )}
                        </div>
                    </div>

                    {/* CỘT PHẢI: THÔNG TIN PHIM */}
                    <div className="flex-1 text-gray-300 pt-2">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                            {movie.name}
                        </h1>
                        <h2 className="text-xl text-gray-400 mb-4 font-medium">
                            {movie.origin_name} ({movie.year})
                        </h2>

                        {/* Thanh thông tin nhỏ */}
                        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                            {rating > 0 && (
                                <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                                    <Star className="w-4 h-4 fill-yellow-500" />
                                    <span>{rating.toFixed(1)}</span>
                                </div>
                            )}
                            <div className="bg-gray-800 px-3 py-1 rounded flex items-center gap-2">
                                <Clock className="w-4 h-4 text-red-500" /> {movie.time}
                            </div>
                            <div className="bg-gray-800 px-3 py-1 rounded flex items-center gap-2">
                                <Globe className="w-4 h-4 text-red-500" /> 
                                {movie.country?.[0]?.name || 'Quốc tế'}
                            </div>
                             <div className="bg-gray-800 px-3 py-1 rounded flex items-center gap-2">
                                <Film className="w-4 h-4 text-red-500" /> 
                                {movie.lang}
                            </div>
                        </div>

                        {/* Nội dung */}
                        <div className="mb-8">
                            <h3 className="text-white font-bold text-lg mb-2 border-l-4 border-red-600 pl-3 uppercase">Nội Dung</h3>
                            <div 
                                className="bg-gray-900/60 p-4 rounded-lg border border-gray-800 leading-relaxed text-sm md:text-base text-gray-300" 
                                dangerouslySetInnerHTML={{__html: movie.content}} 
                            />
                        </div>

                        {/* Grid thông tin phụ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-white font-bold mb-2 border-l-4 border-red-600 pl-3 uppercase">Diễn Viên</h3>
                                <p className="text-sm text-gray-400">
                                    {movie.actor?.length ? movie.actor.join(', ') : 'Đang cập nhật'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-2 border-l-4 border-red-600 pl-3 uppercase">Thể Loại</h3>
                                <div className="flex flex-wrap gap-2">
                                    {movie.category?.map(cat => (
                                        <Link key={cat.id} to={`/the-loai/${cat.slug}`} className="text-xs bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white px-2 py-1 rounded transition">
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Danh sách tập */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-red-600 pl-3 uppercase">Danh Sách Tập</h3>
                            <div className="bg-black/20 p-4 rounded-lg border border-gray-800">
                                {movie.episodes?.map((server, index) => (
                                    <div key={index} className="mb-4 last:mb-0">
                                        <p className="text-sm font-bold text-gray-500 mb-2 uppercase">{server.server_name}</p>
                                        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2">
                                            {server.server_data.map(ep => (
                                                <Link 
                                                    key={ep.slug}
                                                    to={`/xem-phim/${movie.slug}?tap=${ep.slug}`}
                                                    className="bg-gray-800 hover:bg-red-600 text-white text-center py-2 rounded text-xs font-semibold transition truncate border border-gray-700 hover:border-red-500"
                                                    title={ep.name}
                                                >
                                                    {ep.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TRAILER POPUP (Giữ lại vì cái này ngon) */}
            {showTrailer && trailerId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-fade-in">
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-700">
                        <button 
                            onClick={() => setShowTrailer(false)}
                            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-red-600 p-2 rounded-full transition z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <iframe 
                            src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
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