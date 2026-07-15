import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useAdminGetOrder, useAdminUpdateOrderStatus } from '@workspace/api-client-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, NativeSelect, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';
import { ArrowLeft, Loader2, CreditCard, Truck, User, MapPin, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

export function OrderDetail() {
  const params = useParams();
  const id = parseInt(params.id!);
  const queryClient = useQueryClient();

  const { data, isLoading } = useAdminGetOrder(id as any);
  const updateStatusMutation = useAdminUpdateOrderStatus();
  
  const [newStatus, setNewStatus] = useState('');

  if (isLoading) return <div className="p-8">Loading order details...</div>;
  if (!data?.order) return <div className="p-8">Order not found.</div>;

  const order = data.order;
  const address = order.shippingAddress;
  const gst = order.gstDetails;

  const handleUpdateStatus = () => {
    if (!newStatus || newStatus === order.status) return;
    updateStatusMutation.mutate({ id: order.id, data: { status: newStatus } }, {
      onSuccess: () => {
        setNewStatus('');
        queryClient.invalidateQueries({ queryKey: ['adminGetOrder'] });
        queryClient.invalidateQueries({ queryKey: ['adminListOrders'] });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders" className="inline-flex items-center justify-center rounded-md w-9 h-9 hover:bg-muted">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order {order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">{format(new Date(order.createdAt), 'MMMM d, yyyy \at h:mm a')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-card p-2 rounded-lg border shadow-sm">
          <NativeSelect 
            value={newStatus || order.status} 
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-40"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </NativeSelect>
          <Button 
            onClick={handleUpdateStatus} 
            disabled={!newStatus || newStatus === order.status || updateStatusMutation.isPending}
            size="sm"
          >
            {updateStatusMutation.isPending && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
            Update
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">GST: {item.gstRate}%</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">₹{parseFloat(item.price).toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6 space-y-2 border-t pt-4 w-64 ml-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                {parseFloat(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                    <span>-₹{parseFloat(order.discountAmount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₹{parseFloat(order.shippingAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (GST)</span>
                  <span>₹{parseFloat(order.taxAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{address?.name || 'Guest'}</p>
              <p className="text-muted-foreground">{order.guestEmail}</p>
              <p className="text-muted-foreground">{address?.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>{address?.line1}</p>
              {address?.line2 && <p>{address.line2}</p>}
              <p>{address?.city}, {address?.state} {address?.pincode}</p>
              <p>{address?.country}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                Payment Info
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="capitalize">
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-mono text-xs">{order.razorpayPaymentId}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {gst && gst.gstin && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  B2B GST Info
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Company:</span> {gst.companyName}</p>
                <p><span className="text-muted-foreground">GSTIN:</span> {gst.gstin}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
