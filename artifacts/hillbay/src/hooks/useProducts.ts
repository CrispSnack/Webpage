import { useQuery } from '@tanstack/react-query';
import type { ApiProduct } from '../types/product';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ?? '';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

export function useProducts(params: { category?: string; featured?: boolean; q?: string } = {}) {
  const search = new URLSearchParams();
  if (params.category) search.set('category', params.category);
  if (params.featured) search.set('featured', 'true');
  if (params.q) search.set('q', params.q);
  const qs = search.toString() ? `?${search}` : '';

  return useQuery<ApiProduct[]>({
    queryKey: ['products', params],
    queryFn: async () => {
      const data = await get<{ products: ApiProduct[] }>(`/api/products${qs}`);
      return data.products;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery<ApiProduct>({
    queryKey: ['product', slug],
    enabled: !!slug,
    queryFn: async () => {
      const data = await get<{ product: ApiProduct }>(`/api/products/${slug}`);
      return data.product;
    },
  });
}
