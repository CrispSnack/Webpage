import { useState } from 'react';
import { useAdminGetMe, useAdminUpdateStaff } from '@workspace/api-client-react';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function Account() {
  const { data, isLoading } = useAdminGetMe();
  const updateMutation = useAdminUpdateStaff();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');

  if (isLoading || !data) return <div className="p-8">Loading...</div>;

  const staff = data.staff;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    
    const payload: any = { name: name || staff.name };
    if (password) payload.password = password;

    updateMutation.mutate({ id: staff.id, data: payload }, {
      onSuccess: () => {
        setSuccess('Profile updated successfully');
        setPassword('');
        queryClient.invalidateQueries({ queryKey: ['adminGetMe'] });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your personal profile.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            {success && <div className="p-3 text-sm bg-primary/10 text-primary rounded-md">{success}</div>}
            
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={staff.email} disabled className="bg-muted" />
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <div>
                <Badge className="capitalize">{staff.role}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                defaultValue={staff.name} 
                onChange={e => setName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Change Password (leave blank to keep current)</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
