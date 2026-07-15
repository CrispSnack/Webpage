import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Router as WouterRouter } from 'wouter';
import { CartProvider } from './contexts/CartContext';
import ThemeCShell from './themes/c/Shell';

const queryClient = new QueryClient();

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <WouterRouter base={BASE}>
            <ThemeCShell />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
