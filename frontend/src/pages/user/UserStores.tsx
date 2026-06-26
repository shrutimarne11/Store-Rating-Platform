import { useCallback, useEffect, useState } from 'react';
import api from '../../api/client';
import Layout from '../../components/Layout';
import FormField from '../../components/FormField';
import type { Store } from '../../types';
import type { FormChangeEvent } from '../../utils/validation';

export default function UserStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [loading, setLoading] = useState(true);
  const [ratingInputs, setRatingInputs] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.address) params.append('address', filters.address);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const { data } = await api.get<Store[]>(`/stores?${params}`);
      setStores(data);

      const inputs: Record<string, number> = {};
      data.forEach((store) => {
        if (store.userRating) {
          inputs[store.id] = store.userRating;
        }
      });
      setRatingInputs(inputs);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleFilterChange = (e: FormChangeEvent) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const submitRating = async (storeId: string, isUpdate: boolean) => {
    const rating = ratingInputs[storeId];
    if (!rating || rating < 1 || rating > 5) {
      setMessage('Please select a rating between 1 and 5');
      return;
    }

    setSubmitting(storeId);
    setMessage('');
    try {
      const method = isUpdate ? api.put : api.post;
      await method(`/stores/${storeId}/ratings`, { rating });
      setMessage(
        isUpdate ? 'Rating updated successfully' : 'Rating submitted successfully',
      );
      await fetchStores();
    } catch {
      setMessage('Failed to submit rating');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <Layout title="Browse Stores">
      {message && <div className="alert alert-success">{message}</div>}

      <div className="card">
        <div className="filters">
          <FormField
            label="Search by Name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Store name"
          />
          <FormField
            label="Search by Address"
            name="address"
            value={filters.address}
            onChange={handleFilterChange}
            placeholder="Store address"
          />
          <button type="button" className="btn btn-secondary" onClick={fetchStores}>
            Search
          </button>
          <FormField
            label="Sort By"
            name="sortBy"
            as="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'name', label: 'Name' },
              { value: 'address', label: 'Address' },
            ]}
          />
          <FormField
            label="Order"
            name="sortOrder"
            as="select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
            options={[
              { value: 'ASC', label: 'Ascending' },
              { value: 'DESC', label: 'Descending' },
            ]}
          />
        </div>

        {loading ? (
          <div className="loading">Loading stores...</div>
        ) : (
          <div className="store-list">
            {stores.length === 0 ? (
              <p className="empty">No stores found</p>
            ) : (
              stores.map((store) => (
                <div key={store.id} className="store-card">
                  <div className="store-info">
                    <h3>{store.name}</h3>
                    <p className="store-address">{store.address}</p>
                    <div className="store-ratings">
                      <span>
                        Overall:{' '}
                        {store.averageRating !== null
                          ? `${store.averageRating} / 5`
                          : 'No ratings yet'}
                      </span>
                      <span>
                        Your Rating:{' '}
                        {store.userRating ? `${store.userRating} / 5` : 'Not rated'}
                      </span>
                    </div>
                  </div>
                  <div className="store-actions">
                    <label>
                      Rate (1-5):
                      <select
                        value={ratingInputs[store.id] || ''}
                        onChange={(e) =>
                          setRatingInputs({
                            ...ratingInputs,
                            [store.id]: parseInt(e.target.value, 10),
                          })
                        }
                      >
                        <option value="">Select</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    {store.userRating ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={submitting === store.id}
                        onClick={() => submitRating(store.id, true)}
                      >
                        {submitting === store.id ? 'Updating...' : 'Update Rating'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={submitting === store.id}
                        onClick={() => submitRating(store.id, false)}
                      >
                        {submitting === store.id ? 'Submitting...' : 'Submit Rating'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
