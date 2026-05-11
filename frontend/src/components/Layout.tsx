import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Church Songs
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'underline' : 'opacity-80 hover:opacity-100')}>
              Songs
            </NavLink>
            <NavLink
              to="/upload"
              className={({ isActive }) => (isActive ? 'underline' : 'opacity-80 hover:opacity-100')}
            >
              Upload
            </NavLink>
          </nav>

          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <span className="hidden md:inline">{user.name}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md border border-black px-3 py-1.5 transition hover:bg-black hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-md border border-black px-3 py-1.5 hover:bg-black hover:text-white">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-black px-3 py-1.5 text-white transition hover:bg-black/80"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</main>
    </div>
  );
};
