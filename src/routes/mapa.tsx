import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { ArrowLeft, MapPin, Phone, ExternalLink } from "lucide-react";
import { rastrear } from "@/lib/track";
import {
  filtros,
  locaisApoio,
  type CategoriaApoio,
} from "@/data/locais";

const MapaApoio = lazy(() => import("@/components/mapa-apoio"));

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Apoio Profissional em Corumbá-MS — ConectaMente" },
      {
        name: "description",
        content:
          "Encontre psicólogos online, CAPS, UBS e contatos de emergência em Corumbá-MS.",
      },
    ],
  }),
  component: Mapa,
});

type Filtro = CategoriaApoio | "todos";

function Mapa() {
  const [f, setF] = useState<Filtro>("todos");
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);
  const filtrados = useMemo(
    () => (f === "todos" ? locaisApoio : locaisApoio.filter((l) => l.categoria === f)),
    [f],
  );

  return (
    <div>
      <div className="px-5 pt-6 pb-2">
        <Link to="/apoio" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="h-3 w-3" /> Apoio
        </Link>
      </div>
      <AppHeader subtitle="Apoio Profissional · Corumbá-MS" />

      <section className="px-5 pt-2">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
          {filtros.map((opt) => {
            const active = f === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setF(opt.id);
                  rastrear("clique", `Mapa · Filtro ${opt.label}`);
                }}
                className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-5 pt-2">
        {client ? (
          <Suspense
            fallback={<div className="h-[320px] w-full animate-pulse rounded-2xl bg-secondary" />}
          >
            <MapaApoio locais={filtrados} />
          </Suspense>
        ) : (
          <div className="h-[320px] w-full animate-pulse rounded-2xl bg-secondary" />
        )}
      </section>

      <section className="px-5 pt-4 space-y-2">
        {filtrados.map((l) => (
          <article
            key={l.id}
            className="rounded-2xl border border-border bg-card p-4 shadow-soft"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-aqua/30 text-aqua-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-card-foreground">{l.nome}</h3>
                {l.descricao ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{l.descricao}</p>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">{l.endereco}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {l.telefone ? (
                    <a
                      href={`tel:${l.telefone.replace(/\D/g, "")}`}
                      onClick={() => rastrear("clique", `Mapa · Ligar ${l.nome}`)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
                    >
                      <Phone className="h-3 w-3" /> {l.telefone}
                    </a>
                  ) : null}
                  {typeof l.lat === "number" && typeof l.lng === "number" ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${l.nome}, ${l.endereco}`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => rastrear("clique", `Mapa · Rota ${l.nome}`)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" /> Google Maps
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
