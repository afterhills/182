CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url TEXT,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Anyone can insert modules" ON public.modules FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update modules" ON public.modules FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete modules" ON public.modules FOR DELETE USING (true);

CREATE TRIGGER update_modules_updated_at
BEFORE UPDATE ON public.modules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public) VALUES ('module-videos', 'module-videos', true);

CREATE POLICY "Anyone can view module videos" ON storage.objects FOR SELECT USING (bucket_id = 'module-videos');
CREATE POLICY "Anyone can upload module videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'module-videos');
CREATE POLICY "Anyone can update module videos" ON storage.objects FOR UPDATE USING (bucket_id = 'module-videos');
CREATE POLICY "Anyone can delete module videos" ON storage.objects FOR DELETE USING (bucket_id = 'module-videos');