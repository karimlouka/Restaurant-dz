import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users } from 'lucide-react';

const Reservation = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = translations[language];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    reservation_date: '',
    reservation_time: '',
    number_of_guests: 2,
    special_requests: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('reservations').insert([formData]);

      if (error) throw error;

      toast({
        title: t.reservationSuccess,
      });

      setFormData({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        reservation_date: '',
        reservation_time: '',
        number_of_guests: 2,
        special_requests: '',
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
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t.reservationTitle}</h1>
          <p className="text-xl text-muted-foreground">{t.reservationSubtitle}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.reservationTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <label className="text-sm font-medium">{t.email}</label>
                <Input
                  name="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder={t.email}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t.date} *
                  </label>
                  <Input
                    name="reservation_date"
                    type="date"
                    value={formData.reservation_date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t.time} *
                  </label>
                  <Input
                    name="reservation_time"
                    type="time"
                    value={formData.reservation_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t.guests} *
                </label>
                <Input
                  name="number_of_guests"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.number_of_guests}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.specialRequests}</label>
                <Textarea
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleChange}
                  placeholder={t.specialRequests}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t.loading : t.submitReservation}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reservation;