export const reflexoesDoDia = [
  "Você não precisa ter tudo resolvido hoje. Um passo de cada vez já é coragem.",
  "Sentir é humano. Acolher o que sente é o início do cuidado.",
  "A pausa também é produtiva. O descanso constrói você.",
  "Pedir ajuda não é fraqueza — é inteligência emocional.",
  "Seu valor não está nas suas notas. Você é mais do que produz.",
  "Respira. Esse momento difícil também passa.",
  "Pequenos progressos são progressos. Comemore os seus.",
];

export const conselhosDoDia = [
  "Tente a regra dos 5-4-3-2-1: nomeie 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira, 1 que saboreia.",
  "Beba um copo d'água agora. O corpo e a mente caminham juntos.",
  "Escreva por 3 minutos sobre qualquer coisa. Sem julgar, sem revisar.",
  "Mande uma mensagem para alguém de quem você gosta. Conexão é remédio.",
  "Saia para uma caminhada de 10 minutos sem o celular.",
];

export const mensagensDeForca = [
  "Você já sobreviveu a 100% dos seus piores dias.",
  "Sua história não termina aqui.",
  "Você é capaz de coisas que nem imagina ainda.",
  "Coragem não é ausência de medo — é seguir mesmo com ele.",
  "Cada respiração é uma nova chance.",
];

export const mensagensDePaz = [
  "Que hoje você se permita descansar.",
  "Não há pressa. O tempo é seu.",
  "Você está exatamente onde precisa estar agora.",
  "Solte os ombros. Solte a mandíbula. Respire fundo.",
  "Tudo o que você precisa, por agora, é estar aqui.",
];

export const meditacoesDestaque = [
  { titulo: "Nova Meditação Guiada para Ansiedade", duracao: "8 min", categoria: "Ansiedade" },
  { titulo: "Respiração 4-7-8", duracao: "5 min", categoria: "Respiração" },
  { titulo: "Body Scan para Dormir", duracao: "12 min", categoria: "Sono" },
  { titulo: "Foco antes da Prova", duracao: "6 min", categoria: "Foco" },
];

// Como trocar as playlists:
// 1. Abra a playlist desejada no YouTube.
// 2. Copie tudo que vem depois de `list=` na URL. Ex.:
//    https://www.youtube.com/playlist?list=PLxxxxxxxxxxxxxxxx  ->  playlistId = "PLxxxxxxxxxxxxxxxx"
// 3. Cole em `playlistId` abaixo. O player mostrará a duração real de cada faixa.
export const playlistsYoutube: Record<
  "natureza" | "foco" | "sono" | "meditacao",
  { nome: string; playlistId: string; descricao: string }[]
> = {
  natureza: [
    {
      nome: "Sons da Natureza",
      playlistId: "PLQ_PIlf6OzqKidt2vHFrxUFDsQKZR9OWv",
      descricao: "Chuva, floresta e oceano para relaxar",
    },
  ],
  foco: [
    {
      nome: "Foco Profundo",
      playlistId: "PLOzDu-MXXLliO9fBNZOQTBDddoA3FzZUo",
      descricao: "Lofi e concentração para estudar",
    },
  ],
  sono: [
    {
      nome: "Sono Tranquilo",
      playlistId: "PLQ_PIlf6OzqKGKrOwceIrLfPZBHRVPQTS",
      descricao: "Para uma noite de descanso",
    },
  ],
  meditacao: [
    {
      nome: "Meditações Guiadas",
      playlistId: "PLbTctBAEcCcQKrKvVAgYFJZaZKPtOO_r_",
      descricao: "Mindfulness em português",
    },
  ],
};
