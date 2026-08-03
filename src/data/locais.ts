export type CategoriaApoio = "online" | "publica";

export type LocalApoio = {
  id: string;
  nome: string;
  categoria: CategoriaApoio;
  endereco: string;
  telefone: string;
  descricao?: string;
  /** Coordenadas reais. Locais só online não têm ponto no mapa. */
  lat?: number;
  lng?: number;
};

// Centro aproximado de Corumbá-MS (usado só enquanto não há pontos reais)
export const CORUMBA_CENTER: [number, number] = [-19.0078, -57.6531];

// Aguardando a lista real de locais de saúde mental de Corumbá-MS.
// Locais sem lat/lng aparecem apenas nos cards, sem marcador no mapa.
export const locaisApoio: LocalApoio[] = [
  {
    id: "cvv",
    nome: "CVV — Centro de Valorização da Vida",
    categoria: "online",
    endereco: "Atendimento por telefone, chat e e-mail",
    telefone: "188",
    descricao: "Apoio emocional e prevenção do suicídio, 24h, gratuito.",
  },
];

export const filtros: { id: CategoriaApoio | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "online", label: "Psicólogos Online" },
  { id: "publica", label: "Rede Pública (CAPS/UBS)" },
];
