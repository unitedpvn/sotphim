import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { fetcher } from '../utils/api';

const Header = () => {
    const [keyword, setKeyword] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        fetcher('/the-loai').then(res => setCategories(res?.data?.items || []));
        fetcher('/quoc-gia').then(res => setCountries(res?.data?.items || []));
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/tim-kiem?keyword=${keyword}`);
            setIsMenuOpen(false);
        }
    };

    return (
        <header 
            className={`fixed top-0 w-full z-[100] transition-all duration-300 border-b border-white/5 
            ${isScrolled ? 'bg-[#080B1D]/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}
        >
            <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
                {/* LOGO */}
                <Link to="/" className="flex items-center gap-2 group z-50">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-xl shadow-lg">S</div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold leading-none text-white">SOTPHIM</span>
                        <span className="text-[10px] text-gray-400 tracking-widest uppercase">n293 x Gemini</span>
                    </div>
                </Link>

                {/* DESKTOP MENU */}
                <nav className="hidden lg:flex items-center gap-1">
                    <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition">Trang Chủ</Link>
                    <Link to="/danh-sach/phim-bo" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition">Phim Bộ</Link>
                    <Link to="/danh-sach/phim-le" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition">Phim Lẻ</Link>
                    
                    <div className="relative group px-2">
                        <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 group-hover:text-white transition">
                            Thể Loại <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="absolute top-full left-0 w-[600px] bg-[#0f132a] border border-white/10 shadow-2xl rounded-xl p-6 grid grid-cols-4 gap-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                            {categories.slice(0, 24).map(cat => (
                                <Link key={cat._id} to={`/the-loai/${cat.slug}`} className="text-gray-400 hover:text-red-500 text-sm py-1">{cat.name}</Link>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* SEARCH & MOBILE TOGGLE */}
                <div className="flex items-center gap-3 z-50">
                    <form onSubmit={handleSearch} className="hidden md:flex relative group bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:bg-black/50 focus-within:border-red-600 transition-all">
                        <input type="text" placeholder="Tìm kiếm..." className="bg-transparent text-sm text-white w-40 focus:w-60 outline-none transition-all placeholder:text-gray-500" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                        <button type="submit" className="text-gray-400 hover:text-white"><Search className="w-4 h-4" /></button>
                    </form>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white p-2 rounded-full hover:bg-white/10 transition">
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU FULLSCREEN */}
            <div className={`fixed inset-0 bg-[#080B1D] z-40 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
                <div className="flex flex-col h-full pt-24 px-6 overflow-y-auto">
                     <form onSubmit={handleSearch} className="relative mb-8">
                         <input type="text" placeholder="Tìm phim..." className="w-full bg-[#1a1d2e] text-white p-4 rounded-xl outline-none border border-white/10 focus:border-red-600" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                        <button type="submit" className="absolute right-4 top-4 text-gray-400"><Search /></button>
                    </form>
                    <div className="flex flex-col gap-6 text-lg font-bold text-gray-300">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="border-b border-white/5 pb-4 hover:text-red-500">Trang Chủ</Link>
                        <Link to="/danh-sach/phim-bo" onClick={() => setIsMenuOpen(false)} className="border-b border-white/5 pb-4 hover:text-red-500">Phim Bộ</Link>
                        <Link to="/danh-sach/phim-le" onClick={() => setIsMenuOpen(false)} className="border-b border-white/5 pb-4 hover:text-red-500">Phim Lẻ</Link>
                        <Link to="/danh-sach/hoat-hinh" onClick={() => setIsMenuOpen(false)} className="border-b border-white/5 pb-4 hover:text-red-500">Hoạt Hình</Link>
                        <Link to="/danh-sach/tv-shows" onClick={() => setIsMenuOpen(false)} className="border-b border-white/5 pb-4 hover:text-red-500">TV Shows</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;