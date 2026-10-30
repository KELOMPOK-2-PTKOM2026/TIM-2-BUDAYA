// file: d:\PTKOM\Baru\TIM-2-BUDAYA\frontend\src\App.js
import { useState, useEffect } from 'react';
import './App.css'; // Global styling
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import DetailPage from './pages/DetailPage';
import AboutPage from './pages/AboutPage';
import ContributionPage from './pages/ContributionPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import EditCulturePage from './pages/EditCulturePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <Navbar theme={theme} toggleTheme={toggleTheme} />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/eksplorasi" element={<ExplorePage />} />
              <Route path="/budaya/:slug" element={<DetailPage />} />
              <Route path="/tentang" element={<AboutPage />} />
              {/* Tidak diproteksi: pengunjung melihat penjelasan hak akses, kontributor melihat form */}
              <Route path="/kontribusi" element={<ContributionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/masuk" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/daftar" element={<RegisterPage />} />
              <Route path="/lupa-password" element={<ForgotPasswordPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route
                path="/profil"
                element={
                  <ProtectedRoute reason="Masuk untuk melihat profil dan riwayat ajuan budaya Anda.">
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true} reason="Panel admin hanya dapat diakses oleh akun Admin.">
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/katalog/edit/:slug"
                element={
                  <ProtectedRoute requireAdmin={true} reason="Panel admin hanya dapat diakses oleh akun Admin.">
                    <EditCulturePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;


