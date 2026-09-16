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

      <section className="px-5 pt-5">
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5">
          <p className="text-sm font-bold text-destructive">
            Em crise agora?
          </p>
          <p className="mt-2 text-base text-foreground">
            CVV: ligue <strong>188</strong> · SAMU: <strong>192</strong>. Gratuito, 24h.
          </p>
          <a
            href="tel:188"
            onClick={() => rastrear("clique", "Apoio · Ligar CVV 188")}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground"
          >
            <Phone className="h-3.5 w-3.5" /> Ligar para o CVV (188)
          </a>
        </div>
      </section>

      <section className="space-y-3 px-5 pt-6">
        <Link
          to="/chat"
          onClick={() => rastrear("clique", "Apoio · Conversa Amiga")}
          className="flex min-h-20 items-center gap-4 rounded-xl border border-primary/25 bg-card p-4 shadow-soft transition-colors hover:bg-primary/5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-foreground">Conversa Amiga (Anônima)</h3>
            <p className="mt-1 text-sm text-muted-foreground">Bate-papo seguro, sem cadastro, sem julgamento.</p>
          </div>
          <ArrowRight className="h-5 w-5 opacity-80" />
        </Link>

        <Link
          to="/mapa"
          onClick={() => rastrear("clique", "Apoio · Mapa de Apoio")}
          className="flex min-h-20 items-center gap-4 rounded-xl border border-aqua/50 bg-card p-4 shadow-soft transition-colors hover:bg-aqua/10"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-aqua/25 text-aqua-foreground">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-foreground">Apoio Profissional em Corumbá-MS</h3>
            <p className="mt-1 text-sm text-muted-foreground">Mapa com CAPS, UBS, psicólogos e emergência.</p>
          </div>
          <ArrowRight className="h-5 w-5 opacity-80" />
        </Link>
      </section>

      <section className="px-5 pt-6">
        <h2 className="mb-3 text-lg font-bold text-foreground">Contatos rápidos</h2>
        <div className="space-y-2">
          {[
            { label: "CVV — Apoio Emocional", num: "188" },
            { label: "SAMU — Emergência médica", num: "192" },
            { label: "Polícia Militar", num: "190" },
            { label: "Paróquia São João Bosco — Central de ajuda", num: "(67) 3231-4301" },
          ].map((c) => (
            <a
              key={c.num}
              href={`tel:${c.num}`}
              onClick={() => rastrear("clique", `Apoio · Ligar ${c.label}`)}
              className="grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:bg-muted"
            >
              <span className="min-w-0 text-sm font-medium text-card-foreground">{c.label}</span>
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
