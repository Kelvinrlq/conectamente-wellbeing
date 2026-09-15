import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, useCallback } from "react";
import {
  adminStatus,
  adminLogin,
  adminLogout,
  obterMetricas,
  adminListarPlaylists,
  adminAdicionarPlaylist,
  adminRemoverPlaylist,
  exportarEventos,
  type Metricas,
  type Linha,
  type PlaylistAdmin,
} from "@/lib/admin.functions";
import { AppHeader } from "@/components/app-header";
import { toast } from "sonner";
import { Lock, LogOut, Trash2, BarChart3, MousePointerClick, MessageCircle, Music } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel administrador — ConectaMente" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Área restrita de administração do ConectaMente." },
    ],
  }),
  component: Admin,
});

const CATEGORIAS = [
  { id: "natureza", label: "Natureza" },
  { id: "foco", label: "Foco" },
  { id: "sono", label: "Sono" },
  { id: "meditacao", label: "Meditações" },
];

function Admin() {
  const status = useServerFn(adminStatus);
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const metricasFn = useServerFn(obterMetricas);
  const listar = useServerFn(adminListarPlaylists);
  const adicionar = useServerFn(adminAdicionarPlaylist);
  const remover = useServerFn(adminRemoverPlaylist);

  const [carregando, setCarregando] = useState(true);
  const [liberado, setLiberado] = useState(false);
  const [senha, setSenha] = useState("");
  const [dias, setDias] = useState(7);
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistAdmin[]>([]);
  const [form, setForm] = useState({ categoria: "natureza", nome: "", link: "", descricao: "" });
  const [salvando, setSalvando] = useState(false);

  const carregarDados = useCallback(
    async (periodo: number) => {
      const [m, p] = await Promise.all([
        metricasFn({ data: { dias: periodo } }),
        listar(),
      ]);
      setMetricas(m);
      setPlaylists(p);
    },
    [metricasFn, listar],
  );

  useEffect(() => {
    status()
      .then(async (s) => {
        setLiberado(s.unlocked);
        if (s.unlocked) await carregarDados(7);
      })
      .finally(() => setCarregando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    const r = await login({ data: { senha } });
    if (!r.ok) {
      toast.error("Senha incorreta");
      return;
    }
    setSenha("");
    setLiberado(true);
    await carregarDados(dias);
  }

  async function trocarPeriodo(p: number) {
    setDias(p);
    await carregarDados(p);
  }

  async function sair() {
    await logout();
    setLiberado(false);
    setMetricas(null);
    setPlaylists([]);
  }

  async function salvarMusica(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      await adicionar({ data: form });
      toast.success("Música adicionada");
      setForm({ categoria: form.categoria, nome: "", link: "", descricao: "" });
      await carregarDados(dias);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível adicionar");
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: string) {
    try {
      await remover({ data: { id } });
      toast.success("Música removida");
      await carregarDados(dias);
    } catch {
      toast.error("Não foi possível remover");
    }
  }

  if (carregando) {
    return (
      <div className="px-5 py-10 text-sm text-muted-foreground">Carregando…</div>
    );
  }

  if (!liberado) {
    return (
      <div>
        <AppHeader subtitle="Área restrita" />
        <form onSubmit={entrar} className="px-5 pt-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-2 text-card-foreground">
              <Lock className="h-4 w-4 text-primary" />
              <h1 className="text-base font-bold">Painel administrador</h1>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Digite a senha de acesso para continuar.
            </p>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              placeholder="Senha de acesso"
              className="mt-4 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="mt-3 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <AppHeader subtitle="Painel administrador" />

      <div className="flex items-center justify-between px-5 pt-2">
        <div className="flex gap-2">
          {[7, 30, 90].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => trocarPeriodo(p)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                dias === p
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground"
              }`}
            >
              {p} dias
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={sair}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground"
        >
          <LogOut className="h-3.5 w-3.5" /> Sair
        </button>
      </div>

      {metricas ? (
        <>
          <section className="grid grid-cols-2 gap-3 px-5 pt-4">
            <Resumo icon={BarChart3} label="Visitas" valor={metricas.resumo.paginas} />
            <Resumo icon={MousePointerClick} label="Cliques" valor={metricas.resumo.cliques} />
            <Resumo icon={MessageCircle} label="Chat" valor={metricas.resumo.chats} />
            <Resumo icon={Music} label="Músicas tocadas" valor={metricas.resumo.playlists} />
          </section>

          <Grafico titulo="Páginas mais visitadas" dados={metricas.porPagina} />
          <Grafico titulo="Botões e cards mais clicados" dados={metricas.porClique} />
          <Grafico titulo="Músicas mais tocadas" dados={metricas.porPlaylist} />

          <section className="px-5 pt-6">
            <h2 className="mb-2 text-sm font-bold text-foreground">Acessos por dia</h2>
            <div className="h-56 rounded-2xl border border-border bg-card p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricas.porDia}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="dia" fontSize={10} />
                  <YAxis allowDecimals={false} fontSize={10} width={24} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      ) : null}

      <section className="px-5 pt-8">
        <h2 className="mb-2 text-sm font-bold text-foreground">Playlists</h2>
        <form onSubmit={salvarMusica} className="rounded-2xl border border-border bg-card p-4">
          <select
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
          >
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Nome da música"
            className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
          />
          <input
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="Link do YouTube (ou o ID do vídeo)"
            className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
          />
          <input
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            placeholder="Descrição curta (opcional)"
            className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={salvando}
            className="mt-3 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {salvando ? "Salvando…" : "Adicionar música"}
          </button>
        </form>

        <div className="mt-4 space-y-4">
          {CATEGORIAS.map((c) => {
            const itens = playlists.filter((p) => p.categoria === c.id);
            return (
              <div key={c.id}>
                <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {c.label}
                </h3>
                {itens.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nenhuma música nesta categoria.</p>
                ) : (
                  <ul className="space-y-2">
                    {itens.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-card-foreground">
                            {p.nome}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{p.video_id}</p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remover ${p.nome}`}
                          onClick={() => excluir(p.id)}
                          className="shrink-0 rounded-lg p-2 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Resumo({
  icon: Icon,
  label,
  valor,
}: {
  icon: typeof BarChart3;
  label: string;
  valor: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-2xl font-bold text-card-foreground">{valor}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Grafico({ titulo, dados }: { titulo: string; dados: { nome: string; total: number }[] }) {
  return (
    <section className="px-5 pt-6">
      <h2 className="mb-2 text-sm font-bold text-foreground">{titulo}</h2>
      <div className="h-56 rounded-2xl border border-border bg-card p-3">
        {dados.length === 0 ? (
          <p className="pt-16 text-center text-xs text-muted-foreground">
            Ainda sem registros neste período.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} layout="vertical" margin={{ left: 8 }}>
              <XAxis type="number" allowDecimals={false} fontSize={10} />
              <YAxis type="category" dataKey="nome" width={110} fontSize={10} />
              <Tooltip />
              <Bar dataKey="total" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
