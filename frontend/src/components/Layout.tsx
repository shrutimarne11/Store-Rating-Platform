import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleLabel } from '../utils/validation';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <h1>Store Rating Platform</h1>
          <div className="header-actions">
            {user && (
              <>
                <span className="user-badge">
                  {user.name} ({roleLabel(user.role)})
                </span>
                <Link to="/change-password" className="btn btn-secondary">
                  Change Password
                </Link>
                <button onClick={handleLogout} className="btn btn-outline">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="app-main">
        <h2 className="page-title">{title}</h2>
        {children}
      </main>
    </div>
  );
}
