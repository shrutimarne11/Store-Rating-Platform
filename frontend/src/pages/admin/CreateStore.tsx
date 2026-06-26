import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/Layout';
import FormField from '../../components/FormField';
import {
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
  type FormChangeEvent,
} from '../../utils/validation';

export default function CreateStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    createOwner: false,
    ownerName: '',
    ownerEmail: '',
    ownerAddress: '',
    ownerPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: FormChangeEvent) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const newErrors: Record<string, string> = {};
    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    const addressErr = validateAddress(form.address);

    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (addressErr) newErrors.address = addressErr;

    if (form.createOwner) {
      const ownerNameErr = validateName(form.ownerName);
      const ownerEmailErr = validateEmail(form.ownerEmail);
      const ownerAddressErr = validateAddress(form.ownerAddress);
      const ownerPasswordErr = validatePassword(form.ownerPassword);

      if (ownerNameErr) newErrors.ownerName = ownerNameErr;
      if (ownerEmailErr) newErrors.ownerEmail = ownerEmailErr;
      if (ownerAddressErr) newErrors.ownerAddress = ownerAddressErr;
      if (ownerPasswordErr) newErrors.ownerPassword = ownerPasswordErr;
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        address: form.address,
      };

      if (form.createOwner) {
        payload.owner = {
          name: form.ownerName,
          email: form.ownerEmail,
          address: form.ownerAddress,
          password: form.ownerPassword,
          role: 'store_owner',
        };
      }

      await api.post('/admin/stores', payload);
      navigate('/admin/stores');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message || 'Failed to create store';
      setApiError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Add Store">
      <nav className="sub-nav">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/stores">Stores</Link>
      </nav>

      <div className="card form-card">
        {apiError && <div className="alert alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit}>
          <h3>Store Details</h3>
          <FormField
            label="Store Name (20-60 characters)"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <FormField
            label="Store Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <FormField
            label="Store Address"
            name="address"
            as="textarea"
            value={form.address}
            onChange={handleChange}
            error={errors.address}
            required
          />

          <div className="checkbox-field">
            <label>
              <input
                type="checkbox"
                name="createOwner"
                checked={form.createOwner}
                onChange={handleChange}
              />
              Create and assign a Store Owner
            </label>
          </div>

          {form.createOwner && (
            <>
              <h3>Store Owner Details</h3>
              <FormField
                label="Owner Name"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                error={errors.ownerName}
                required
              />
              <FormField
                label="Owner Email"
                name="ownerEmail"
                type="email"
                value={form.ownerEmail}
                onChange={handleChange}
                error={errors.ownerEmail}
                required
              />
              <FormField
                label="Owner Address"
                name="ownerAddress"
                as="textarea"
                value={form.ownerAddress}
                onChange={handleChange}
                error={errors.ownerAddress}
                required
              />
              <FormField
                label="Owner Password"
                name="ownerPassword"
                type="password"
                value={form.ownerPassword}
                onChange={handleChange}
                error={errors.ownerPassword}
                required
              />
            </>
          )}

          <div className="form-actions">
            <Link to="/admin/stores" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
