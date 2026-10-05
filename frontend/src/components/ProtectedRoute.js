import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getUser } from '../lib/auth';

/**
 * Pemakaian di App.js:
 *   <Route element={<ProtectedRoute />}>            → siapa saja yang login
 *   <Route element={<ProtectedRoute role="admin" />} → hanya admin
 *   <Route element={<ProtectedRoute role="user" />}  → hanya user biasa
 */
export default function ProtectedRoute({ role }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
