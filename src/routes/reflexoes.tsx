import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { useState } from "react";
import {
  reflexoesDoDia,
  conselhosDoDia,
  mensagensDeForca,
  mensagensDePaz,
} from "@/data/conteudo";
import { Sparkles, Heart, Wind, Timer, ArrowRight, ArrowLeft } from "lucide-react";
import { rastrear } from "@/lib/track";

export const Route = createFileRoute("/reflexoes")({
  head: () => ({
    meta: [
      { title: "Reflexões — ConectaMente" },
      {
        name: "description",
        content: "Reflexão do dia, mensagens de força e mensagens de paz para acalmar a mente.",
      },
    ],
  }),
  component: Reflexoes,
});

type Aba = "forca" | "paz" | null;

function Reflexoes() {
  const reflexao = reflexoesDoDia[new Date().getDate() % reflexoesDoDia.length];
  const conselho = conselhosDoDia[new Date().getDate() % conselhosDoDia.length];
  const [aba, setAba] = useState<Aba>(null);

  return (
    <div>
      <AppHeader subtitle="Central de Reflexões" />

      <section className="px-5 pt-5">
        <div className="rounded-xl bg-primary p-5 text-primary-foreground shadow-soft">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Reflexão do dia</span>
          </div>
          <p className="mt-2 text-base font-semibold leading-snug">{reflexao}</p>
        </div>
      </section>

      <section className="px-5 pt-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-semibold text-muted-foreground">Conselho do dia</p>
          <p className="mt-2 text-base leading-relaxed text-card-foreground">{conselho}</p>
        </div>
      </section>

      <section className="px-5 pt-3">
        <Link
          to="/pausa"
          onClick={() => rastrear("clique", "Reflexões · Pausa e Reflexão")}
          className="grid min-h-20 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-aqua/50 bg-card p-4 shadow-soft hover:bg-aqua/10"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-aqua/25 text-aqua-foreground">
            <Timer className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-card-foreground">Pausa e Reflexão</h3>
            <p className="mt-1 text-sm text-muted-foreground">3 minutos guiados de respiração consciente.</p>
          </div>
          <ArrowRight className="h-5 w-5 opacity-80" />
        </Link>
      </section>

      <section className="space-y-3 px-5 pt-5">
        <button
          type="button"
          onClick={() => {
            setAba("forca");
            rastrear("clique", "Reflexões · Mensagens de Força");
          }}
          className="grid min-h-20 w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-xl border border-warm/30 bg-card p-4 text-left shadow-soft hover:bg-warm/10"
        >
          <Heart className="h-6 w-6 text-warm-foreground" />
          <span><span className="block text-base font-bold text-card-foreground">Mensagens de Força</span><span className="mt-1 block text-sm text-muted-foreground">Coragem para seguir.</span></span>
        </button>
        <button
          type="button"
          onClick={() => {
            setAba("paz");
            rastrear("clique", "Reflexões · Mensagens de Paz");
          }}
          className="grid min-h-20 w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-xl border border-aqua/40 bg-card p-4 text-left shadow-soft hover:bg-aqua/10"
        >
          <Wind className="h-6 w-6 text-aqua-foreground" />
          <span><span className="block text-base font-bold text-card-foreground">Mensagens de Paz</span><span className="mt-1 block text-sm text-muted-foreground">Para respirar fundo.</span></span>
        </button>
      </section>

      {aba ? (
        <section className="px-5 pt-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">
              {aba === "forca" ? "Mensagens de Força" : "Mensagens de Paz"}
            </h2>
            <button
              type="button"
              onClick={() => setAba(null)}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Voltar
            </button>
          </div>
          <div className="space-y-2">
            {(aba === "forca" ? mensagensDeForca : mensagensDePaz).map((m) => (
              <div key={m} className="rounded-xl border border-border bg-card p-4 text-base leading-relaxed text-card-foreground">
                {m}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
