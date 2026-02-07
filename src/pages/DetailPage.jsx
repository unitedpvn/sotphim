import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetcher, getImageUrl } from '../utils/api';
import { Play, Clock, Calendar, Globe, Users, Film, Star, Video, X } from 'lucide-react';

const DetailPage = () => {
    const { slug } = useParams();
    const [movie, setMovie] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false); // State bật tắt modal trailer

    useEffect(() => {
        setMovie(null);
        fetcher(`/phim/${slug}`).then(res => {
            if(res?.status === 'success') setMovie(res.data.item);
        });
    }, [slug]);

    if (!movie) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const firstEp = movie.episodes?.[0]?.server_data?.[0];

    // Lấy ID Youtube từ URL trailer (nếu có)
    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const trailerId = getYoutubeId(movie.trailer_url);
    // Lấy điểm số (ưu tiên TMDB rồi đến IMDb)
    const rating = movie.tmdb?.vote_average || movie.imdb?.vote_average || 0;
    const voteCount = movie.tmdb?.vote_count || movie.imdb?.vote_count || 0;

    return (
        <div className="bg-[#111827] min-h-screen pb-10">
            {/* BACKGROUND BLUR */}
            <div className="relative w-full h-[550px]">
                <img 
                    src={getImageUrl(movie.poster_url || movie.thumb_url)} 
                    className="w-full h-full object-cover opacity-20 mask-image-gradient"
                    alt="cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-transparent to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 -mt-[450px] relative z-10">
                <div className="flex flex-col md:flex-row gap-10">
                    
                    {/* POSTER & BUTTONS */}
                    <div className="w-full md:w-[320px] flex-shrink-0 group">
                        <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-gray-800 group-hover:border-red-600 transition-colors duration-300 relative">
                            <img 
                                src={getImageUrl(movie.thumb_url)} 
                                className="w-full object-cover aspect-[2/3]" 
                                alt={movie.name}
                            />
                            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                                {movie.quality}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-6">
                            {firstEp ? (
                                <Link 
                                    to={`/xem-phim/${movie.slug}?tap=${firstEp.slug}`}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-red-600/30 text-lg uppercase"
                                >
                                    <Play className="fill-white w-5 h-5" />
                                    Xem Phim
                                </Link>
                            ) : (
                                <button className="w-full bg-gray-700 text-gray-400 py-3 rounded-lg font-bold cursor-not-allowed">
                                    ĐANG CẬP NHẬT
                                </button>
                            )}

                            {trailerId && (
                                <button 
                                    onClick={() => setShowTrailer(true)}
                                    className="w-full bg-gray-800 hover:bg-white hover:text-black text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition border border-gray-700"
                                >
                                    <Video className="w-5 h-5" />
                                    Xem Trailer
                                </button>
                            )}
                        </div>
                    </div>

                    {/* INFO CONTENT */}
                    <div className="flex-1 text-gray-300 pt-4">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight drop-shadow-lg">
                            {movie.name}
                        </h1>
                        <h2 className="text-xl text-gray-400 mb-6 font-medium tracking-wide">
                            {movie.origin_name} ({movie.year})
                        </h2>

                        {/* RATINGS & BADGES */}
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            {rating > 0 && (
                                <div className="flex items-center gap-2 bg-black/50 border border-yellow-500/50 px-3 py-1.5 rounded-full text-yellow-400 font-bold">
                                    <Star className="w-5 h-5 fill-yellow-400" />
                                    <span>{rating.toFixed(1)}</span>
                                    <span className="text-gray-500 text-xs font-normal">({voteCount} votes)</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full text-sm">
                                <Clock className="w-4 h-4 text-red-500" /> {movie.time}
                            </div>
                            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full text-sm">
                                <Globe className="w-4 h-4 text-red-500" /> {movie.country?.[0]?.name}
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="mb-10">
                            <h3 className="text-white font-bold text-lg mb-3 border-l-4 border-red-600 pl-3 uppercase">Nội Dung</h3>
                            <div 
                                className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 leading-relaxed text-gray-300" 
                                dangerouslySetInnerHTML={{__html: movie.content}} 
                            />
                        </div>

                        {/* ACTORS & INFO GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div>
                                <h3 className="text-white font-bold mb-3 border-l-4 border-red-600 pl-3 uppercase flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Diễn Viên
                                </h3>
                                <p className="text-sm text-gray-400 leading-7">
                                    {movie.actor?.length ? movie.actor.join(', ') : 'Đang cập nhật'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-3 border-l-4 border-red-600 pl-3 uppercase flex items-center gap-2">
                                    <Film className="w-4 h-4" /> Thể Loại
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {movie.category?.map(cat => (
                                        <Link key={cat.id} to={`/the-loai/${cat.slug}`} className="text-xs font-bold text-gray-300 bg-gray-800 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded transition">
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* LIST EPISODES */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-red-600 pl-3 uppercase">Danh Sách Tập</h3>
                            <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
                                {movie.episodes?.map((server, index) => (
                                    <div key={index} className="mb-6 last:mb-0">
                                        <p className="text-sm font-bold text-red-500 mb-3 uppercase tracking-wider">{server.server_name}</p>
                                        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2">
                                            {server.server_data.map(ep => (
                                                <Link 
                                                    key={ep.slug}
                                                    to={`/xem-phim/${movie.slug}?tap=${ep.slug}`}
                                                    className="bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white text-center py-2 rounded text-sm font-bold transition-all duration-200 truncate border border-gray-700 hover:border-red-500"
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

            {/* TRAILER MODAL (POPUP) */}
            {showTrailer && trailerId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                        <button 
                            onClick={() => setShowTrailer(false)}
                            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-red-600 p-2 rounded-full transition z-10"
                        >
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