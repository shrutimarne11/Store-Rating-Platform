import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import FormField from '../../components/FormField';
import type { Store } from '../../types';
import type { FormChangeEvent } from '../../utils/validation';

export default function AdminStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [loading, setLoading] = useState(true);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const { data } = await api.get<Store[]>(`/admin/stores?${params}`);
      setStores(data);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(key);
      setSortOrder('ASC');
    }
  };

  const handleFilterChange = (e: FormChangeEvent) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Layout title="Manage Stores">
      <nav className="sub-nav">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/stores" className="active">
          Stores
        </Link>
      </nav>

      <div className="card">
        <div className="card-header">
          <h3>Stores</h3>
          <Link to="/admin/stores/new" className="btn btn-primary">
            Add Store
          </Link>
        </div>

        <div className="filters">
          <FormField
            label="Name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Filter by name"
          />
          <FormField
            label="Email"
            name="email"
            value={filters.email}
            onChange={handleFilterChange}
            placeholder="Filter by email"
          />
          <FormField
            label="Address"
            name="address"
            value={filters.address}
            onChange={handleFilterChange}
            placeholder="Filter by address"
          />
          <button type="button" className="btn btn-secondary" onClick={fetchStores}>
            Apply Filters
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading stores...</div>
        ) : (
          <DataTable
            columns={[
              { key: 'name', label: 'Name', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'address', label: 'Address', sortable: true },
              {
                key: 'averageRating',
                label: 'Rating',
                render: (row) =>
                  row.averageRating !== null
                    ? `${row.averageRating} / 5`
                    : 'No ratings',
              },
            ]}
            data={stores as unknown as Record<string, unknown>[]}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        )}
      </div>
    </Layout>
  );
}
