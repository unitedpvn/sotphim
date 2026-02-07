import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Hls from 'hls.js';
import { fetcher } from '../utils/api';

const WatchPage = () => {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const currentEpSlug = searchParams.get('tap');
    
    const videoRef = useRef(null);
    const [movieData, setMovieData] = useState(null);
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
                const svData = movie.episodes[0]?.server_data || [];
                setEpisodes(svData);
                
                // Tìm link tập hiện tại, default tập 1
                const activeEp = svData.find(e => e.slug === currentEpSlug) || svData[0];
                if (activeEp) {
                    setCurrentLink(activeEp.link_m3u8);
                    addToHistory({
                        slug: movie.slug,
                        name: movie.name,
                        thumb_url: movie.thumb_url,
                        year: movie.year,
                        origin_name: movie.origin_name,
                        current_ep: activeEp.name
                    });
                }
            }
        });
    }, [slug, currentEpSlug]);

    // Hàm lưu lịch sử
    const addToHistory = (movie) => {
        let history = JSON.parse(localStorage.getItem('watch_history_list')) || [];
        history = history.filter(item => item.slug !== movie.slug);
        history.unshift(movie);
        if (history.length > 12) history.pop();
        localStorage.setItem('watch_history_list', JSON.stringify(history));
    };

    // 2. Xử lý Player HLS
    useEffect(() => {
        if (!currentLink || !videoRef.current) return;

        const video = videoRef.current;
        const storageKey = `time_${slug}_${currentEpSlug}`;
        const historyTime = localStorage.getItem(storageKey);

        // Reset player state khi đổi tập
        setShowResume(false); 

        if (historyTime && parseFloat(historyTime) > 30) {
            setSavedTime(parseFloat(historyTime));
            setShowResume(true);
            // Tạm dừng load source để hỏi người dùng trước
        } else {
            loadHls(video, currentLink, 0);
        }

        const saveInterval = setInterval(() => {
            if(!video.paused) localStorage.setItem(storageKey, video.currentTime);
        }, 5000);

        return () => clearInterval(saveInterval);
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
                video.play().catch(() => console.log("Autoplay blocked"));
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.currentTime = time;
            video.play();
        }
    };

    return (
        <div className="bg-[#0a0a0a] min-h-screen flex flex-col">
            {/* 1. PLAYER SECTION (Bỏ sticky để tránh lỗi đè Header) */}
            <div className="w-full bg-black shadow-2xl relative">
                <div className="container mx-auto max-w-6xl">
                     <div className="relative aspect-video bg-black w-full">
                        <video ref={videoRef} controls className="w-full h-full" />
                        
                        {/* Popup Resume */}
                        {showResume && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
                                <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
                                    <p className="text-white text-lg mb-4 font-medium">
                                        Xem tiếp tại phút {Math.floor(savedTime/60)}?
                                    </p>
                                    <div className="flex gap-4 justify-center">
                                        <button onClick={() => handleResume('yes')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition">Có</button>
                                        <button onClick={() => handleResume('no')} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded font-bold transition">Không</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. INFO & LIST EPISODES */}
            <div className="flex-1 container mx-auto max-w-6xl px-4 py-8">
                {movieData && (
                    <div className="mb-6 border-b border-gray-800 pb-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {movieData.name}
                        </h1>
                        <p className="text-gray-400 text-sm flex gap-4">
                            <span>{movieData.year}</span>
                            <span>•</span>
                            <span className="text-red-500 font-bold">Tập {episodes.find(e => e.slug === currentEpSlug)?.name || '1'}</span>
                        </p>
                    </div>
                )}

                {/* KHUNG CHỌN TẬP (ĐÃ FIX LỖI SCROLL) */}
                <div className="bg-[#111] p-4 md:p-6 rounded-xl border border-gray-800">
                    <h3 className="text-gray-300 font-bold mb-4 border-l-4 border-red-600 pl-3 uppercase">
                        Danh Sách Tập
                    </h3>
                    
                    {/* FIX QUAN TRỌNG Ở ĐÂY:
                        - max-h-[500px]: Giới hạn chiều cao khung tập là 500px.
                        - overflow-y-auto: Nếu danh sách dài hơn 500px, nó sẽ hiện thanh cuộn RIÊNG bên trong khung này.
                        - Footer sẽ nằm im ở dưới đáy trang, không che mất tập nữa.
                    */}
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                        {episodes.map(ep => {
                            const isActive = currentEpSlug === ep.slug;
                            return (
                                <Link 
                                    key={ep.slug}
                                    replace={true} // Fix lỗi nút Back
                                    to={`/xem-phim/${slug}?tap=${ep.slug}`}
                                    className={`
                                        text-center py-2.5 rounded text-sm font-semibold transition-all duration-200 truncate
                                        ${isActive 
                                            ? 'bg-red-600 text-white shadow-lg scale-95 ring-2 ring-red-400' 
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}
                                    `}
                                    title={`Tập ${ep.name}`}
                                >
                                    {ep.name}
                                </Link>
                            )
                        })}
                    </div>
                </div>
                
                {/* Khoảng trống đệm để Footer không dính sát */}
                <div className="h-10"></div>
            </div>
        </div>
    );
};

export default WatchPage;