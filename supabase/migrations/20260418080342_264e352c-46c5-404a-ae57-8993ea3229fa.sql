ALTER TABLE public.unresolved_queries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.unresolved_queries;