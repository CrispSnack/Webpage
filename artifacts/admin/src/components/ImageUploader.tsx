import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_ADMIN_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ?? '';

interface ImageUploaderProps {
  /** Current images as newline-separated URLs (matches the form field) */
  value: string;
  onChange: (value: string) => void;
}

async function requestUploadUrl(file: File): Promise<{ uploadURL: string; objectPath: string }> {
  const res = await fetch(`${API_BASE}/api/storage/uploads/request-url`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
  });
  if (!res.ok) throw new Error(`Failed to get upload URL: ${res.status}`);
  return res.json();
}

async function uploadToGcs(file: File, uploadURL: string): Promise<void> {
  const res = await fetch(uploadURL, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`GCS upload failed: ${res.status}`);
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const urls = value
    .split('\n')
    .map((u) => u.trim())
    .filter(Boolean);

  const serveUrl = (objectPath: string) =>
    `${API_BASE}/api/storage${objectPath}`;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    const newUrls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          setError(`"${file.name}" is not an image.`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          setError(`"${file.name}" exceeds the 10 MB limit.`);
          continue;
        }
        const { uploadURL, objectPath } = await requestUploadUrl(file);
        await uploadToGcs(file, uploadURL);
        newUrls.push(serveUrl(objectPath));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }

    if (newUrls.length > 0) {
      const combined = [...urls, ...newUrls].join('\n');
      onChange(combined);
    }
  };

  const removeUrl = (idx: number) => {
    const next = urls.filter((_, i) => i !== idx).join('\n');
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {/* Existing images */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {urls.map((url, idx) => (
            <div key={idx} className="relative group aspect-square rounded-md overflow-hidden border border-border bg-muted">
              <img
                src={url}
                alt={`Product image ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => removeUrl(idx)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-md p-6 cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
      >
        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Uploading…</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium">Click or drag &amp; drop images here</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10 MB each</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Manual URL fallback */}
      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground flex items-center gap-1 select-none">
          <ImageIcon className="w-3 h-3" />
          Or paste image URLs manually
        </summary>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg"
          className="mt-2 w-full px-3 py-2 text-xs rounded-md border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />
      </details>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
