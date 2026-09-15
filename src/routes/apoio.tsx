import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { MessageCircle, MapPin, Phone, ArrowRight } from "lucide-react";
import { rastrear } from "@/lib/track";

export const Route = createFileRoute("/apoio")({
  head: () => ({
    meta: [
      { title: "Apoio — ConectaMente" },
      {
        name: "description",
        content:
          "Converse de forma anônima, encontre apoio profissional em Corumbá-MS e contatos de emergência.",
      },
    ],
  }),
  component: Apoio,
});

function Apoio() {
  return (
    <div>
      <AppHeader subtitle="Apoio quando você precisa" />

      <section className="px-5 pt-2">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-destructive">
            Em crise agora?
          </p>
          <p className="mt-1 text-sm text-foreground">
            CVV: ligue <strong>188</strong> · SAMU: <strong>192</strong>. Gratuito, 24h.
          </p>
          <a
            href="tel:188"
            onClick={() => rastrear("clique", "Apoio · Ligar CVV 188")}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground"
          >
            <Phone className="h-3.5 w-3.5" /> Ligar para o CVV (188)
          </a>
        </div>
      </section>

      <section className="px-5 pt-4 space-y-3">
        <Link
          to="/chat"
          onClick={() => rastrear("clique", "Apoio · Conversa Amiga")}
          className="tile-primary flex items-center gap-4 rounded-2xl p-4 shadow-soft active:scale-[0.99] transition-transform"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/30 backdrop-blur">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold">Conversa Amiga (Anônima)</h3>
            <p className="text-xs opacity-90">Bate-papo seguro, sem cadastro, sem julgamento.</p>
          </div>
          <ArrowRight className="h-5 w-5 opacity-80" />
        </Link>

        <Link
          to="/mapa"
          onClick={() => rastrear("clique", "Apoio · Mapa de Apoio")}
          className="tile-aqua flex items-center gap-4 rounded-2xl p-4 shadow-soft active:scale-[0.99] transition-transform"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/35 backdrop-blur">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold">Apoio Profissional em Corumbá-MS</h3>
            <p className="text-xs opacity-90">Mapa com CAPS, UBS, psicólogos online e emergência.</p>
          </div>
          <ArrowRight className="h-5 w-5 opacity-80" />
        </Link>
      </section>

      <section className="px-5 pt-6">
        <h2 className="mb-2 text-sm font-bold text-foreground">Contatos rápidos</h2>
        <div className="space-y-2">
          {[
            { label: "CVV — Apoio Emocional", num: "188" },
            { label: "SAMU — Emergência médica", num: "192" },
            { label: "Polícia Militar", num: "190" },
          ].map((c) => (
            <a
              key={c.num}
              href={`tel:${c.num}`}
              onClick={() => rastrear("clique", `Apoio · Ligar ${c.label}`)}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
            >
              <span className="text-sm text-card-foreground">{c.label}</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                <Phone className="h-3.5 w-3.5" /> {c.num}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
