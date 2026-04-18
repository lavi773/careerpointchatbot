CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL UNIQUE,
  title text,
  content text NOT NULL,
  summary text,
  source text NOT NULL DEFAULT 'cpur.in',
  scraped_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_content_search ON public.site_content
  USING gin(to_tsvector('english', coalesce(title,'') || ' ' || content));

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users read site content"
  ON public.site_content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins manage site content"
  ON public.site_content FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_site_content_updated
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();