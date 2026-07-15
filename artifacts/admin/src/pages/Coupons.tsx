import { useState } from 'react';
import { useAdminListCoupons, useAdminCreateCoupon, useAdminDeleteCoupon, useAdminUpdateCoupon } from '@workspace/api-client-react';
import { Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, NativeSelect, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Label, Switch } from '@/components/ui';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export function Coupons() {
  const { data, isLoading, refetch } = useAdminListCoupons();
  const createMutation = useAdminCreateCoupon();
  const updateMutation = useAdminUpdateCoupon();
  const deleteMutation = useAdminDeleteCoupon();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [code, setCode] = useState('');
  const [type, setType] = useState('percent');
  const [value, setValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [active, setActive] = useState(true);

  const coupons = data?.coupons || [];

  const handleOpenNew = () => {
    setEditingId(null);
    setCode('');
    setType('percent');
    setValue('');
    setMinOrderAmount('');
    setMaxUses('');
    setExpiresAt('');
    setActive(true);
    setIsOpen(true);
  };

  const handleOpenEdit = (coupon: any) => {
    setEditingId(coupon.id);
    setCode(coupon.code);
    setType(coupon.type);
    setValue(coupon.value.toString());
    setMinOrderAmount(coupon.minOrderAmount?.toString() || '');
    setMaxUses(coupon.maxUses?.toString() || '');
    setExpiresAt(coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '');
    setActive(coupon.active);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code,
      type,
      value: parseFloat(value),
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : undefined,
      maxUses: maxUses ? parseInt(maxUses) : undefined,
      active,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload as any }, {
        onSuccess: () => { setIsOpen(false); refetch(); }
      });
    } else {
      createMutation.mutate({ data: payload as any }, {
        onSuccess: () => { setIsOpen(false); refetch(); }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      deleteMutation.mutate({ id }, { onSuccess: () => refetch() });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground">Manage discount codes.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew}><Plus className="w-4 h-4 mr-2" /> Create Coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input value={code} onChange={e => setCode(e.target.value.toUpperCase())} required placeholder="e.g. FESTIVE20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <NativeSelect value={type} onChange={e => setType(e.target.value)}>
                    <option value="percent">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </NativeSelect>
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input type="number" step="0.01" value={value} onChange={e => setValue(e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Order Amount</Label>
                  <Input type="number" step="0.01" value={minOrderAmount} onChange={e => setMinOrderAmount(e.target.value)} placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label>Max Uses</Label>
                  <Input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="Optional" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Label>Active Status</Label>
                <Switch checked={active} onCheckedChange={setActive} />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Save Coupon</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No coupons created yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map(coupon => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-bold">{coupon.code}</TableCell>
                  <TableCell>
                    {coupon.type === 'percent' ? `${coupon.value}%` : `₹${coupon.value}`}
                    {coupon.minOrderAmount && <span className="block text-xs text-muted-foreground">Min ₹{coupon.minOrderAmount}</span>}
                  </TableCell>
                  <TableCell>
                    {coupon.usedCount} / {coupon.maxUses || '∞'}
                  </TableCell>
                  <TableCell>
                    {coupon.expiresAt ? format(new Date(coupon.expiresAt), 'MMM d, yyyy') : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.active ? 'default' : 'secondary'}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(coupon)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
