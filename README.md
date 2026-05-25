# Multicomunicar — Área de Membros

Plataforma exclusiva de membros para os workshops da **Multicomunicar**, da Fga. Carla Augusto Corrêa, especialista em Comunicação Aumentativa e Alternativa (CAA).

---

## Como rodar localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior

### Passos

```bash
# 1. Instalar dependências (apenas na primeira vez)
npm install

# 2. Rodar em modo desenvolvimento (abre automaticamente em http://localhost:3000)
npm run dev

# 3. Gerar versão de produção
npm run build

# 4. Testar a versão de produção localmente
npm run preview
```

---

## Acessos de demonstração

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Aluna | `ana@email.com` | `123` |
| Admin (Carla) | `carla@multicomunicar.com.br` | `admin` |

---

## Estrutura do projeto

```
multicomunicar-app/
├── src/
│   ├── main.jsx                 ← Ponto de entrada
│   ├── App.jsx                  ← Orquestrador principal (estado e rotas)
│   ├── index.css                ← Todos os estilos da aplicação
│   ├── assets/
│   │   ├── logo.png
│   │   └── apostila-caa-do-zero.pdf
│   ├── data/
│   │   └── content.js           ← EDITE AQUI: workshops, apostilas, vídeos, links, usuários
│   ├── hooks/
│   │   └── useStorage.js        ← Persistência localStorage
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ModBlock.jsx
│   │   ├── DoubtCard.jsx
│   │   └── Toast.jsx
│   └── pages/
│       ├── StudentHome.jsx
│       ├── Workshop.jsx
│       ├── MyDoubts.jsx
│       ├── Announcements.jsx
│       └── admin/
│           ├── AdminHome.jsx
│           ├── AdminStudents.jsx
│           ├── AdminDoubts.jsx
│           └── AdminAnnouncements.jsx
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                  ← Config deploy Vercel
├── netlify.toml                 ← Config deploy Netlify
└── README.md
```

---

## Como fazer manutenção

Todo o conteúdo editável fica em **`src/data/content.js`**.  
Você não precisa mexer em mais nada além desse arquivo para manutenção comum.

---

### Adicionar uma nova apostila

**Opção A — Arquivo local** (coloque o PDF em `src/assets/`):

```js
// 1. Importe no topo de content.js:
import apostilaModelagem from "../assets/apostila-modelagem.pdf";

// 2. Adicione no array APOSTILAS:
{
  id: 2,
  workshopId: 1,
  title: "Apostila Modelagem de CAA",
  filename: "apostila-modelagem.pdf",
  author: "Fga. Carla Augusto Corrêa",
  source: "asset",
  file: apostilaModelagem,
}
```

**Opção B — Link externo** (Google Drive, Dropbox etc.):

```js
{
  id: 2,
  workshopId: 1,
  title: "Apostila Modelagem de CAA",
  filename: "apostila-modelagem.pdf",
  author: "Fga. Carla Augusto Corrêa",
  source: "url",
  url: "https://drive.google.com/file/d/SEU_ID/preview",
}
```

> Para Google Drive, use o link de **incorporação** (embed):
> `https://drive.google.com/file/d/ID_DO_ARQUIVO/preview`

---

### Adicionar um novo workshop

Em `WORKSHOPS` dentro de `src/data/content.js`:

```js
{
  id: 2,
  title: "Modelagem de CAA",
  emoji: "🎯",
  description: "Estratégias avançadas de modelagem para profissionais e famílias.",
  color: "#8B7CA8",
  modules: [
    {
      id: 1,
      title: "Módulo 1: Fundamentos da modelagem",
      lessons: ["O que é modelagem?", "Por que modelar?"],
    },
  ],
}
```

Depois de adicionar o workshop, avisos iniciais para ele podem ser criados no painel Admin dentro do próprio app.

---

### Adicionar vídeos

Em `VIDEOS` dentro de `src/data/content.js`:

```js
{
  id: 1,
  workshopId: 1,
  moduleId: 1,       // opcional
  title: "Introdução à CAA na prática",
  duration: "18:45",
  url: "https://www.youtube.com/embed/VIDEO_ID",
}
```

> Use sempre o link de **embed**: `https://www.youtube.com/embed/ID_DO_VIDEO`

---

### Adicionar links úteis

Em `LINKS_UTEIS` dentro de `src/data/content.js`:

```js
{
  id: 3,
  workshopId: 1,
  title: "Nome do recurso",
  url: "https://...",
  description: "Breve descrição do que é o link",
}
```

---

### Adicionar uma aluna no código

Em `INITIAL_USERS` dentro de `src/data/content.js`:

```js
{
  id: 2,
  name: "Maria Silva",
  email: "maria@email.com",
  password: "senha123",
  role: "student",
  workshopIds: [1],
  joinedAt: "01/06/2025",
  status: "active",
}
```

> Alunas também podem ser cadastradas pelo painel Admin dentro do próprio app — e ficam salvas no localStorage do navegador.

---

## Dados persistidos

Os dados abaixo sobrevivem ao recarregamento da página (localStorage):

| Chave | O que guarda |
|-------|-------------|
| `mc-users` | Lista de alunas (incluindo as cadastradas pelo admin) |
| `mc-doubts` | Todas as dúvidas e respostas |
| `mc-announcements` | Avisos publicados pelo admin |

Para resetar os dados ao estado inicial, limpe o localStorage do navegador (F12 → Application → Local Storage → Limpar).

---

## Deploy na Vercel

O projeto já vem configurado com `vercel.json` para SPA routing.

```bash
# Instalar a CLI da Vercel
npm i -g vercel

# Fazer deploy
vercel

# Deploy de produção
vercel --prod
```

Ou conecte o repositório GitHub diretamente no painel da [Vercel](https://vercel.com) — ela detecta automaticamente o Vite e usa `npm run build` + pasta `dist/`.

## Deploy no Netlify

O projeto vem com `netlify.toml` configurado.

1. Rode `npm run build`
2. Arraste a pasta `dist/` para o painel do Netlify
3. Ou conecte o repositório GitHub para deploy automático

---

## Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| React 18 | Interface |
| Vite 5 | Build e dev server |
| CSS puro (`index.css`) | Estilo sem dependências externas |
| Google Fonts | Montserrat + Nunito |
| localStorage | Persistência de dados sem backend |

---

## Contato

**Fga. Carla Augusto Corrêa** · CRFa1-12390  
Instagram: [@multicomunicar](https://instagram.com/multicomunicar)
