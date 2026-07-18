import { useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminGetProduct, useAdminCreateProduct, useAdminUpdateProduct } from '@workspace/api-client-react';
import { Button, Input, Textarea, Label, Switch, Card, CardContent, CardHeader, CardTitle, NativeSelect } from '@/components/ui';
import { ImageUploader } from '@/components/ImageUploader';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  comparePrice: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  badge: z.string().optional(),
  stock: z.coerce.number().min(0),
  gstRate: z.string().min(1),
  weight: z.string().optional(),
  active: z.boolean(),
  featured: z.boolean(),
  images: z.string().optional(), // We'll parse this to array
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const id = params.id ? parseInt(params.id) : undefined;
  const isEditing = !!id;

  const { data: productData, isLoading: isFetching } = useAdminGetProduct(id as any, { query: { enabled: isEditing } });
  
  const createMutation = useAdminCreateProduct();
  const updateMutation = useAdminUpdateProduct();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: '',
      comparePrice: '',
      category: 'tea',
      badge: '',
      stock: 0,
      gstRate: '5',
      weight: '',
      active: true,
      featured: false,
      images: '',
    }
  });

  useEffect(() => {
    if (productData?.product) {
      const p = productData.product;
      form.reset({
        name: p.name,
        slug: p.slug,
        description: p.description || '',
        shortDescription: p.shortDescription || '',
        price: p.price,
        comparePrice: p.comparePrice || '',
        category: p.category,
        badge: p.badge || '',
        stock: p.stock,
        gstRate: p.gstRate,
        weight: p.weight || '',
        active: p.active,
        featured: p.featured,
        images: p.images?.join('\n') || '',
      });
    }
  }, [productData, form]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('name', e.target.value);
    if (!isEditing && !form.formState.dirtyFields.slug) {
      form.setValue('slug', generateSlug(e.target.value));
    }
  };

  const onSubmit = (data: ProductFormData) => {
    const payload = {
      ...data,
      images: data.images ? data.images.split('\n').map(u => u.trim()).filter(Boolean) : [],
      comparePrice: data.comparePrice || null,
      badge: data.badge || null,
      weight: data.weight || null,
      description: data.description || '',
      shortDescription: data.shortDescription || '',
    };

    if (isEditing) {
      updateMutation.mutate({ id: id!, data: payload }, {
        onSuccess: () => setLocation('/products')
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => setLocation('/products')
      });
    }
  };

  if (isEditing && isFetching) return <div className="p-8">Loading...</div>;

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/products" className="inline-flex items-center justify-center rounded-md w-9 h-9 hover:bg-muted">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input {...form.register('name')} onChange={handleNameChange} />
                  {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input {...form.register('slug')} />
                </div>
                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Textarea {...form.register('shortDescription')} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea {...form.register('description')} rows={5} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Media</CardTitle></CardHeader>
              <CardContent>
                <ImageUploader
                  value={form.watch('images') ?? ''}
                  onChange={(val) => form.setValue('images', val, { shouldDirty: true })}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Pricing & Inventory</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" step="0.01" {...form.register('price')} />
                  </div>
                  <div className="space-y-2">
                    <Label>Compare at Price (₹)</Label>
                    <Input type="number" step="0.01" {...form.register('comparePrice')} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stock Quantity</Label>
                    <Input type="number" {...form.register('stock')} />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight</Label>
                    <Input {...form.register('weight')} placeholder="e.g. 250g" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <NativeSelect {...form.register('category')}>
                    <option value="tea">Tea</option>
                    <option value="snacks">Snacks</option>
                  </NativeSelect>
                </div>
                <div className="space-y-2">
                  <Label>Badge</Label>
                  <NativeSelect {...form.register('badge')}>
                    <option value="">None</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="New">New</option>
                    <option value="Sale">Sale</option>
                    <option value="Gift Pick">Gift Pick</option>
                    <option value="Organic">Organic</option>
                    <option value="Limited">Limited</option>
                  </NativeSelect>
                </div>
                <div className="space-y-2">
                  <Label>GST Rate (%)</Label>
                  <NativeSelect {...form.register('gstRate')}>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                  </NativeSelect>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="cursor-pointer">Active</Label>
                  <Switch 
                    checked={form.watch('active')} 
                    onCheckedChange={(c) => form.setValue('active', c)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="cursor-pointer">Featured</Label>
                  <Switch 
                    checked={form.watch('featured')} 
                    onCheckedChange={(c) => form.setValue('featured', c)} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t pt-6">
          <Link href="/products" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
            Cancel
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Product
          </Button>
        </div>
      </form>
    </div>
  );
}
