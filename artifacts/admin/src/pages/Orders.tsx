import { useState } from 'react';
import { useAdminListOrders } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Search, Eye } from 'lucide-react';
import { Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, NativeSelect } from '@/components/ui';
import { format } from 'date-fns';

export function Orders() {
  const [status, setStatus] = useState('');
  
  const { data, isLoading } = useAdminListOrders({ status: status || undefined });

  const orders = data?.orders || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="w-full sm:w-64">
          <NativeSelect value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </NativeSelect>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-medium">No orders found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy HH:mm')}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.shippingAddress?.name || 'Guest'}</div>
                    <div className="text-xs text-muted-foreground">{order.guestEmail || order.userId}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="capitalize">
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'delivered' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'} className="capitalize">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">₹{parseFloat(order.total).toFixed(2)}</TableCell>
                  <TableCell>
                    <Link href={`/orders/${order.id}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-9 w-9">
                      <Eye className="w-4 h-4" />
                    </Link>
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
