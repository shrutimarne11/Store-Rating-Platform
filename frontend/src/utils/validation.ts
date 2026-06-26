export type FormChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

export const validateName = (name: string): string | null => {
  if (!name) return 'Name is required';
  if (name.length < 20) return 'Name must be at least 20 characters';
  if (name.length > 60) return 'Name must be at most 60 characters';
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
};

export const validateAddress = (address: string): string | null => {
  if (!address) return 'Address is required';
  if (address.length > 400) return 'Address must be at most 400 characters';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8 || password.length > 16) {
    return 'Password must be 8-16 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include at least one uppercase letter';
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return 'Password must include at least one special character';
  }
  return null;
};

export const roleLabel = (role: string): string => {
  switch (role) {
    case 'system_admin':
      return 'System Administrator';
    case 'normal_user':
      return 'Normal User';
    case 'store_owner':
      return 'Store Owner';
    default:
      return role;
  }
};
