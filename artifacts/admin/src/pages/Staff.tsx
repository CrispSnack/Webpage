import { useState } from 'react';
import { useAdminListStaff, useAdminCreateStaff, useAdminUpdateStaff, useAdminDeleteStaff, useAdminGetMe } from '@workspace/api-client-react';
import { Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, NativeSelect, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Label, Switch } from '@/components/ui';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';

export function Staff() {
  const [, setLocation] = useLocation();
  const { data: me } = useAdminGetMe();
  
  if (me && me.staff.role !== 'owner') {
    setLocation('/dashboard');
    return null;
  }

  const { data, isLoading, refetch } = useAdminListStaff();
  const createMutation = useAdminCreateStaff();
  const updateMutation = useAdminUpdateStaff();
  const deleteMutation = useAdminDeleteStaff();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [active, setActive] = useState(true);

  const staffList = data?.staff || [];

  const handleOpenNew = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('staff');
    setActive(true);
    setIsOpen(true);
  };

  const handleOpenEdit = (staff: any) => {
    setEditingId(staff.id);
    setName(staff.name);
    setEmail(staff.email);
    setPassword(''); // don't load password
    setRole(staff.role);
    setActive(staff.active);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const payload: any = { name, role, active };
      if (password) payload.password = password;
      updateMutation.mutate({ id: editingId, data: payload }, {
        onSuccess: () => { setIsOpen(false); refetch(); }
      });
    } else {
      createMutation.mutate({ data: { name, email, password, role } }, {
        onSuccess: () => { setIsOpen(false); refetch(); }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      deleteMutation.mutate({ id }, { onSuccess: () => refetch() });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">Manage admin access and roles.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew}><Plus className="w-4 h-4 mr-2" /> Add Staff</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={!!editingId} />
              </div>
              <div className="space-y-2">
                <Label>{editingId ? 'New Password (leave blank to keep current)' : 'Password'}</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required={!editingId} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <NativeSelect value={role} onChange={e => setRole(e.target.value)}>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="owner">Owner</option>
                </NativeSelect>
              </div>
              {editingId && (
                <div className="flex items-center justify-between pt-2">
                  <Label>Active Access</Label>
                  <Switch checked={active} onCheckedChange={setActive} />
                </div>
              )}
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading staff...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map(member => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell className="capitalize">{member.role}</TableCell>
                  <TableCell>
                    <Badge variant={member.active ? 'default' : 'secondary'}>
                      {member.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(member)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} disabled={me?.staff.id === member.id}>
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
