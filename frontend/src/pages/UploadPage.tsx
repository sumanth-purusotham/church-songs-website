import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/useAuth';

export const UploadPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError('Please login before uploading.');
      return;
    }

    if (!file) {
      setError('Please select a .ppt or .pptx file.');
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('name', name);
      form.append('description', description);
      form.append('file', file);

      const { data } = await api.post<{ _id: string }>('/api/songs/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate(`/songs/${data._id}`);
    } catch {
      setError('Upload failed. Please check your inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-black/15 p-6">
      <h1 className="text-2xl font-semibold">Upload Devotional Song</h1>
      <p className="mt-2 text-sm text-black/70">Upload a PPT/PPTX file with song details for church service use.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">
          Song name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
          />
        </label>

        <label className="block text-sm font-medium">
          Description
          <textarea
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            className="mt-1 w-full rounded-md border border-black/20 px-3 py-2 outline-none focus:border-black"
          />
        </label>

        <label className="block text-sm font-medium">
          PPT file
          <input
            required
            type="file"
            accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? 'Uploading...' : 'Upload song'}
        </button>
      </form>
    </section>
  );
};
