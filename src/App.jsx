import { BrowserRouter, Routes, Route } from 'react-router-dom'; // <-- Dòng này quan trọng nhất để fix lỗi
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import WatchPage from './pages/WatchPage';
import SearchPage from './pages/SearchPage';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#111827] text-white font-sans flex flex-col">
        {/* Header luôn hiển thị ở trên cùng */}
        <Header />
        
        {/* Phần nội dung chính (sẽ giãn ra để đẩy footer xuống đáy) */}
        <div className="flex-1">
            <Routes>
                {/* Trang Chủ */}
                <Route path="/" element={<HomePage />} />
                
                {/* Trang Chi Tiết Phim */}
                <Route path="/phim/:slug" element={<DetailPage />} />
                
                {/* Trang Xem Phim */}
                <Route path="/xem-phim/:slug" element={<WatchPage />} />
                
                {/* Trang Tìm Kiếm */}
                <Route path="/tim-kiem" element={<SearchPage />} />
                
                {/* Các trang danh sách (Thể loại, Quốc gia, Phim bộ...) */}
                <Route path="/the-loai/:slug" element={<CategoryPage type="the-loai" />} />
                <Route path="/quoc-gia/:slug" element={<CategoryPage type="quoc-gia" />} />
                <Route path="/danh-sach/:slug" element={<CategoryPage type="danh-sach" />} />
            </Routes>
        </div>

        {/* Footer luôn hiển thị ở dưới cùng */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;