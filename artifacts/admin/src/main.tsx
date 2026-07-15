import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

import App from './App';

import './index.css';

const adminApiBaseUrl = import.meta.env.VITE_ADMIN_API_BASE_URL?.trim();

if (adminApiBaseUrl) {
  setBaseUrl(adminApiBaseUrl);
}

createRoot(document.getElementById('root')!).render(<App />);
