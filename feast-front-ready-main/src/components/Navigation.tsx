import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export const Navigation = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const { cart } = useCart();
  const t = translations[language];

  const links = [
    { path: '/', label: t.home },
    { path: '/menu', label: t.menu },
    { path: '/reservation', label: t.reservation },
    { path: '/delivery', label: t.delivery },
  ];

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Restaurant
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors hover:text-primary ${
                    location.pathname === link.path
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link to="/delivery">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            <LanguageSwitcher />
          </div>
        </div>

        <div className="md:hidden mt-4 flex gap-4 overflow-x-auto pb-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`whitespace-nowrap transition-colors hover:text-primary ${
                location.pathname === link.path
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};