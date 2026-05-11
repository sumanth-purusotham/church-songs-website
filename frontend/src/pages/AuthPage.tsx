import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const mode = location.pathname.includes('register') ? 'register' : 'login';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      if (mode === 'register') {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch {
      setError('Authentication failed. Please check your details.');
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-xl border border-black/15 p-6">
      <h1 className="text-2xl font-semibold">{mode === 'register' ? 'Create account' : 'Welcome back'}</h1>
      <p className="mt-2 text-sm text-black/70">
        {mode === 'register' ? 'Register to upload and manage songs.' : 'Login to upload and manage songs.'}
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <label className="block text-sm font-medium">
            Name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
            />
          </label>
        )}

        <label className="block text-sm font-medium">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
          />
        </label>

        <label className="block text-sm font-medium">
          Password
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
          {mode === 'register' ? 'Register' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-black/70">
        {mode === 'register' ? 'Already have an account?' : 'New here?'}{' '}
        <Link to={mode === 'register' ? '/login' : '/register'} className="font-medium underline">
          {mode === 'register' ? 'Login' : 'Create one'}
        </Link>
      </p>
    </section>
  );
};
