export default function Account() {
  const orders = [
    { id: 'ORD-9088', date: 'OCT 12, 2024', status: 'DELIVERED', items: 3, total: 1298 },
    { id: 'ORD-7742', date: 'SEP 05, 2024', status: 'DELIVERED', items: 1, total: 548 },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-16 md:py-24 w-full">
      <h1 className="text-6xl md:text-8xl font-heading font-bold uppercase tracking-tighter mb-16 border-b border-border pb-8">
        ACCOUNT
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4 space-y-12">
          <div className="bg-card border border-border p-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">PROFILE</h2>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center font-heading text-3xl font-bold">
                A
              </div>
              <div>
                <p className="font-bold text-xl uppercase mb-1">ADITI SHARMA</p>
                <p className="text-foreground/60 text-sm font-bold uppercase tracking-widest">ADITI.S@EXAMPLE.COM</p>
              </div>
            </div>
            
            <div className="border-t border-border pt-8 mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">ADDRESS</h2>
              <p className="text-sm font-bold uppercase tracking-wider text-foreground/80 leading-relaxed">
                BLOCK A, APT 402<br />
                KORAMANGALA, BENGALURU<br />
                KARNATAKA 560034
              </p>
            </div>
            
            <button className="w-full border border-border py-4 text-sm font-bold uppercase tracking-widest hover:border-secondary hover:text-secondary transition-colors">
              LOG OUT
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-8">
          <h2 className="text-2xl font-heading font-bold uppercase tracking-tighter mb-8">ORDER HISTORY</h2>
          
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-card border border-border p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-primary transition-colors">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <h3 className="font-heading text-2xl font-bold text-primary">#{order.id}</h3>
                    <span className="text-[10px] font-bold bg-muted px-2 py-1 uppercase tracking-widest text-foreground">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-foreground/50">
                    {order.date} // {order.items} ITEMS
                  </p>
                </div>
                
                <div className="flex items-center justify-between w-full md:w-auto gap-8 pt-4 md:pt-0 border-t border-border md:border-none mt-2 md:mt-0">
                  <span className="font-heading text-3xl font-bold">₹{order.total.toLocaleString('en-IN')}</span>
                  <button className="text-xs font-bold uppercase tracking-widest border-b border-foreground hover:text-primary hover:border-primary pb-0.5 transition-colors">
                    VIEW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
