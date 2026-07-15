import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import PickerPage from '@/pages/PickerPage';
import { Router as WouterRouter, useLocation } from 'wouter';
import { CartProvider } from './contexts/CartContext';

// Theme Shells
import ThemeAShell from './themes/a/Shell';
import ThemeBShell from './themes/b/Shell';
import ThemeCShell from './themes/c/Shell';

const queryClient = new QueryClient();

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function Router() {
  const [location] = useLocation();

  if (location === '/') return <PickerPage />;

  if (location.startsWith('/__preview/a')) return <ThemeAShell />;

  if (location.startsWith('/__preview/b')) {
    return (
      <WouterRouter base={`${BASE}/__preview/b`}>
        <ThemeBShell />
      </WouterRouter>
    );
  }

  if (location.startsWith('/__preview/c')) {
    return (
      <WouterRouter base={`${BASE}/__preview/c`}>
        <ThemeCShell />
      </WouterRouter>
    );
  }

  return <NotFound />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <WouterRouter base={BASE}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
