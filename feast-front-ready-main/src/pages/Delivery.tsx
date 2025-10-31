import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { translations } from '@/lib/translations';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, ShoppingBag } from 'lucide-react';

const Delivery = () => {
  const { language } = useLanguage();
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { toast } = useToast();
  const t = translations[language];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    customer_email: '',
    special_instructions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast({
        title: t.cartEmpty,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        ...formData,
        order_items: JSON.parse(JSON.stringify(cart)),
        total_amount: total,
        payment_method: 'cash_on_delivery',
        status: 'pending',
      };

      const { error } = await supabase.from('orders').insert([orderData]);

      if (error) throw error;

      toast({
        title: t.orderSuccess,
      });

      clearCart();
      setFormData({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        customer_email: '',
        special_instructions: '',
      });
    } catch (error) {
      toast({
        title: t.error,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t.deliveryTitle}</h1>
        <p className="text-xl text-muted-foreground">{t.deliverySubtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t.yourCart}</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t.cartEmpty}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-4 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>{t.total}:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.deliveryTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.name} *</label>
                <Input
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  placeholder={t.name}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.phone} *</label>
                <Input
                  name="customer_phone"
                  type="tel"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  required
                  placeholder={t.phone}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.address} *</label>
                <Textarea
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleChange}
                  required
                  placeholder={t.address}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.email}</label>
                <Input
                  name="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder={t.email}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.specialInstructions}</label>
                <Textarea
                  name="special_instructions"
                  value={formData.special_instructions}
                  onChange={handleChange}
                  placeholder={t.specialInstructions}
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || cart.length === 0}
              >
                {loading ? t.loading : t.placeOrder}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Delivery;