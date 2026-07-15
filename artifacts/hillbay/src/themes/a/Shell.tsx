import './tokens.css';
import { Route, Switch, useRoute } from 'wouter';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AnnouncementBar from './components/AnnouncementBar';
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Account from './pages/Account';

export default function ThemeAShell() {
  const [match, params] = useRoute('/__preview/a/*');
  
  return (
    <div className="theme-a min-h-screen flex flex-col bg-background text-foreground font-sans">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 flex flex-col">
        <Switch>
          <Route path="/__preview/a" component={Home} />
          <Route path="/__preview/a/collections" component={Collections} />
          <Route path="/__preview/a/products/:slug" component={ProductDetail} />
          <Route path="/__preview/a/cart" component={CartPage} />
          <Route path="/__preview/a/checkout" component={Checkout} />
          <Route path="/__preview/a/account" component={Account} />
        </Switch>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
