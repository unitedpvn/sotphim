import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ src, movieSlug, episodeSlug }) => {
    const videoRef = useRef(null);
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [savedTime, setSavedTime] = useState(0);

    // Key để lưu vào LocalStorage: "history_slug-phim_tap-1"
    const storageKey = `ophim_history_${movieSlug}_${episodeSlug}`;

    useEffect(() => {
        // 1. Kiểm tra lịch sử khi mới vào
        const history = localStorage.getItem(storageKey);
        if (history) {
            const time = parseFloat(history);
            // Nếu đã xem quá 1 phút và chưa hết phim
            if (time > 60) { 
                setSavedTime(time);
                setShowResumeModal(true); // Hiện popup hỏi
                // Tạm thời chưa load source để tránh tự play đè lên logic
            } else {
                loadVideo();
            }
        } else {
            loadVideo();
        }
    }, [src]);

    const loadVideo = (startTime = 0) => {
        const video = videoRef.current;
        if (!video) return;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.currentTime = startTime;
                video.play().catch(() => console.log("Cần tương tác để play"));
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.currentTime = startTime;
            video.play();
        }
    };

    // Xử lý khi chọn "Có" (Xem tiếp)
    const handleResume = () => {
        setShowResumeModal(false);
        loadVideo(savedTime);
    };

    // Xử lý khi chọn "Không" (Xem lại từ đầu)
    const handleRestart = () => {
        setShowResumeModal(false);
        loadVideo(0);
    };

    // Lưu thời gian mỗi 5 giây
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            localStorage.setItem(storageKey, videoRef.current.currentTime);
        }
    };

    return (
        <div className="relative w-full aspect-video bg-black">
            {/* Custom Video Element */}
            <video
                ref={videoRef}
                controls
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
            />

            {/* Modal Nhắc nhở */}
            {showResumeModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="bg-gray-900 p-6 rounded-lg text-white text-center border border-gray-700">
                        <p className="mb-4 text-lg">
                            Bạn đang xem dở tập này tại phút {Math.floor(savedTime / 60)}:{Math.floor(savedTime % 60)}. 
                            <br/>Muốn xem tiếp không?
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button 
                                onClick={handleResume}
                                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 font-bold"
                            >
                                Xem tiếp
                            </button>
                            <button 
                                onClick={handleRestart}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                            >
                                Xem lại đầu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;