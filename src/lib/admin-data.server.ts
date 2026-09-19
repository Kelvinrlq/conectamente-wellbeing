import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type AdminDataMetricas = {
  resumo: { paginas: number; cliques: number; chats: number; playlists: number };
  porPagina: { nome: string; total: number }[];
  porClique: { nome: string; total: number }[];
  porPlaylist: { nome: string; total: number }[];
  porDia: { dia: string; total: number }[];
  detalhe: {
    paginas: { nome: string; total: number; pct: number }[];
    cliques: { nome: string; total: number; pct: number }[];
    playlists: { nome: string; total: number; pct: number }[];
    conversas: number;
    mensagens: number;
    totalEventos: number;
  };
  porHora: { hora: string; total: number }[];
  ultimos: { tipo: string; nome: string; created_at: string }[];
};

export type AdminDataPlaylist = {
  id: string;
  categoria: string;
  nome: string;
  video_id: string;
  descricao: string;
  ordem: number;
};

export type AdminDataEvento = { tipo: string; nome: string; created_at: string };

type Linha = { nome: string; total: number; pct: number };

function contar(rows: { nome: string }[]) {
  const mapa = new Map<string, number>();
  for (const row of rows) mapa.set(row.nome, (mapa.get(row.nome) ?? 0) + 1);
  return [...mapa.entries()]
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 12);
}

function ranking(rows: { nome: string }[]): Linha[] {
  const mapa = new Map<string, number>();
  for (const row of rows) mapa.set(row.nome, (mapa.get(row.nome) ?? 0) + 1);
  const total = rows.length || 1;
  return [...mapa.entries()]
    .map(([nome, quantidade]) => ({
      nome,
      total: quantidade,
      pct: Math.round((quantidade / total) * 100),
    }))
    .sort((a, b) => b.total - a.total);
}

async function listarEventos(dias: number): Promise<AdminDataEvento[]> {
  const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabaseAdmin
    .from("analytics_events")
    .select("tipo, nome, created_at")
    .gte("created_at", desde)
    .order("created_at", { ascending: false })
    .limit(50000);
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminDataEvento[];
}

export async function obterMetricasLocais(diasSelecionados: number): Promise<AdminDataMetricas> {
  const eventos = await listarEventos(diasSelecionados);
  const paginas = eventos.filter((evento) => evento.tipo === "pagina");
  const cliques = eventos.filter((evento) => evento.tipo === "clique");
  const chats = eventos.filter((evento) => evento.tipo === "chat");
  const musicas = eventos.filter((evento) => evento.tipo === "playlist");

  const dias: { dia: string; total: number }[] = [];
  const porDiaMapa = new Map<string, number>();
  for (const evento of paginas) {
    const dia = evento.created_at.slice(0, 10);
    porDiaMapa.set(dia, (porDiaMapa.get(dia) ?? 0) + 1);
  }
  for (let indice = diasSelecionados - 1; indice >= 0; indice--) {
    const data = new Date(Date.now() - indice * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    dias.push({ dia: `${data.slice(8, 10)}/${data.slice(5, 7)}`, total: porDiaMapa.get(data) ?? 0 });
  }

  const horaMapa = new Map<number, number>();
  for (const evento of eventos) {
    const hora = new Date(new Date(evento.created_at).getTime() - 4 * 60 * 60 * 1000).getUTCHours();
    horaMapa.set(hora, (horaMapa.get(hora) ?? 0) + 1);
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
    detalhe: {
      paginas: ranking(paginas),
      cliques: ranking(cliques),
      playlists: ranking(musicas),
      conversas: chats.filter((evento) => evento.nome === "Conversa iniciada").length,
      mensagens: chats.filter((evento) => evento.nome !== "Conversa iniciada").length,
      totalEventos: eventos.length,
    },
    porHora: Array.from({ length: 24 }, (_, hora) => ({
      hora: `${String(hora).padStart(2, "0")}h`,
      total: horaMapa.get(hora) ?? 0,
    })),
    ultimos: eventos.slice(0, 50),
  };
}

export async function exportarEventosLocais(dias: number) {
  return listarEventos(dias);
}

export async function listarPlaylistsLocais(): Promise<AdminDataPlaylist[]> {
  const { data, error } = await supabaseAdmin
    .from("playlists")
    .select("id, categoria, nome, video_id, descricao, ordem")
    .order("categoria", { ascending: true })
    .order("ordem", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminDataPlaylist[];
}

export async function adicionarPlaylistLocal(data: {
  categoria: string;
  nome: string;
  video_id: string;
  descricao: string;
}) {
  const { count } = await supabaseAdmin
    .from("playlists")
    .select("id", { count: "exact", head: true })
    .eq("categoria", data.categoria);
  const { error } = await supabaseAdmin.from("playlists").insert({ ...data, ordem: count ?? 0 });
  if (error) throw new Error(error.message);
  return { ok: true as const };
}

export async function removerPlaylistLocal(id: string) {
  const { error } = await supabaseAdmin.from("playlists").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true as const };
}