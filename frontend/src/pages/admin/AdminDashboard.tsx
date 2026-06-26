import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/Layout';
import type { DashboardStats } from '../../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DashboardStats>('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Admin Dashboard">
      <nav className="sub-nav">
        <Link to="/admin" className="active">
          Dashboard
        </Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/stores">Stores</Link>
      </nav>

      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats?.totalUsers ?? 0}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats?.totalStores ?? 0}</span>
              <span className="stat-label">Total Stores</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats?.totalRatings ?? 0}</span>
              <span className="stat-label">Total Ratings</span>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/admin/users/new" className="btn btn-primary">
              Add User
            </Link>
            <Link to="/admin/stores/new" className="btn btn-primary">
              Add Store
            </Link>
          </div>
        </>
      )}
    </Layout>
  );
}
