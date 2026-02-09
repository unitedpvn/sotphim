import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetcher } from '../utils/api';
import MovieCard from '../components/MovieCard';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword');
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        if (keyword) {
            fetcher(`/tim-kiem?keyword=${keyword}`).then(res => {
                if (res?.data?.items) setMovies(res.data.items);
            });
        }
    }, [keyword]);

    return (
        <div className="container mx-auto px-4 py-8 pt-20">
            <h2 className="text-xl mb-6">Kết quả tìm kiếm cho: <span className="text-red-500 font-bold">{keyword}</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default SearchPage;