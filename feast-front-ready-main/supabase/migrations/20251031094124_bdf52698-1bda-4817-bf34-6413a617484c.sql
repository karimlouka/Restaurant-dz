-- Create categories table for menu organization
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dishes table for menu items
CREATE TABLE public.dishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  description_fr TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  number_of_guests INTEGER NOT NULL,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table for delivery
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_email TEXT,
  order_items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
  status TEXT NOT NULL DEFAULT 'pending',
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and dishes
CREATE POLICY "Anyone can view categories"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Anyone can view available dishes"
ON public.dishes FOR SELECT
USING (true);

-- Anyone can create reservations and orders
CREATE POLICY "Anyone can create reservations"
ON public.reservations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Insert sample categories
INSERT INTO public.categories (name_en, name_ar, name_fr, display_order) VALUES
('Appetizers', 'المقبلات', 'Entrées', 1),
('Main Courses', 'الأطباق الرئيسية', 'Plats Principaux', 2),
('Desserts', 'الحلويات', 'Desserts', 3),
('Beverages', 'المشروبات', 'Boissons', 4);

-- Insert sample dishes
INSERT INTO public.dishes (category_id, name_en, name_ar, name_fr, description_en, description_ar, description_fr, price, display_order)
SELECT 
  c.id,
  'Hummus',
  'حمص',
  'Houmous',
  'Classic chickpea dip with tahini',
  'حمص الحمص الكلاسيكي مع الطحينة',
  'Purée de pois chiches classique au tahini',
  8.99,
  1
FROM public.categories c WHERE c.name_en = 'Appetizers';

INSERT INTO public.dishes (category_id, name_en, name_ar, name_fr, description_en, description_ar, description_fr, price, display_order)
SELECT 
  c.id,
  'Grilled Chicken',
  'دجاج مشوي',
  'Poulet Grillé',
  'Tender grilled chicken with herbs',
  'دجاج مشوي طري مع الأعشاب',
  'Poulet grillé tendre aux herbes',
  18.99,
  1
FROM public.categories c WHERE c.name_en = 'Main Courses';

INSERT INTO public.dishes (category_id, name_en, name_ar, name_fr, description_en, description_ar, description_fr, price, display_order)
SELECT 
  c.id,
  'Baklava',
  'بقلاوة',
  'Baklava',
  'Sweet pastry with nuts and honey',
  'معجنات حلوة مع المكسرات والعسل',
  'Pâtisserie sucrée aux noix et au miel',
  6.99,
  1
FROM public.categories c WHERE c.name_en = 'Desserts';

INSERT INTO public.dishes (category_id, name_en, name_ar, name_fr, description_en, description_ar, description_fr, price, display_order)
SELECT 
  c.id,
  'Fresh Juice',
  'عصير طازج',
  'Jus Frais',
  'Freshly squeezed fruit juice',
  'عصير فواكه طازج',
  'Jus de fruits fraîchement pressé',
  5.99,
  1
FROM public.categories c WHERE c.name_en = 'Beverages';