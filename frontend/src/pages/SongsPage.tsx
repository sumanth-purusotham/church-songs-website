import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { PaginatedSongs } from '../types';

export const SongsPage = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [songsData, setSongsData] = useState<PaginatedSongs | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get<PaginatedSongs>('/api/songs', {
          params: { search: query, page, limit: 9 }
        });
        setSongsData(data);
      } catch {
        setSongsData({
          items: [],
          pagination: { page: 1, limit: 9, total: 0, totalPages: 0 }
        });
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(id);
  }, [page, query]);

  const songs = songsData?.items || [];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Devotional Songs Library</h1>
          <p className="mt-2 text-sm text-black/70">Browse, search, and download church devotional song presentations.</p>
        </div>

        <input
          value={query}
          onChange={(event) => {
            setPage(1);
            setQuery(event.target.value);
          }}
          placeholder="Search by song, description, creator"
          className="w-full rounded-md border border-black/20 px-3 py-2 text-sm outline-none transition focus:border-black md:max-w-sm"
        />
      </div>

      {loading && <p className="text-sm">Loading songs...</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {songs.map((song) => (
          <article
            key={song._id}
            className="rounded-xl border border-black/15 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow"
          >
            <h2 className="line-clamp-2 text-lg font-semibold">{song.name}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-black/70">{song.description}</p>
            <dl className="mt-4 space-y-1 text-xs text-black/70">
              <div>
                <dt className="inline font-medium text-black">Creator:</dt> <dd className="inline">{song.creatorName}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-black">Uploaded:</dt>{' '}
                <dd className="inline">{new Date(song.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
            <Link
              to={`/songs/${song._id}`}
              className="mt-4 inline-block rounded-md bg-black px-3 py-2 text-sm text-white transition hover:bg-black/80"
            >
              View details
            </Link>
          </article>
        ))}
      </div>

      {songs.length === 0 && !loading && <p className="rounded-md border border-dashed border-black/20 p-6 text-sm">No songs found.</p>}

      {songsData && songsData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="rounded border border-black px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} / {songsData.pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(songsData.pagination.totalPages, prev + 1))}
            disabled={page >= songsData.pagination.totalPages}
            className="rounded border border-black px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};
