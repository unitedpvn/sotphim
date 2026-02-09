import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import { fetcher, getImageUrl } from '../utils/api';
import { Server, Star, Calendar, Clock, PlayCircle } from 'lucide-react';

const WatchPage = () => {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const currentEpSlug = searchParams.get('tap');
    const navigate = useNavigate();
    
    const videoRef = useRef(null);
    const [movieData, setMovieData] = useState(null);
    const [serverList, setServerList] = useState([]); 
    const [currentServerIndex, setCurrentServerIndex] = useState(0); 
    const [episodes, setEpisodes] = useState([]); 
    
    const [currentLink, setCurrentLink] = useState(null);
    const [showResume, setShowResume] = useState(false);
    const [savedTime, setSavedTime] = useState(0);

    // 1. Lấy dữ liệu phim
    useEffect(() => {
        fetcher(`/phim/${slug}`).then(res => {
            if (res?.status === 'success') {
                const movie = res.data.item;
                setMovieData(movie);
                document.title = `Đang xem: ${movie.name}`;

                const servers = movie.episodes || [];
                setServerList(servers);

                if (servers.length > 0) {
                    setEpisodes(servers[0].server_data);
                    const activeEp = servers[0].server_data.find(e => e.slug === currentEpSlug) || servers[0].server_data[0];
                    if (activeEp && !currentEpSlug) {
                        navigate(`/xem-phim/${slug}?tap=${activeEp.slug}`, { replace: true });
                    } else if (activeEp) {
                        setCurrentLink(activeEp.link_m3u8);
                    }
                }
            }
        });
    }, [slug]);

    // XỬ LÝ SERVER & AUTO NEXT
    const handleServerChange = (index) => {
        setCurrentServerIndex(index);
        const newEpisodes = serverList[index].server_data;
        setEpisodes(newEpisodes);
    };

    useEffect(() => {
        if(serverList.length > 0 && currentEpSlug) {
            const currentServerData = serverList[currentServerIndex]?.server_data;
            const activeEp = currentServerData?.find(e => e.slug === currentEpSlug);
            if (activeEp) setCurrentLink(activeEp.link_m3u8);
        }
    }, [currentEpSlug, currentServerIndex, serverList]);

    const handleVideoEnded = () => {
        const currentIndex = episodes.findIndex(e => e.slug === currentEpSlug);
        if (currentIndex !== -1 && currentIndex < episodes.length - 1) {
            const nextEp = episodes[currentIndex + 1];
            navigate(`/xem-phim/${slug}?tap=${nextEp.slug}`);
        }
    };

    // PLAYER LOGIC
    useEffect(() => {
        if (!currentLink || !videoRef.current) return;
        const video = videoRef.current;
        const storageKey = `time_${slug}_${currentEpSlug}`;
        const historyTime = localStorage.getItem(storageKey);
        
        setShowResume(false); 
        
        if (historyTime && parseFloat(historyTime) > 30) {
            setSavedTime(parseFloat(historyTime));
            setShowResume(true);
        } else {
            loadHls(video, currentLink, 0);
        }

        const saveInterval = setInterval(() => {
            if(!video.paused) localStorage.setItem(storageKey, video.currentTime);
        }, 5000);

        video.addEventListener('ended', handleVideoEnded);
        return () => {
            clearInterval(saveInterval);
            video.removeEventListener('ended', handleVideoEnded);
        };
    }, [currentLink]);

    const handleResume = (choice) => {
        setShowResume(false);
        const video = videoRef.current;
        loadHls(video, currentLink, choice === 'yes' ? savedTime : 0);
    };

    const loadHls = (video, src, time) => {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.currentTime = time;
                video.play().catch(() => {});
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.currentTime = time;
            video.play();
        }
    };

    return (
        <div className="bg-[#0a0a0a] min-h-screen pb-10 pt-20">
            
            {/* 1. KHUNG PLAYER */}
            <div className="w-full bg-black mb-6 border-b border-gray-800">
                {/* THAY ĐỔI Ở ĐÂY: 
                   - max-w-5xl: Giới hạn chiều rộng Player khoảng 1024px (nhỏ hơn full màn hình).
                   - mx-auto: Căn giữa player.
                */}
                <div className="container mx-auto max-w-5xl"> 
                    <div className="relative aspect-video bg-black w-full shadow-2xl">
                        <video ref={videoRef} controls className="w-full h-full focus:outline-none" />
                        
                        {/* Popup Resume */}
                        {showResume && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
                                <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-600 shadow-2xl">
                                    <p className="text-white mb-4 font-medium">Bạn muốn xem tiếp từ phút {Math.floor(savedTime/60)}?</p>
                                    <div className="flex gap-4 justify-center">
                                        <button onClick={() => handleResume('yes')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition">Có</button>
                                        <button onClick={() => handleResume('no')} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded font-bold transition">Xem lại từ đầu</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. PHẦN NỘI DUNG DƯỚI */}
            {/* Căn lề rộng rãi cho phần thông tin (max-w-6xl) */}
            <div className="container mx-auto max-w-6xl px-4 md:px-8">
                
                {/* LIST TẬP PHIM */}
                <div className="bg-[#151515] p-5 md:p-6 rounded-xl border border-gray-800 mb-8 shadow-lg">
                    {/* Server Tabs */}
                    {serverList.length > 1 && (
                        <div className="flex gap-3 mb-5 overflow-x-auto pb-2 border-b border-gray-700">
                            {serverList.map((sv, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleServerChange(index)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition
                                        ${currentServerIndex === index ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
                                    `}
                                >
                                    <Server className="w-4 h-4" /> {sv.server_name}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold border-l-4 border-red-600 pl-3 uppercase flex items-center gap-2">
                            <PlayCircle className="w-5 h-5 text-red-500" /> Danh Sách Tập
                        </h3>
                        <span className="text-gray-500 text-sm font-medium">{episodes.length} tập</span>
                    </div>
                    
                    {/* Grid Tập */}
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {episodes.map(ep => (
                            <Link 
                                key={ep.slug}
                                replace={true}
                                to={`/xem-phim/${slug}?tap=${ep.slug}`}
                                className={`
                                    text-center py-2.5 rounded text-xs font-bold transition truncate border
                                    ${currentEpSlug === ep.slug 
                                        ? 'bg-red-600 text-white shadow-lg border-red-500' 
                                        : 'bg-gray-800 text-gray-400 border-transparent hover:bg-gray-700 hover:text-white hover:border-gray-600'}
                                `}
                            >
                                {ep.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* THÔNG TIN PHIM */}
                {movieData && (
                    <div className="bg-[#111] p-6 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-8 shadow-lg">
                        <div className="w-[160px] flex-shrink-0 rounded-lg overflow-hidden border border-gray-700 hidden md:block group">
                            <img src={getImageUrl(movieData.thumb_url)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={movieData.name}/>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-2xl md:text-4xl font-black text-white mb-2">{movieData.name}</h1>
                            <h2 className="text-gray-400 text-base md:text-lg mb-4">{movieData.origin_name} ({movieData.year})</h2>
                            
                            <div className="flex flex-wrap gap-3 mb-6 text-sm text-gray-300">
                                <span className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/> {movieData.tmdb?.vote_average || 8.5}</span>
                                <span className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700"><Calendar className="w-4 h-4 text-red-500"/> {movieData.year}</span>
                                <span className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700"><Clock className="w-4 h-4 text-red-500"/> {movieData.time}</span>
                            </div>

                            <div className="text-gray-300 leading-7 text-justify text-sm md:text-base bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                                <h3 className="font-bold text-white mb-2 border-l-4 border-red-600 pl-3 uppercase text-sm">Nội Dung Phim</h3>
                                <div dangerouslySetInnerHTML={{__html: movieData.content}} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchPage;