-- ============================================
-- Round 2: Query Resolve System
-- ============================================

-- 1) Roles enum + user_roles table (separate table to prevent privilege escalation)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2) unresolved_queries table
CREATE TABLE public.unresolved_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text,
  question text NOT NULL,
  context text,
  status text NOT NULL DEFAULT 'pending', -- pending | resolved | dismissed
  answer text,
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  notified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_unresolved_user ON public.unresolved_queries(user_id);
CREATE INDEX idx_unresolved_status ON public.unresolved_queries(status);

ALTER TABLE public.unresolved_queries ENABLE ROW LEVEL SECURITY;

-- Students: see + create their own queries
CREATE POLICY "Users view own queries"
  ON public.unresolved_queries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own queries"
  ON public.unresolved_queries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Students: mark their own resolved query as notified (read)
CREATE POLICY "Users mark own queries as read"
  ON public.unresolved_queries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins: full access
CREATE POLICY "Admins view all queries"
  ON public.unresolved_queries FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update queries"
  ON public.unresolved_queries FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete queries"
  ON public.unresolved_queries FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3) shared_faqs table — resolved queries promoted here become bot answers for ALL users
CREATE TABLE public.shared_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  keywords text[] NOT NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'admin', -- 'admin' | 'resolved_query' | 'scraped'
  source_query_id uuid REFERENCES public.unresolved_queries(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_shared_faqs_question ON public.shared_faqs USING gin(to_tsvector('english', question));

ALTER TABLE public.shared_faqs ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read FAQs (the bot uses them)
CREATE POLICY "Authenticated users read FAQs"
  ON public.shared_faqs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins manage FAQs"
  ON public.shared_faqs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4) Triggers — keep updated_at fresh
CREATE TRIGGER trg_unresolved_queries_updated
  BEFORE UPDATE ON public.unresolved_queries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_shared_faqs_updated
  BEFORE UPDATE ON public.shared_faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 5) When admin marks a query resolved → auto-promote to shared_faqs
CREATE OR REPLACE FUNCTION public.promote_resolved_query_to_faq()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'resolved' AND NEW.answer IS NOT NULL
     AND (OLD.status IS DISTINCT FROM 'resolved') THEN
    INSERT INTO public.shared_faqs (question, answer, source, source_query_id)
    VALUES (NEW.question, NEW.answer, 'resolved_query', NEW.id);
    NEW.resolved_at := now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_promote_resolved
  BEFORE UPDATE ON public.unresolved_queries
  FOR EACH ROW
  EXECUTE FUNCTION public.promote_resolved_query_to_faq();

-- 6) Bootstrap: assign 'user' role to every existing + new auth user.
-- The FIRST signup will need to be promoted to admin manually (instructions in chat).
CREATE OR REPLACE FUNCTION public.assign_default_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_assign_default_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_default_user_role();