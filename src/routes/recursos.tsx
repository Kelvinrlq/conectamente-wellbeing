import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { BookOpen, Music, Timer, Sparkles, ArrowRight } from "lucide-react";

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
      <section className="px-5 pt-2">
        <div className="rounded-2xl bg-warm/25 p-4">
          <Sparkles className="h-4 w-4 text-warm-foreground" />
          <p className="mt-2 text-sm font-medium text-warm-foreground">
            Pequenas pausas, grandes diferenças. Escolha o que combina com o seu momento agora.
          </p>
        </div>
      </section>
      <section className="px-5 pt-4 space-y-3">
        {itens.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`${it.klass} flex items-center gap-4 rounded-2xl p-4 shadow-soft active:scale-[0.99] transition-transform`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/35 backdrop-blur">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold">{it.title}</h3>
                <p className="text-xs opacity-90">{it.desc}</p>
              </div>
              <ArrowRight className="h-5 w-5 opacity-80" />
            </Link>
          );
        })}
      </section>
    </div>
  );
}
