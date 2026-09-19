import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const pedidoSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("metricas"), dias: z.union([z.literal(7), z.literal(30), z.literal(90)]) }),
  z.object({ action: z.literal("eventos"), dias: z.union([z.literal(7), z.literal(30), z.literal(90)]) }),
  z.object({ action: z.literal("listarPlaylists") }),
  z.object({
    action: z.literal("adicionarPlaylist"),
    playlist: z.object({
      categoria: z.enum(["natureza", "foco", "sono", "meditacao"]),
      nome: z.string().trim().min(1).max(120),
      video_id: z.string().regex(/^[\w-]{6,}$/),
      descricao: z.string().trim().max(200),
    }),
  }),
  z.object({ action: z.literal("removerPlaylist"), id: z.string().uuid() }),
]);

function resposta(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export const Route = createFileRoute("/api/public/admin-data")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["ADMIN_PASSWORD"];
        if (!secret) return resposta({ error: "Configuração indisponível" }, 503);

        const timestamp = request.headers.get("x-conectamente-timestamp") ?? "";
        const assinatura = request.headers.get("x-conectamente-signature") ?? "";
        const instante = Number(timestamp);
        if (!Number.isFinite(instante) || Math.abs(Date.now() - instante) > 60_000) {
          return resposta({ error: "Autorização expirada" }, 401);
        }

        const corpo = await request.text();
        const esperada = createHmac("sha256", secret).update(`${timestamp}.${corpo}`).digest("hex");
        const recebidaBuffer = Buffer.from(assinatura, "hex");
        const esperadaBuffer = Buffer.from(esperada, "hex");
        if (
          recebidaBuffer.length !== esperadaBuffer.length ||
          !timingSafeEqual(recebidaBuffer, esperadaBuffer)
        ) {
          return resposta({ error: "Não autorizado" }, 401);
        }

        const parsed = pedidoSchema.safeParse(JSON.parse(corpo));
        if (!parsed.success) return resposta({ error: "Solicitação inválida" }, 400);

        const {
          obterMetricasLocais,
          exportarEventosLocais,
          listarPlaylistsLocais,
          adicionarPlaylistLocal,
          removerPlaylistLocal,
        } = await import("@/lib/admin-data.server");
        const pedido = parsed.data;

        if (pedido.action === "metricas") return resposta(await obterMetricasLocais(pedido.dias));
        if (pedido.action === "eventos") return resposta(await exportarEventosLocais(pedido.dias));
        if (pedido.action === "listarPlaylists") return resposta(await listarPlaylistsLocais());
        if (pedido.action === "adicionarPlaylist") {
          return resposta(await adicionarPlaylistLocal(pedido.playlist));
        }
        return resposta(await removerPlaylistLocal(pedido.id));
      },
    },
  },
});