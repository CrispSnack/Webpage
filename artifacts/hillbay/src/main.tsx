import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// Point all API calls at the deployed API server.
// Set VITE_API_BASE_URL in Vercel → Project Settings → Environment Variables.
// Falls back to same-origin (dev proxy) when the var is absent.
const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
if (apiBase) setBaseUrl(apiBase);

createRoot(document.getElementById('root')!).render(<App />);
