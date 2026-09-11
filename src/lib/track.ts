import { registrarEvento } from "./analytics.functions";

const PAGINAS: Record<string, string> = {
  "/": "Início",
  "/chat": "Conversa Amiga",
  "/recursos": "Recursos",
  "/apoio": "Apoio",
  "/perfil": "Perfil",
  "/reflexoes": "Reflexões",
  "/pausa": "Pausa",
  "/mapa": "Mapa de Apoio",
  "/player": "Player",
};

export function rastrear(tipo: "pagina" | "clique" | "chat" | "playlist", nome: string) {
  if (typeof window === "undefined") return;
  void registrarEvento({ data: { tipo, nome } }).catch(() => {});
}

export function rastrearPagina(pathname: string) {
  if (pathname.startsWith("/admin")) return;
  const nome = PAGINAS[pathname];
  if (!nome) return;
  rastrear("pagina", nome);
}
