import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/Layout';
import type { UserDetails } from '../../types';
import { roleLabel } from '../../utils/validation';

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .get<UserDetails>(`/admin/users/${id}`)
      .then(({ data }) => setUser(data))
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Layout title="User Details">
      <nav className="sub-nav">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/stores">Stores</Link>
      </nav>

      <div className="card">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="alert alert-error">{error}</div>}
        {user && (
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Name</span>
              <span>{user.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Address</span>
              <span>{user.address}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Role</span>
              <span>{roleLabel(user.role)}</span>
            </div>
            {user.role === 'store_owner' && (
              <>
                <div className="detail-item">
                  <span className="detail-label">Store Name</span>
                  <span>{user.storeName ?? 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Store Rating</span>
                  <span>
                    {user.storeRating !== null && user.storeRating !== undefined
                      ? `${user.storeRating} / 5`
                      : 'No ratings yet'}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
        <div className="form-actions">
          <Link to="/admin/users" className="btn btn-secondary">
            Back to Users
          </Link>
        </div>
      </div>
    </Layout>
  );
}
