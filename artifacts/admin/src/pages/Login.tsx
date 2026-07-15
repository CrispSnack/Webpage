import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAdminLogin, useAdminGetMe } from '@workspace/api-client-react';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Store, Loader2 } from 'lucide-react';

export function Login() {
  const [location, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { data: user, isLoading: userLoading } = useAdminGetMe({
    query: { retry: false }
  });
  
  const loginMutation = useAdminLogin();

  useEffect(() => {
    if (user?.staff) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    loginMutation.mutate(
      { data: { email, password } },
      {
        onSuccess: () => {
          setLocation('/dashboard');
        },
        onError: (err: any) => {
          setErrorMsg(err.message || 'Invalid email or password');
        }
      }
    );
  };

  if (userLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-3 items-center text-center pt-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to manage Crispy N Snacky</p>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                {errorMsg}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@crispynsnacky.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
