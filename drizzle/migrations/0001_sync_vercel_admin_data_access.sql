CREATE OR REPLACE FUNCTION public.conectamente_admin_data(_admin_password text, _session_secret text, _action text, _days integer DEFAULT 7, _payload jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  result jsonb;
  safe_days integer := CASE WHEN _days IN (7, 30, 90) THEN _days ELSE 7 END;
  category text;
  item_name text;
  video text;
  description text;
  item_id uuid;
BEGIN
  IF encode(digest(coalesce(_admin_password, '') || ':' || coalesce(_session_secret, ''), 'sha256'), 'hex') <> '9cd45265f36934e0c2d30d355bd7ecbc5f183468c1a468c03c0d042ef56a2e90' THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  IF _action = 'events' THEN
    SELECT coalesce(jsonb_agg(to_jsonb(e) ORDER BY e.created_at DESC), '[]'::jsonb) INTO result
    FROM (SELECT tipo, nome, created_at FROM public.analytics_events WHERE created_at >= now() - make_interval(days => safe_days) ORDER BY created_at DESC LIMIT 50000) e;
    RETURN result;
  ELSIF _action = 'playlists' THEN
    SELECT coalesce(jsonb_agg(to_jsonb(p) ORDER BY p.categoria, p.ordem), '[]'::jsonb) INTO result
    FROM (SELECT id, categoria, nome, video_id, descricao, ordem FROM public.playlists) p;
    RETURN result;
  ELSIF _action = 'add_playlist' THEN
    category := left(coalesce(_payload->>'categoria', ''), 20);
    item_name := left(trim(coalesce(_payload->>'nome', '')), 120);
    video := left(trim(coalesce(_payload->>'video_id', '')), 64);
    description := left(trim(coalesce(_payload->>'descricao', '')), 200);
    IF category NOT IN ('natureza', 'foco', 'sono', 'meditacao') OR item_name = '' OR video !~ '^[A-Za-z0-9_-]{6,}$' THEN RAISE EXCEPTION 'invalid playlist'; END IF;
    INSERT INTO public.playlists (categoria, nome, video_id, descricao, ordem) VALUES (category, item_name, video, description, (SELECT count(*) FROM public.playlists WHERE categoria = category));
    RETURN '{"ok":true}'::jsonb;
  ELSIF _action = 'remove_playlist' THEN
    item_id := (_payload->>'id')::uuid;
    DELETE FROM public.playlists WHERE id = item_id;
    RETURN '{"ok":true}'::jsonb;
  END IF;
  RAISE EXCEPTION 'invalid action';
END;
$$;
REVOKE ALL ON FUNCTION public.conectamente_admin_data(text, text, text, integer, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.conectamente_admin_data(text, text, text, integer, jsonb) TO anon, authenticated, service_role;