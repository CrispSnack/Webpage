export default function Account() {
  const orders = [
    { id: '#ORD-001', date: 'Oct 12, 2024', status: 'Delivered', total: 1298 },
    { id: '#ORD-002', date: 'Sep 05, 2024', status: 'Delivered', total: 548 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 w-full">
      <h1 className="text-4xl font-heading mb-12">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 space-y-8">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-foreground/60 mb-4">Profile</h2>
            <p className="font-medium">Aditi Sharma</p>
            <p className="text-foreground/70 text-sm mt-1">aditi.s@example.com</p>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-foreground/60 mb-4">Default Address</h2>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Block A, Apt 402<br />
              Koramangala, Bengaluru<br />
              Karnataka 560034
            </p>
          </div>
          <button className="text-sm uppercase tracking-widest border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
            Log Out
          </button>
        </div>
        
        <div className="md:col-span-2">
          <h2 className="text-2xl font-heading mb-6 border-b border-border pb-4">Order History</h2>
          
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="border border-border p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-foreground/30 transition-colors">
                <div>
                  <h3 className="font-medium mb-1">{order.id}</h3>
                  <p className="text-sm text-foreground/60">{order.date}</p>
                </div>
                <div className="flex sm:flex-col justify-between items-center sm:items-end gap-2">
                  <span className="text-sm bg-muted px-3 py-1 rounded-full">{order.status}</span>
                  <span className="font-medium">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
