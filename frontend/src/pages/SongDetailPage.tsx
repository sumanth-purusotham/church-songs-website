import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/useAuth';
import type { Song } from '../types';

export const SongDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [song, setSong] = useState<Song | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSong = async () => {
      try {
        const { data } = await api.get<Song>(`/api/songs/${id}`);
        setSong(data);
      } catch {
        setError('Song not found.');
      }
    };

    if (id) {
      loadSong();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!song || !confirm('Are you sure you want to delete this song?')) {
      return;
    }

    await api.delete(`/api/songs/${song._id}`);
    navigate('/');
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!song) {
    return <p>Loading...</p>;
  }

  const fileUrl = `${import.meta.env.VITE_API_URL || ''}/uploads/${song.fileName}`;

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-black/15 p-6">
        <h1 className="text-3xl font-semibold tracking-tight">{song.name}</h1>
        <p className="mt-3 whitespace-pre-wrap text-black/80">{song.description}</p>

        <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium">Creator</dt>
            <dd>{song.creatorName}</dd>
          </div>
          <div>
            <dt className="font-medium">Upload date</dt>
            <dd>{new Date(song.createdAt).toLocaleString()}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={fileUrl}
            download={song.originalFileName}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80"
          >
            Download PPT
          </a>

          <a href={fileUrl} target="_blank" rel="noreferrer" className="rounded-md border border-black px-4 py-2 text-sm">
            Open file
          </a>

          {user?.name === song.creatorName && (
            <button type="button" onClick={handleDelete} className="rounded-md border border-red-600 px-4 py-2 text-sm text-red-600">
              Delete song
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-black/30 p-6 text-sm text-black/70">
        PPT preview depends on browser support. Use <strong>Open file</strong> or <strong>Download PPT</strong> for full presentation.
      </div>
    </section>
  );
};
