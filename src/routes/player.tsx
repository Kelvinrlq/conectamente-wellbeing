import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { useState } from "react";
import { playlistsYoutube } from "@/data/conteudo";
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
  component: Player,
});

type Cat = keyof typeof playlistsSpotify;

const tabs: { id: Cat; label: string; icon: typeof Music }[] = [
  { id: "natureza", label: "Natureza", icon: Music },
  { id: "foco", label: "Foco", icon: Brain },
  { id: "sono", label: "Sono", icon: Moon },
  { id: "meditacao", label: "Meditações", icon: Headphones },
];

function Player() {
  const [cat, setCat] = useState<Cat>("natureza");
  const playlist = playlistsSpotify[cat][0];

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
                onClick={() => setCat(t.id)}
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

      <section className="px-5 pt-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <h3 className="text-sm font-bold text-card-foreground">{playlist.nome}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{playlist.descricao}</p>
          <div className="mt-3 overflow-hidden rounded-xl">
            <iframe
              key={playlist.embedId}
              title={playlist.nome}
              src={`https://open.spotify.com/embed/playlist/${playlist.embedId}?utm_source=generator&theme=0`}
              width="100%"
              height={352}
              style={{ border: 0 }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Substitua o ID da playlist em <code>src/data/conteudo.ts</code> pela sua playlist favorita
            do Spotify.
          </p>
        </div>
      </section>
    </div>
  );
}
