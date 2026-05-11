import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAuth } from './context/useAuth';
import { AuthPage } from './pages/AuthPage';
import { SongDetailPage } from './pages/SongDetailPage';
import { SongsPage } from './pages/SongsPage';
import { UploadPage } from './pages/UploadPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SongsPage />} />
        <Route path="/songs/:id" element={<SongDetailPage />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
