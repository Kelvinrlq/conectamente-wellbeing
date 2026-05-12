export type CategoriaApoio = "online" | "publica" | "emergencia";

export type LocalApoio = {
  id: string;
  nome: string;
  categoria: CategoriaApoio;
  endereco: string;
  telefone: string;
  descricao?: string;
  lat: number;
  lng: number;
};

// Centro aproximado de Corumbá-MS
export const CORUMBA_CENTER: [number, number] = [-19.0078, -57.6531];

// Pontos placeholder — substitua pelos dados reais que você for fornecer.
export const locaisApoio: LocalApoio[] = [
  {
    id: "caps-corumba",
    nome: "CAPS Corumbá",
    categoria: "publica",
    endereco: "Rua América, s/n — Centro, Corumbá-MS",
    telefone: "(67) 3231-0000",
    descricao: "Centro de Atenção Psicossocial — atendimento gratuito.",
    lat: -19.0103,
    lng: -57.6520,
  },
  {
    id: "ubs-centro",
    nome: "UBS Centro",
    categoria: "publica",
    endereco: "Rua Delamare, Centro, Corumbá-MS",
    telefone: "(67) 3231-1111",
    descricao: "Unidade Básica de Saúde — primeiro contato.",
    lat: -19.0095,
    lng: -57.6557,
  },
  {
    id: "samu",
    nome: "SAMU 192",
    categoria: "emergencia",
    endereco: "Atendimento móvel de urgência",
    telefone: "192",
    descricao: "Emergências médicas 24h.",
    lat: -19.0061,
    lng: -57.6502,
  },
  {
    id: "cvv",
    nome: "CVV — Centro de Valorização da Vida",
    categoria: "emergencia",
    endereco: "Atendimento por telefone, chat e e-mail",
    telefone: "188",
    descricao: "Apoio emocional e prevenção do suicídio, 24h, gratuito.",
    lat: -19.0078,
    lng: -57.6531,
  },
  {
    id: "psic-online-1",
    nome: "Psicólogos Online (exemplo)",
    categoria: "online",
    endereco: "Atendimento por videochamada",
    telefone: "—",
    descricao: "Plataforma de atendimento psicológico online.",
    lat: -19.0042,
    lng: -57.6488,
  },
];

export const filtros: { id: CategoriaApoio | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "online", label: "Psicólogos Online" },
  { id: "publica", label: "Rede Pública (CAPS/UBS)" },
  { id: "emergencia", label: "Emergência" },
];
