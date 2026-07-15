import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAdminGetMe, useAdminLogout } from '@workspace/api-client-react';
import { LayoutDashboard, Package, ShoppingCart, Tag, Users, User, LogOut, Loader2, Store } from 'lucide-react';
import { Button } from '@/components/ui';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data, isLoading, error } = useAdminGetMe({
    query: {
      retry: false,
    }
  });
  
  const logout = useAdminLogout();

  useEffect(() => {
    if (!isLoading && (error || !data)) {
      setLocation('/login');
    }
  }, [isLoading, error, data, setLocation]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const staff = data.staff;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setLocation('/login');
      }
    });
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/coupons', label: 'Coupons', icon: Tag },
  ];

  if (staff.role === 'owner') {
    navItems.push({ href: '/staff', label: 'Staff', icon: Users });
  }
  
  navItems.push({ href: '/account', label: 'Account', icon: User });

  return (
    <div className="flex min-h-[100dvh] bg-muted/40">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col hidden md:flex">
        <div className="p-6 border-b flex items-center gap-2">
          <Store className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">Crispy N Snacky</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t space-y-4">
          <div className="px-3">
            <p className="text-sm font-medium leading-none truncate">{staff.name}</p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">{staff.role}</p>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="h-14 border-b bg-card flex items-center px-4 md:hidden">
          <Store className="w-5 h-5 text-primary mr-2" />
          <span className="font-bold text-sm">Crispy N Snacky</span>
        </header>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
