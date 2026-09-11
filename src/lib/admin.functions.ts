import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type AdminSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "conectamente-admin",
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function senhaConfere(entrada: string, esperada: string) {
  const a = createHash("sha256").update(entrada, "utf8").digest();
  const b = createHash("sha256").update(esperada, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function exigirAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.unlocked) throw new Error("NAO_AUTORIZADO");
  return session;
}

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { unlocked: session.data.unlocked === true };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { senha: string }) => ({ senha: String(data.senha ?? "") }))
  .handler(async ({ data }) => {
    const esperada = process.env["ADMIN_PASSWORD"];
    if (!esperada) return { ok: false as const };
    if (!data.senha || !senhaConfere(data.senha, esperada)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export type Metricas = {
  resumo: { paginas: number; cliques: number; chats: number; playlists: number };
  porPagina: { nome: string; total: number }[];
  porClique: { nome: string; total: number }[];
  porPlaylist: { nome: string; total: number }[];
  porDia: { dia: string; total: number }[];
};

function contar(rows: { nome: string }[]) {
  const mapa = new Map<string, number>();
  for (const r of rows) mapa.set(r.nome, (mapa.get(r.nome) ?? 0) + 1);
  return [...mapa.entries()]
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 12);
}

export const obterMetricas = createServerFn({ method: "POST" })
  .inputValidator((data: { dias: number }) => {
    const dias = [7, 30, 90].includes(Number(data.dias)) ? Number(data.dias) : 7;
    return { dias };
  })
  .handler(async ({ data }): Promise<Metricas> => {
    await exigirAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const desde = new Date(Date.now() - data.dias * 24 * 60 * 60 * 1000).toISOString();

    const { data: rows, error } = await supabaseAdmin
      .from("analytics_events")
      .select("tipo, nome, created_at")
      .gte("created_at", desde)
      .order("created_at", { ascending: false })
      .limit(50000);

    if (error) throw new Error(error.message);
    const eventos = (rows ?? []) as { tipo: string; nome: string; created_at: string }[];

    const paginas = eventos.filter((e) => e.tipo === "pagina");
    const cliques = eventos.filter((e) => e.tipo === "clique");
    const chats = eventos.filter((e) => e.tipo === "chat");
    const musicas = eventos.filter((e) => e.tipo === "playlist");

    const dias: { dia: string; total: number }[] = [];
    const porDiaMapa = new Map<string, number>();
    for (const e of paginas) {
      const dia = e.created_at.slice(0, 10);
      porDiaMapa.set(dia, (porDiaMapa.get(dia) ?? 0) + 1);
    }
    for (let i = data.dias - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      dias.push({ dia: d.slice(8, 10) + "/" + d.slice(5, 7), total: porDiaMapa.get(d) ?? 0 });
    }

    return {
      resumo: {
        paginas: paginas.length,
        cliques: cliques.length,
        chats: chats.length,
        playlists: musicas.length,
      },
      porPagina: contar(paginas),
      porClique: contar(cliques),
      porPlaylist: contar(musicas),
      porDia: dias,
    };
  });

export type PlaylistAdmin = {
  id: string;
  categoria: string;
  nome: string;
  video_id: string;
  descricao: string;
  ordem: number;
};

export const adminListarPlaylists = createServerFn({ method: "POST" }).handler(async () => {
  await exigirAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("playlists")
    .select("id, categoria, nome, video_id, descricao, ordem")
    .order("categoria", { ascending: true })
    .order("ordem", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as PlaylistAdmin[];
});

const CATEGORIAS = ["natureza", "foco", "sono", "meditacao"] as const;

function extrairVideoId(valor: string) {
  const bruto = valor.trim();
  const patterns = [/[?&]v=([\w-]{6,})/, /youtu\.be\/([\w-]{6,})/, /embed\/([\w-]{6,})/];
  for (const p of patterns) {
    const m = bruto.match(p);
    if (m) return m[1];
  }
  return /^[\w-]{6,}$/.test(bruto) ? bruto : null;
}

export const adminAdicionarPlaylist = createServerFn({ method: "POST" })
  .inputValidator((data: { categoria: string; nome: string; link: string; descricao: string }) => {
    if (!CATEGORIAS.includes(data.categoria as (typeof CATEGORIAS)[number])) {
      throw new Error("Categoria inválida");
    }
    const nome = String(data.nome ?? "").trim().slice(0, 120);
    if (!nome) throw new Error("Informe o nome da música");
    const videoId = extrairVideoId(String(data.link ?? ""));
    if (!videoId) throw new Error("Link ou ID do YouTube inválido");
    return {
      categoria: data.categoria,
      nome,
      video_id: videoId,
      descricao: String(data.descricao ?? "").trim().slice(0, 200),
    };
  })
  .handler(async ({ data }) => {
    await exigirAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("playlists")
      .select("id", { count: "exact", head: true })
      .eq("categoria", data.categoria);
    const { error } = await supabaseAdmin
      .from("playlists")
      .insert({ ...data, ordem: count ?? 0 });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminRemoverPlaylist = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => ({ id: String(data.id) }))
  .handler(async ({ data }) => {
    await exigirAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("playlists").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
