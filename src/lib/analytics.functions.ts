import { createServerFn } from "@tanstack/react-start";

const TIPOS = ["pagina", "clique", "chat", "playlist"] as const;
type Tipo = (typeof TIPOS)[number];

export const registrarEvento = createServerFn({ method: "POST" })
  .inputValidator((data: { tipo: string; nome: string }) => {
    const tipo = TIPOS.includes(data.tipo as Tipo) ? (data.tipo as Tipo) : null;
    if (!tipo) throw new Error("tipo inválido");
    const nome = String(data.nome ?? "").slice(0, 80).trim();
    if (!nome) throw new Error("nome inválido");
    return { tipo, nome };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("analytics_events").insert({ tipo: data.tipo, nome: data.nome });
    return { ok: true as const };
  });
