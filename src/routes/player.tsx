import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { useState } from "react";
import { listarPlaylists, type Playlist } from "@/lib/playlists.functions";
import { rastrear } from "@/lib/track";
import { ArrowLeft, Music, Headphones, Moon, Brain } from "lucide-react";

export const Route = createFileRoute("/player")({
  head: () => ({
    meta: [
      { title: "Player de Bem-estar — ConectaMente" },
      {
        name: "description",
        content: "Sons da Natureza, Foco Profundo, Sono e Meditações Guiadas.",
      },
    ],
  }),
  loader: () => listarPlaylists(),
  component: Player,
  errorComponent: () => (
    <div className="px-5 py-10 text-sm text-muted-foreground">
      Não foi possível carregar as músicas agora. Tente novamente.
    </div>
  ),
  notFoundComponent: () => (
    <div className="px-5 py-10 text-sm text-muted-foreground">Página não encontrada.</div>
  ),
});

type Cat = Playlist["categoria"];

const tabs: { id: Cat; label: string; icon: typeof Music }[] = [
  { id: "natureza", label: "Natureza", icon: Music },
  { id: "foco", label: "Foco", icon: Brain },
  { id: "sono", label: "Sono", icon: Moon },
  { id: "meditacao", label: "Meditações", icon: Headphones },
];

function Player() {
  const todas = Route.useLoaderData();
  const [cat, setCat] = useState<Cat>("natureza");
  const [indice, setIndice] = useState(0);

  const daCategoria = todas.filter((p) => p.categoria === cat);
  const playlist = daCategoria[Math.min(indice, daCategoria.length - 1)];

  return (
    <div>
      <div className="px-5 pt-6 pb-2">
        <Link to="/recursos" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="h-3 w-3" /> Recursos
        </Link>
      </div>
      <AppHeader subtitle="Player de Bem-estar" />

      <section className="px-5 pt-2">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = cat === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setCat(t.id);
                  setIndice(0);
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </section>

      {daCategoria.length > 1 ? (
        <section className="px-5 pt-1">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
            {daCategoria.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndice(i)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  i === indice
                    ? "bg-aqua text-aqua-foreground"
                    : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {p.nome}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="px-5 pt-3">
        {playlist ? (
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <h3 className="text-sm font-bold text-card-foreground">{playlist.nome}</h3>
            {playlist.descricao ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{playlist.descricao}</p>
            ) : null}
            <div
              className="mt-3 aspect-video overflow-hidden rounded-xl bg-black"
              onClick={() => rastrear("playlist", playlist.nome)}
            >
              <iframe
                key={playlist.video_id}
                title={playlist.nome}
                src={`https://www.youtube.com/embed/${playlist.video_id}?rel=0&modestbranding=1`}
                style={{ border: 0, width: "100%", height: "100%" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma música cadastrada nesta categoria ainda.
          </p>
        )}
      </section>
    </div>
  );
}
