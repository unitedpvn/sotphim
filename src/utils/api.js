import axios from 'axios';

export const API_BASE = 'https://ophim1.com/v1/api';
export const IMG_BASE = 'https://img.ophim.live/uploads/movies/';

// Hàm lấy ảnh Poster/Thumb cũ
export const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/300x450?text=No+Image';
    if (url.startsWith('http')) return url;
    return `${IMG_BASE}${url}`;
};

// Hàm mới: Tạo link ảnh Backdrop từ TMDB (w1280)
export const getTmdbImage = (path) => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/w1280${path}`;
};

export const fetcher = async (endpoint) => {
    try {
        const res = await axios.get(`${API_BASE}${endpoint}`);
        return res.data;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};