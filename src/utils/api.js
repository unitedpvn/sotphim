import axios from 'axios';

export const API_BASE = 'https://ophim1.com/v1/api';
// Cập nhật domain ảnh mới từ source bạn gửi
export const IMG_BASE = 'https://img.ophim.live/uploads/movies/'; 

export const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/300x450?text=No+Image';
    if (url.startsWith('http')) return url;
    return `${IMG_BASE}${url}`;
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