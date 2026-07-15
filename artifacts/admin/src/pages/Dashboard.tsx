import { useAdminListOrders, useAdminListProducts } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from '@/components/ui';
import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';

export function Dashboard() {
  const { data: ordersData, isLoading: ordersLoading } = useAdminListOrders({ limit: 10 });
  const { data: productsData, isLoading: productsLoading } = useAdminListProducts();

  const orders = ordersData?.orders || [];
  const products = productsData?.products || [];

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');
  const activeProducts = products.filter(p => p.active);
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + parseFloat(o.total), 0);

  const stats = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: DollarSign },
    { title: 'Total Orders', value: orders.length, icon: ShoppingCart },
    { title: 'Pending Orders', value: pendingOrders.length, icon: Clock },
    { title: 'Active Products', value: activeProducts.length, icon: Package },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store's performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Latest transactions from your store.</p>
          </div>
          <Link href="/orders" className="text-sm text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">No orders yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link href={`/orders/${order.id}`} className="hover:underline">{order.orderNumber}</Link>
                    </TableCell>
                    <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{order.shippingAddress?.name || order.guestEmail || 'Guest'}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'delivered' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'} className="capitalize">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">₹{parseFloat(order.total).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
