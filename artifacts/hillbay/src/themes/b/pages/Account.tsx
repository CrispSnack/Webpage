import { Package } from 'lucide-react';

export default function Account() {
  const orders = [
    { id: '#ORD-001', date: 'Oct 12, 2024', status: 'Delivered', items: 3, total: 1298 },
    { id: '#ORD-002', date: 'Sep 05, 2024', status: 'Delivered', items: 1, total: 548 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 w-full bg-background min-h-screen">
      <h1 className="text-4xl md:text-5xl font-heading italic mb-12">My Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-8 bg-card p-8 rounded-3xl border border-border shadow-sm h-fit">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary font-heading italic text-3xl mb-6">
            A
          </div>
          <div>
            <h2 className="text-[13px] font-bold text-foreground/50 mb-2 uppercase tracking-wider">Profile</h2>
            <p className="font-bold text-lg">Aditi Sharma</p>
            <p className="text-foreground/70 text-[15px]">aditi.s@example.com</p>
          </div>
          <div className="border-t border-border pt-6">
            <h2 className="text-[13px] font-bold text-foreground/50 mb-3 uppercase tracking-wider">Saved Address</h2>
            <p className="text-[15px] text-foreground/80 leading-relaxed font-medium">
              Block A, Apt 402<br />
              Koramangala, Bengaluru<br />
              Karnataka 560034
            </p>
          </div>
          <button className="w-full py-3 bg-muted text-foreground rounded-xl font-bold border border-border hover:bg-background transition-colors mt-4">
            Log Out
          </button>
        </div>
        
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-heading italic mb-6 text-primary">Recent Orders</h2>
          
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-primary">
                    <Package className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-foreground">{order.id}</h3>
                    <p className="text-[15px] text-foreground/60 font-medium">{order.date} • {order.items} Items</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-border pt-4 md:pt-0">
                  <span className="text-[14px] font-bold bg-secondary/10 text-secondary px-4 py-1.5 rounded-full">
                    {order.status}
                  </span>
                  <span className="font-bold text-xl">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
