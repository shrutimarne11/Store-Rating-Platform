import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import CreateUser from './pages/admin/CreateUser';
import CreateStore from './pages/admin/CreateStore';
import UserDetailsPage from './pages/admin/UserDetails';
import UserStores from './pages/user/UserStores';
import OwnerDashboardPage from './pages/store-owner/OwnerDashboard';

function HomeRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'system_admin') return <Navigate to="/admin" replace />;
  if (user.role === 'store_owner') return <Navigate to="/store-owner" replace />;
  return <Navigate to="/stores" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<HomeRedirect />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['system_admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/new" element={<CreateUser />} />
        <Route path="/admin/users/:id" element={<UserDetailsPage />} />
        <Route path="/admin/stores" element={<AdminStores />} />
        <Route path="/admin/stores/new" element={<CreateStore />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['normal_user']} />}>
        <Route path="/stores" element={<UserStores />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['store_owner']} />}>
        <Route path="/store-owner" element={<OwnerDashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
