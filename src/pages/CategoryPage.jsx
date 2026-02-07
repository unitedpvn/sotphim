import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetcher } from '../utils/api';
import MovieCard from '../components/MovieCard';

const CategoryPage = ({ type }) => {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;
    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const endpoint = `/${type}/${slug}?page=${page}&limit=24`;

        fetcher(endpoint).then(res => {
            setData(res?.data);
            setLoading(false);
            window.scrollTo(0, 0);
        });
    }, [type, slug, page]);

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    };

    if (loading) return <div className="p-10 text-center text-gray-400 animate-pulse">Đang tải phim...</div>;

    return (
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-8">
            <h1 className="text-xl md:text-2xl font-bold mb-6 border-l-4 border-red-600 pl-3 text-white uppercase">
                {data?.titlePage || slug}
            </h1>

            {/* Grid đồng bộ với HomePage: gap-2 trên mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                {data?.items?.map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>

            <div className="flex justify-center mt-12 gap-3">
                <button 
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="px-6 py-2 bg-gray-800 rounded-full disabled:opacity-30 hover:bg-red-600 text-white transition font-medium"
                >
                    &larr; Trang Trước
                </button>
                <span className="px-6 py-2 bg-gray-900 rounded-full border border-gray-700 text-white font-bold">
                    {page}
                </span>
                <button 
                    onClick={() => handlePageChange(page + 1)}
                    className="px-6 py-2 bg-gray-800 rounded-full hover:bg-red-600 text-white transition font-medium"
                >
                    Trang Sau &rarr;
                </button>
            </div>
        </div>
    );
};

export default CategoryPage;