export type CategoriaApoio = "psicologo" | "publica";

export type LocalApoio = {
  id: string;
  nome: string;
  categoria: CategoriaApoio;
  endereco: string;
  telefone?: string;
  descricao?: string;
  /** Coordenadas reais. Locais só online não têm ponto no mapa. */
  lat?: number;
  lng?: number;
};

// Centro aproximado de Corumbá-MS
export const CORUMBA_CENTER: [number, number] = [-19.0078, -57.6531];

export const locaisApoio: LocalApoio[] = [
  {
    id: "cvv",
    nome: "CVV — Centro de Valorização da Vida",
    categoria: "psicologo",
    endereco: "Atendimento por telefone, chat e e-mail",
    telefone: "188",
    descricao: "Apoio emocional e prevenção do suicídio, 24h, gratuito.",
  },
  {
    id: "maria-angelica",
    nome: "Psicóloga Maria Angélica C. C. Formiga",
    categoria: "psicologo",
    endereco:
      "Alameda Maria Antônia de Carvalho, 05 — entre R. Frei Mariano e Antônio Maria, Cristo Redentor, Corumbá - MS, 79311-560 (perto da Escola Rotary Club)",
    lat: -19.026834,
    lng: -57.6434136,
  },
  {
    id: "marcia-barbosa",
    nome: "Márcia Barbosa — Psicóloga Infantil",
    categoria: "psicologo",
    endereco: "R. Pedro de Medeiros, 7 - Popular Velha, Corumbá - MS, 79310-110",
    lat: -19.0139186,
    lng: -57.6432623,
  },
  {
    id: "bruna-lemos",
    nome: "Psicóloga Bruna Mariana de Oliveira Lemos",
    categoria: "psicologo",
    descricao: "Atende também on-line.",
    endereco: "R. Barão de Melgaço, 35 - Universitário, Corumbá - MS, 79304-070",
    lat: -19.0155665,
    lng: -57.6344327,
  },
  {
    id: "dra-sandra",
    nome: "Consultório Psicológico Drª Sandra",
    categoria: "psicologo",
    endereco: "R. Maj. Gama, 145 - Centro, Corumbá - MS, 79331-010",
    lat: -19.0137242,
    lng: -57.6531981,
  },
  {
    id: "ubs-ladeira",
    nome: "UBS da Ladeira",
    categoria: "publica",
    endereco: "Ladeira Cunha e Cruz, 2-122 - Centro, Corumbá - MS, 79301-130",
    lat: -18.9972638,
    lng: -57.651539,
  },
  {
    id: "ubs-sao-bartolomeu",
    nome: "UBS São Bartolomeu",
    categoria: "publica",
    endereco: "R. Pernambuco, 374-396 - Vila Guarani, Corumbá - MS, 79321-210",
    lat: -19.0403567,
    lng: -57.6565342,
  },
  {
    id: "ubs-angelica-anache",
    nome: "UBS Angélica Anache",
    categoria: "publica",
    endereco: "Cristo Redentor, Corumbá - MS, 79311-640",
    lat: -19.0281207,
    lng: -57.6432542,
  },
  {
    id: "caps-i",
    nome: "CAPS I",
    categoria: "publica",
    endereco: "R. Cuiabá, 1291 - Centro, Corumbá - MS, 79331-100",
    lat: -19.0052096,
    lng: -57.6579932,
  },
  {
    id: "caps-ii",
    nome: "CAPS II José Fragelli",
    categoria: "publica",
    endereco: "R. Ten. Melquíades de Jesus, 532 - Centro, Corumbá - MS",
    lat: -18.9986617,
    lng: -57.6448565,
  },
  {
    id: "cras-iv",
    nome: "CRAS IV",
    categoria: "publica",
    endereco: "R. Joaquim Murtinho, 2117 - Aeroporto, Corumbá - MS, 79332-050",
    lat: -19.008491,
    lng: -57.6482355,
  },
  {
    id: "cras-albuquerque",
    nome: "CRAS Albuquerque",
    categoria: "publica",
    endereco:
      "Praça Céu - R. Mal. Deodoro, 2185-2339 - Popular Nova, Corumbá - MS, 79321-765",
    lat: -19.0336987,
    lng: -57.6580813,
  },
];

export const filtros: { id: CategoriaApoio | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "psicologo", label: "Psicólogos" },
  { id: "publica", label: "Rede Pública (CAPS/UBS)" },
];
