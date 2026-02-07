import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { fetcher } from '../utils/api';

const Header = () => {
    const [keyword, setKeyword] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetcher('/the-loai').then(res => setCategories(res?.data?.items || []));
        fetcher('/quoc-gia').then(res => setCountries(res?.data?.items || []));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/tim-kiem?keyword=${keyword}`);
            setIsMenuOpen(false);
        }
    };

    return (
        <header className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 shadow-2xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                
                {/* LOGO SOTPHIM (Đã sửa lại như cũ) */}
                <Link to="/" className="text-2xl font-black tracking-tighter hover:scale-105 transition-transform flex items-center">
                    <span className="text-white">SOT</span>
                    <span className="text-red-600">PHIM</span>
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-300">
                    <Link to="/" className="hover:text-red-500 transition uppercase">Trang Chủ</Link>
                    
                    <div className="relative group py-4">
                        <button className="hover:text-red-500 transition uppercase flex items-center gap-1">
                            Thể Loại
                        </button>
                        <div className="absolute top-full left-0 w-[600px] bg-black/95 border border-gray-800 shadow-2xl rounded-xl p-6 grid grid-cols-4 gap-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            {categories.slice(0, 24).map(cat => (
                                <Link key={cat._id} to={`/the-loai/${cat.slug}`} className="hover:text-red-500 text-xs text-gray-400 hover:text-white transition">
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="relative group py-4">
                        <button className="hover:text-red-500 transition uppercase">Quốc Gia</button>
                        <div className="absolute top-full left-0 w-[500px] bg-black/95 border border-gray-800 shadow-2xl rounded-xl p-6 grid grid-cols-3 gap-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            {countries.slice(0, 18).map(cou => (
                                <Link key={cou._id} to={`/quoc-gia/${cou.slug}`} className="hover:text-red-500 text-xs text-gray-400 hover:text-white transition">
                                    {cou.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link to="/danh-sach/phim-bo" className="hover:text-red-500 transition uppercase">Phim Bộ</Link>
                    <Link to="/danh-sach/phim-le" className="hover:text-red-500 transition uppercase">Phim Lẻ</Link>
                </div>

                {/* SEARCH */}
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="hidden md:block relative group">
                        <input 
                            type="text"
                            placeholder="Tìm phim..."
                            className="bg-gray-900 text-white text-xs px-4 py-2 rounded-full pl-10 w-40 focus:w-64 transition-all duration-300 outline-none border border-gray-700 focus:border-red-600 focus:bg-black"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2 text-gray-500 w-4 h-4 group-focus-within:text-red-500 transition-colors" />
                    </form>
                    
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white">
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMenuOpen && (
                <div className="lg:hidden bg-black p-4 border-t border-gray-800">
                    <form onSubmit={handleSearch} className="mb-4 relative">
                         <input 
                            type="text"
                            placeholder="Tìm phim..."
                            className="w-full bg-gray-900 text-white p-3 rounded-lg pl-10 outline-none border border-gray-800 focus:border-red-600"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <Search className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                    </form>
                    <div className="flex flex-col gap-4 font-bold text-gray-300 uppercase text-sm">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500">Trang Chủ</Link>
                        <Link to="/danh-sach/phim-bo" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500">Phim Bộ</Link>
                        <Link to="/danh-sach/phim-le" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500">Phim Lẻ</Link>
                        <Link to="/danh-sach/hoat-hinh" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500">Hoạt Hình</Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;