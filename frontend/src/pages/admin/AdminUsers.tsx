import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import FormField from '../../components/FormField';
import type { User } from '../../types';
import { roleLabel, type FormChangeEvent } from '../../utils/validation';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const { data } = await api.get<User[]>(`/admin/users?${params}`);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
    <Layout title="Manage Users">
      <nav className="sub-nav">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/users" className="active">
          Users
        </Link>
        <Link to="/admin/stores">Stores</Link>
      </nav>

      <div className="card">
        <div className="card-header">
          <h3>Users</h3>
          <Link to="/admin/users/new" className="btn btn-primary">
            Add User
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
          <FormField
            label="Role"
            name="role"
            as="select"
            value={filters.role}
            onChange={handleFilterChange}
            options={[
              { value: '', label: 'All Roles' },
              { value: 'normal_user', label: 'Normal User' },
              { value: 'system_admin', label: 'System Administrator' },
            ]}
          />
          <button type="button" className="btn btn-secondary" onClick={fetchUsers}>
            Apply Filters
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <DataTable
            columns={[
              { key: 'name', label: 'Name', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'address', label: 'Address', sortable: true },
              {
                key: 'role',
                label: 'Role',
                sortable: true,
                render: (row) => roleLabel(row.role as string),
              },
            ]}
            data={users as unknown as Record<string, unknown>[]}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            actions={(row) => (
              <Link to={`/admin/users/${row.id}`} className="btn btn-sm">
                View
              </Link>
            )}
          />
        )}
      </div>
    </Layout>
  );
}
