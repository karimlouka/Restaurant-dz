import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChefHat, Clock, MapPin, Star } from 'lucide-react';

const Index = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <ChefHat className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/menu">
                <Button size="lg" className="text-lg px-8">
                  {t.orderNow}
                </Button>
              </Link>
              <Link to="/reservation">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  {t.bookTable}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-lg bg-card hover-scale">
              <div className="inline-block p-4 bg-primary/10 rounded-full">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                {language === 'ar' ? 'جودة عالية' : language === 'fr' ? 'Haute Qualité' : 'High Quality'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'مكونات طازجة ووصفات أصيلة'
                  : language === 'fr'
                  ? 'Ingrédients frais et recettes authentiques'
                  : 'Fresh ingredients and authentic recipes'}
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-card hover-scale">
              <div className="inline-block p-4 bg-primary/10 rounded-full">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                {language === 'ar' ? 'توصيل سريع' : language === 'fr' ? 'Livraison Rapide' : 'Fast Delivery'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'ar'
                  ? 'توصيل طلبك في 30-45 دقيقة'
                  : language === 'fr'
                  ? 'Votre commande livrée en 30-45 minutes'
                  : 'Your order delivered in 30-45 minutes'}
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-card hover-scale">
              <div className="inline-block p-4 bg-primary/10 rounded-full">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                {language === 'ar' ? 'موقع مميز' : language === 'fr' ? 'Emplacement Premium' : 'Prime Location'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'ar'
                  ? 'في قلب المدينة مع مواقف سيارات مجانية'
                  : language === 'fr'
                  ? 'Au cœur de la ville avec parking gratuit'
                  : 'In the heart of the city with free parking'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold">
              {language === 'ar' 
                ? 'جاهز لتجربة أفضل الأطباق؟'
                : language === 'fr'
                ? 'Prêt à découvrir les meilleurs plats?'
                : 'Ready to Experience the Best Dishes?'}
            </h2>
            <p className="text-xl text-muted-foreground">
              {language === 'ar'
                ? 'استكشف قائمتنا الكاملة واطلب الآن'
                : language === 'fr'
                ? 'Découvrez notre menu complet et commandez maintenant'
                : 'Explore our full menu and order now'}
            </p>
            <Link to="/menu">
              <Button size="lg" className="text-lg px-8">
                {t.menu}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
