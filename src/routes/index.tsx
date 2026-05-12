import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { Brain, Heart, Music, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { meditacoesDestaque, reflexoesDoDia } from "@/data/conteudo";

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

      <section className="px-5 pb-2">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground shadow-soft">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 shrink-0 opacity-90" />
            <div>
              <p className="text-xs uppercase tracking-wider opacity-80">Reflexão do dia</p>
              <p className="mt-1 text-base font-medium leading-snug">{reflexao}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.title}
                to={t.to}
                className={`${t.klass} group flex flex-col gap-3 rounded-2xl p-4 shadow-soft transition-transform active:scale-[0.98]`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/30 backdrop-blur">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">{t.title}</h3>
                  <p className="mt-1 text-xs opacity-90 leading-snug">{t.desc}</p>
                </div>
                <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-white/35 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
                  {t.cta} <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-5 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Conteúdo em Destaque</h2>
          <Link to="/player" className="text-xs font-semibold text-primary">
            Ver todos
          </Link>
        </div>
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
          {meditacoesDestaque.map((m) => (
            <Link
              to="/player"
              key={m.titulo}
              className="snap-start shrink-0 w-[220px] rounded-2xl border border-border bg-card p-4 shadow-soft"
            >
              <span className="inline-block rounded-full bg-aqua/40 px-2 py-0.5 text-[10px] font-semibold text-aqua-foreground">
                {m.categoria}
              </span>
              <h3 className="mt-2 text-sm font-semibold leading-snug text-card-foreground">
                {m.titulo}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">{m.duracao}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pt-6">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Precisa de ajuda agora?</p>
          <p className="mt-1 text-sm text-card-foreground">
            Ligue <strong className="text-primary">CVV 188</strong> — apoio emocional 24h, gratuito e
            sigiloso.
          </p>
          <Link
            to="/apoio"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            Ver mais opções <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
