import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { Shield, Info, Bell, Heart } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — ConectaMente" },
      { name: "description", content: "Privacidade, preferências e informações sobre o ConectaMente." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  return (
    <div>
      <AppHeader subtitle="Seu espaço seguro" />

      <section className="px-5 pt-5">
        <div className="rounded-xl border border-border bg-card p-6 text-center shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-aqua/25 text-aqua-foreground">
            <Heart className="h-7 w-7" />
          </div>
          <h2 className="mt-3 text-lg font-bold text-card-foreground">Você é bem-vindo(a)</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sem cadastro, sem login. Sua identidade fica com você.
          </p>
        </div>
      </section>

      <section className="space-y-3 px-5 pt-6">
        {[
          {
            icon: Shield,
            title: "Privacidade & Anonimato",
            desc: "Não armazenamos suas conversas. Seu uso é totalmente anônimo.",
          },
          {
            icon: Bell,
            title: "Lembretes de pausa",
            desc: "Em breve: receba pequenos lembretes para respirar e descansar.",
          },
          {
            icon: Info,
            title: "Sobre o ConectaMente",
            desc: "Um app de apoio criado para estudantes. Não substitui acompanhamento profissional.",
          },
        ].map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aqua/30 text-aqua-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-card-foreground">{it.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="px-5 pt-6 pb-4">
        <p className="text-center text-sm text-muted-foreground">
          ConectaMente · Apoio emocional, não substitui atendimento clínico.
        </p>
      </section>
    </div>
  );
}
