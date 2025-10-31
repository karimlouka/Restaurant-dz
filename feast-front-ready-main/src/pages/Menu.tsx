import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { translations } from '@/lib/translations';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShoppingCart } from 'lucide-react';

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
}

interface Dish {
  id: string;
  category_id: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
  description_en: string;
  description_ar: string;
  description_fr: string;
  price: number;
  image_url: string | null;
  is_available: boolean;
}

const Menu = () => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const t = translations[language];
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      const [categoriesResult, dishesResult] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('dishes').select('*').order('display_order'),
      ]);

      if (categoriesResult.data) setCategories(categoriesResult.data);
      if (dishesResult.data) setDishes(dishesResult.data);
    } catch (error) {
      toast({
        title: t.error,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (dish: Dish) => {
    addToCart({
      id: dish.id,
      name: dish[`name_${language}` as keyof Dish] as string,
      price: dish.price,
      image_url: dish.image_url || undefined,
    });
    toast({
      title: t.addToCart,
      description: `${dish[`name_${language}` as keyof Dish]} ${t.addToCart}`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t.menuTitle}</h1>
        <p className="text-xl text-muted-foreground">{t.menuSubtitle}</p>
      </div>

      {categories.map((category) => {
        const categoryDishes = dishes.filter((d) => d.category_id === category.id);
        if (categoryDishes.length === 0) return null;

        return (
          <div key={category.id} className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              {category[`name_${language}` as keyof Category]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryDishes.map((dish) => (
                <Card key={dish.id} className="overflow-hidden hover-scale">
                  {dish.image_url && (
                    <div className="aspect-video bg-muted">
                      <img
                        src={dish.image_url}
                        alt={dish[`name_${language}` as keyof Dish] as string}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <h3 className="text-xl font-semibold">
                      {dish[`name_${language}` as keyof Dish]}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {dish[`description_${language}` as keyof Dish]}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">${dish.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handleAddToCart(dish)}
                      disabled={!dish.is_available}
                      className="w-full"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {dish.is_available ? t.addToCart : t.unavailable}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;