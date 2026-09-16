import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { Brain, Heart, Music, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { meditacoesDestaque, reflexoesDoDia } from "@/data/conteudo";
import { rastrear } from "@/lib/track";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ConectaMente — Início" },
      {
        name: "description",
        content: "Acolhimento, reflexões e apoio para estudantes. Bem-vindo ao ConectaMente.",
      },
    ],
  }),
  component: Index,
});

const tiles = [
  {
    to: "/chat",
    title: "Conversa Amiga",
    desc: "Bate-papo anônimo e seguro, com IA acolhedora.",
    icon: Brain,
    klass: "tile-primary",
    cta: "Iniciar Chat",
  },
  {
    to: "/reflexoes",
    title: "Conselho do Dia",
    desc: "Dicas rápidas para lidar com o dia-a-dia.",
    icon: Heart,
    klass: "tile-warm",
    cta: "Ver Conselho",
  },
  {
    to: "/player",
    title: "Músicas Calmas",
    desc: "Playlists para relaxar e focar.",
    icon: Music,
    klass: "tile-aqua",
    cta: "Ouvir Agora",
  },
  {
    to: "/reflexoes",
    title: "Reflexões & Mensagens",
    desc: "Frases motivacionais e mindfulness.",
    icon: BookOpen,
    klass: "tile-calm",
    cta: "Ler Mais",
  },
] as const;

function Index() {
  const reflexao = reflexoesDoDia[new Date().getDate() % reflexoesDoDia.length];
  return (
    <div>
      <AppHeader subtitle="Apoio à saúde mental" />

      <section className="px-5 pt-5">
        <div className="rounded-xl bg-primary p-5 text-primary-foreground shadow-soft">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 shrink-0 opacity-90" />
            <div>
              <p className="text-sm font-semibold">Reflexão do dia</p>
              <p className="mt-2 text-base font-medium leading-relaxed">{reflexao}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pt-6">
        <h2 className="mb-3 text-lg font-bold text-foreground">O que você precisa agora?</h2>
        <div className="space-y-3">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.title}
                to={t.to}
                onClick={() => rastrear("clique", t.title)}
                className="group grid min-h-20 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-soft transition-colors hover:bg-muted"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${t.klass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-card-foreground">{t.title}</h3>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">{t.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-5 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Conteúdo em destaque</h2>
          <Link to="/player" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary">
            Ver todos
          </Link>
        </div>
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
          {meditacoesDestaque.map((m) => (
            <Link
              to="/player"
              key={m.titulo}
              onClick={() => rastrear("clique", m.titulo)}
              className="snap-start w-[240px] shrink-0 rounded-xl border border-border bg-card p-4 shadow-soft"
            >
              <span className="inline-block rounded-full bg-aqua/40 px-2 py-0.5 text-[10px] font-semibold text-aqua-foreground">
                {m.categoria}
              </span>
              <h3 className="mt-2 text-sm font-semibold leading-snug text-card-foreground">
                {m.titulo}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.duracao}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pt-6">
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-5">
          <p className="text-base font-bold text-foreground">Precisa de ajuda agora?</p>
          <p className="mt-2 text-sm text-card-foreground">
            Ligue <strong className="text-primary">CVV 188</strong> — apoio emocional 24h, gratuito e
            sigiloso.
          </p>
          <Link
            to="/apoio"
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
          >
            Ver mais opções <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
