import apostilaPdf from "../assets/apostila-caa-do-zero.pdf";

// ─────────────────────────────────────────────────────────────────────────────
// ASSETS EMBUTIDOS
// URLs resolvidas pelo Vite no build — usadas SEMPRE ao exibir apostilas
// embutidas, evitando que o localStorage armazene URLs obsoletas entre deploys.
// ─────────────────────────────────────────────────────────────────────────────
export const BUILT_IN_APOSTILAS = {
  "caa-zero-principal": apostilaPdf,
};

// Retorna a URL correta de uma apostila (embutida ou externa)
export const resolveApostilaUrl = (ap) => {
  if (ap?.builtIn && ap?.builtInKey) {
    return BUILT_IN_APOSTILAS[ap.builtInKey] ?? ap.url ?? "";
  }
  return ap?.url ?? "";
};

// Converte link de compartilhamento do Google Drive para embed
export const normalizeGDriveUrl = (url = "") => {
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m && !url.includes("/preview")) {
    return `https://drive.google.com/file/d/${m[1]}/preview`;
  }
  return url;
};

// ─────────────────────────────────────────────────────────────────────────────
// USUÁRIOS INICIAIS
// ─────────────────────────────────────────────────────────────────────────────
export const INITIAL_USERS = [
  {
    id: 1,
    name: "Ana Paula Ferreira",
    email: "ana@email.com",
    password: "123",
    role: "student",
    workshopIds: [1],
    joinedAt: "10/01/2025",
    status: "active",
  },
  {
    id: 99,
    name: "Carla Augusto Corrêa",
    email: "carla@multicomunicar.com.br",
    password: "admin",
    role: "admin",
    workshopIds: [],
    joinedAt: "01/01/2024",
    status: "active",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AVISOS INICIAIS
// ─────────────────────────────────────────────────────────────────────────────
export const INITIAL_ANNOUNCEMENTS = [
  { id: "default-1-0", workshopId: 1, text: "Bem-vinda ao Workshop CAA do Zero! 💙", date: "10/01/2025" },
  { id: "default-1-1", workshopId: 1, text: "Apostila disponível para visualização e download.", date: "10/01/2025" },
];

// ─────────────────────────────────────────────────────────────────────────────
// DÚVIDAS INICIAIS (demonstração)
// ─────────────────────────────────────────────────────────────────────────────
export const INITIAL_DOUBTS = [
  {
    id: 1,
    userId: 1,
    workshopId: 1,
    userName: "Ana Paula Ferreira",
    question: "Qual aplicativo é mais indicado para crianças com autismo no Módulo 2?",
    answer: "Olá Ana! O LetMe Talk e o Cboard são ótimas opções gratuitas. Para autismo, recomendo começar com o LetMe Talk pela simplicidade. 💙",
    answered: true,
    date: "15/05/2025",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WORKSHOPS INICIAIS
// Semente que popula o localStorage na primeira visita.
// Após isso, todos os workshops são gerenciados pelo painel admin.
//
// Estrutura de cada workshop:
//   id, title, emoji, description, color, coverUrl, status, createdAt,
//   modules  → [{ id, title, lessons: string[] }]
//   apostilas→ [{ id, title, filename, author, url, builtIn?, builtInKey? }]
//   videos   → [{ id, title, url, duration }]
//   links    → [{ id, title, url, description }]
//   extras   → [{ id, title, url, description, type }]
// ─────────────────────────────────────────────────────────────────────────────
export const INITIAL_WORKSHOPS = [
  {
    id: 1,
    title: "CAA do Zero",
    emoji: "📚",
    description: "Fundamentos da Comunicação Aumentativa e Alternativa — do conceito à prática.",
    color: "#3AABBA",
    coverUrl: "",
    status: "active",
    createdAt: "01/01/2025",
    modules: [
      {
        id: 101,
        title: "Módulo 1: Introdução à CAA",
        lessons: [
          "O que é CAA?",
          "Comunicação Aumentativa",
          "Comunicação Alternativa",
          "Todos os meios de comunicação são importantes",
          "CAA sem auxílio e CAA com auxílio",
        ],
      },
      {
        id: 102,
        title: "Módulo 2: Metodologias",
        lessons: [
          "PECS – Sistema de troca de figuras",
          "Etapas do PECS",
          "Core Words (palavras núcleo)",
          "Core Words × Fringe Words",
          "PODD – Organização Pragmática Dinâmica",
          "DAHCA",
          "RPM – Rapid Prompting Method",
        ],
      },
      {
        id: 103,
        title: "Módulo 3: Avaliação e Implementação",
        lessons: [
          "Métodos de acesso (toque, varredura, eye gaze)",
          "Quando implementar a CAA",
          "Quem pode implementar",
          "Avaliações e protocolos",
          "Planejamento de objetivos",
          "Matriz de Comunicação",
          "Níveis e funções da comunicação",
        ],
      },
      {
        id: 104,
        title: "Módulo 4: Vocabulário e Recursos",
        lessons: [
          "Seleção de vocabulário",
          "Chave de Fitzgerald",
          "Vocabulário essencial e acessório",
          "Organização dos símbolos",
          "Layouts e Plano Motor",
          "Pranchas de atividades e cenas visuais",
          "Flipbook",
        ],
      },
      {
        id: 105,
        title: "Módulo 5: Modelagem e Legislação",
        lessons: [
          "O que é modelagem?",
          "Como modelar na prática",
          "AsTeRICS Grid — layout e cadastro",
          "Configuração de voz e tabelas",
          "Lei nº 15.249/2025 — Nova Lei da CAA no Brasil",
        ],
      },
    ],
    apostilas: [
      {
        id: "ap-builtin-caa-1",
        title: "Apostila Principal — CAA do Zero",
        filename: "Apostila_CAA_do_zero.pdf",
        author: "Fga. Carla Augusto Corrêa · CRFa1-12390",
        builtIn: true,
        builtInKey: "caa-zero-principal",
        url: "",
      },
    ],
    videos: [],
    links: [
      { id: "link-101", title: "AsTeRICS Grid", url: "https://grid.asterics.eu", description: "Comunicador gratuito usado no workshop" },
      { id: "link-102", title: "ARASAAC", url: "https://arasaac.org", description: "Banco de pictogramas gratuito" },
    ],
    extras: [],
  },
];
