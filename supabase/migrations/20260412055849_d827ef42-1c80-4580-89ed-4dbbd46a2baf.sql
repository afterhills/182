
-- Create leaks table
CREATE TABLE public.leaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT,
  description TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read leaks" ON public.leaks FOR SELECT USING (true);
CREATE POLICY "Anyone can insert leaks" ON public.leaks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update leaks" ON public.leaks FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete leaks" ON public.leaks FOR DELETE USING (true);

-- Create victim_notes table (single row for the side panel text)
CREATE TABLE public.victim_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.victim_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read victim_notes" ON public.victim_notes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert victim_notes" ON public.victim_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update victim_notes" ON public.victim_notes FOR UPDATE USING (true);

-- Create sidebar_items table
CREATE TABLE public.sidebar_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL DEFAULT '',
  attachment_url TEXT,
  attachment_name TEXT,
  notes TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sidebar_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read sidebar_items" ON public.sidebar_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert sidebar_items" ON public.sidebar_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sidebar_items" ON public.sidebar_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete sidebar_items" ON public.sidebar_items FOR DELETE USING (true);

-- Create storage bucket for leak images
INSERT INTO storage.buckets (id, name, public) VALUES ('leak-images', 'leak-images', true);

CREATE POLICY "Anyone can read leak images" ON storage.objects FOR SELECT USING (bucket_id = 'leak-images');
CREATE POLICY "Anyone can upload leak images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'leak-images');
CREATE POLICY "Anyone can delete leak images" ON storage.objects FOR DELETE USING (bucket_id = 'leak-images');

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_leaks_updated_at BEFORE UPDATE ON public.leaks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_victim_notes_updated_at BEFORE UPDATE ON public.victim_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sidebar_items_updated_at BEFORE UPDATE ON public.sidebar_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default victim_notes row
INSERT INTO public.victim_notes (content) VALUES ('');
