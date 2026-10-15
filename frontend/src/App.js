// file: d:\PTKOM\Baru\TIM-2-BUDAYA\frontend\src\App.js
import './App.css';
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
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/eksplorasi" element={<ExplorePage />} />
              <Route path="/budaya/:slug" element={<DetailPage />} />
              <Route path="/tentang" element={<AboutPage />} />
              <Route
                path="/kontribusi"
                element={
                  <ProtectedRoute>
                    <ContributionPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/kontak" element={<ContributionPage />} />
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
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
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


