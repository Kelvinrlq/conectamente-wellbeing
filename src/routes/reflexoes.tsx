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

      <section className="px-5 pt-2">
        <div className="tile-primary rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-wider opacity-90">Reflexão do dia</span>
          </div>
          <p className="mt-2 text-base font-semibold leading-snug">{reflexao}</p>
        </div>
      </section>

      <section className="px-5 pt-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Conselho do dia</p>
          <p className="mt-1 text-sm text-card-foreground">{conselho}</p>
        </div>
      </section>

      <section className="px-5 pt-3">
        <Link
          to="/pausa"
          className="tile-aqua flex items-center gap-4 rounded-2xl p-4 shadow-soft active:scale-[0.99]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/35 backdrop-blur">
            <Timer className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold">Pausa e Reflexão</h3>
            <p className="text-xs opacity-90">3 minutos guiados de respiração consciente.</p>
          </div>
          <ArrowRight className="h-5 w-5 opacity-80" />
        </Link>
      </section>

      <section className="px-5 pt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setAba("forca")}
          className="tile-warm rounded-2xl p-4 text-left shadow-soft active:scale-[0.98]"
        >
          <Heart className="h-5 w-5" />
          <h3 className="mt-2 text-sm font-bold">Mensagens de Força</h3>
          <p className="text-xs opacity-90">Coragem para seguir.</p>
        </button>
        <button
          type="button"
          onClick={() => setAba("paz")}
          className="tile-calm rounded-2xl p-4 text-left shadow-soft active:scale-[0.98]"
        >
          <Wind className="h-5 w-5" />
          <h3 className="mt-2 text-sm font-bold">Mensagens de Paz</h3>
          <p className="text-xs opacity-90">Para respirar fundo.</p>
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
              className="inline-flex items-center gap-1 text-xs text-muted-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Voltar
            </button>
          </div>
          <div className="space-y-2">
            {(aba === "forca" ? mensagensDeForca : mensagensDePaz).map((m) => (
              <div key={m} className="rounded-2xl border border-border bg-card p-4 text-sm text-card-foreground">
                {m}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
