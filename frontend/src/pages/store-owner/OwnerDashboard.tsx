import { useEffect, useState } from 'react';
import api from '../../api/client';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import type { OwnerDashboard } from '../../types';

export default function OwnerDashboardPage() {
  const [dashboard, setDashboard] = useState<OwnerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<OwnerDashboard>('/store-owner/dashboard')
      .then(({ data }) => setDashboard(data))
      .catch(() => setError('Unable to load dashboard. No store may be assigned.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Store Owner Dashboard">
      {loading && <div className="loading">Loading dashboard...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {dashboard && (
        <>
          <div className="card store-summary">
            <h3>{dashboard.store.name}</h3>
            <p>{dashboard.store.address}</p>
            <p>{dashboard.store.email}</p>
            <div className="stat-card inline-stat">
              <span className="stat-value">
                {dashboard.store.averageRating !== null
                  ? `${dashboard.store.averageRating} / 5`
                  : 'N/A'}
              </span>
              <span className="stat-label">Average Store Rating</span>
            </div>
          </div>

          <div className="card">
            <h3>Users Who Rated Your Store</h3>
            <DataTable
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'address', label: 'Address' },
                {
                  key: 'rating',
                  label: 'Rating',
                  render: (row) => `${row.rating} / 5`,
                },
              ]}
              data={
                dashboard.raters as unknown as Record<string, unknown>[]
              }
            />
          </div>
        </>
      )}
    </Layout>
  );
}
