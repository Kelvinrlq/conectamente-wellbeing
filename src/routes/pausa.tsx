import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, ArrowLeft } from "lucide-react";
import { rastrear } from "@/lib/track";

export const Route = createFileRoute("/pausa")({
  head: () => ({
    meta: [
      { title: "Pausa e Reflexão — ConectaMente" },
      {
        name: "description",
        content: "3 minutos guiados de respiração consciente para desacelerar.",
      },
    ],
  }),
  component: Pausa,
});

const TOTAL = 3 * 60;

function format(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

function Pausa() {
  const [secs, setSecs] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setSecs((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [running]);

  const pct = ((TOTAL - secs) / TOTAL) * 100;
  const phase = secs % 8 < 4 ? "Inspire" : "Expire";

  return (
    <div>
      <div className="px-5 pt-6 pb-2">
        <Link to="/reflexoes" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground">
          <ArrowLeft className="h-3 w-3" /> Reflexões
        </Link>
      </div>
      <AppHeader subtitle="Pausa e Reflexão" />

      <section className="px-5 pt-2">
        <div className="rounded-xl border border-border bg-card p-6 text-center shadow-soft">
          <div className="relative mx-auto h-56 w-56">
            <div className="absolute inset-0 rounded-full bg-aqua/20" />
            <div
              className="absolute inset-6 rounded-full tile-primary animate-breathe shadow-soft"
              style={{ animationPlayState: running ? "running" : "paused" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-semibold text-muted-foreground">
                {running ? phase : "Pronto?"}
              </span>
              <span className="mt-1 text-4xl font-bold text-foreground tabular-nums">
                {format(secs)}
              </span>
            </div>
          </div>

          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                rastrear("clique", running ? "Pausa · Pausar cronômetro" : "Pausa · Iniciar cronômetro");
                setRunning((r) => !r);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft active:scale-95"
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pausar" : secs === 0 ? "Concluído" : "Começar"}
            </button>
            <button
              type="button"
              onClick={() => {
                rastrear("clique", "Pausa · Reiniciar cronômetro");
                setRunning(false);
                setSecs(TOTAL);
              }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-muted-foreground"
              aria-label="Reiniciar"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Respire no ritmo da bolha: inspire enquanto cresce, expire enquanto encolhe.
          </p>
        </div>
      </section>
    </div>
  );
}
