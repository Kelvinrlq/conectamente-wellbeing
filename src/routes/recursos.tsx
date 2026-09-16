import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { BookOpen, Music, Timer, Sparkles, ArrowRight } from "lucide-react";
import { rastrear } from "@/lib/track";

export const Route = createFileRoute("/recursos")({
  head: () => ({
    meta: [
      { title: "Recursos — ConectaMente" },
      {
        name: "description",
        content: "Reflexões, mensagens, pausas guiadas e músicas calmas para o seu bem-estar.",
      },
    ],
  }),
  component: Recursos,
});

const itens = [
  {
    to: "/reflexoes",
    title: "Central de Reflexões",
    desc: "Reflexão do dia, mensagens de força e de paz.",
    icon: BookOpen,
    klass: "tile-calm",
  },
  {
    to: "/pausa",
    title: "Pausa e Reflexão",
    desc: "3 minutos guiados para respirar e voltar ao centro.",
    icon: Timer,
    klass: "tile-aqua",
  },
  {
    to: "/player",
    title: "Player de Bem-estar",
    desc: "Sons da Natureza, Foco, Sono e Meditações.",
    icon: Music,
    klass: "tile-primary",
  },
] as const;

function Recursos() {
  return (
    <div>
      <AppHeader subtitle="Recursos para o bem-estar" />
      <section className="px-5 pt-5">
        <div className="rounded-xl border border-warm/30 bg-warm/10 p-5">
          <Sparkles className="h-4 w-4 text-warm-foreground" />
          <p className="mt-2 text-base font-medium leading-relaxed text-foreground">
            Pequenas pausas, grandes diferenças. Escolha o que combina com o seu momento agora.
          </p>
        </div>
      </section>
      <section className="space-y-3 px-5 pt-6">
        <h2 className="text-lg font-bold text-foreground">Escolha um recurso</h2>
        {itens.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              onClick={() => rastrear("clique", `Recursos · ${it.title}`)}
              className="grid min-h-20 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-soft transition-colors hover:bg-muted"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${it.klass}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-card-foreground">{it.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
            </Link>
          );
        })}
      </section>
    </div>
  );
}
