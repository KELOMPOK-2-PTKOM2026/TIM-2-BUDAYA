// file: d:\PTKOM\Baru\TIM-2-BUDAYA\frontend\src\components\ProtectedRoute.js
import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  reason = 'Silakan masuk terlebih dahulu untuk mengakses halaman ini.',
}) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Bawa halaman tujuan & alasan agar LoginPage bisa menjelaskan dan mengembalikan pengguna setelah login
    return <Navigate to="/login" replace state={{ from: location.pathname, reason }} />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}
