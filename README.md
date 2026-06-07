# 🌍 DiscoverCountry

Quiz educativo de Bandeiras e Capitais de países do mundo.

## Tecnologias

- **React 18** + **TypeScript**
- **React Router DOM v6**
- **Axios** para requisições HTTP
- **CSS Modules** para estilos
- **Context API** para autenticação
- **Vite** como bundler

## Como rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
├── app/            # Router e Providers
├── pages/          # Login, Home, Game, Ranking, NotFound
├── components/     # Layout, Navbar, QuestionCard, ScoreBoard, Loading, ProtectedRoute
├── hooks/          # useAuth, useCountries, useGame, useRanking
├── contexts/       # AuthContext
├── services/       # api, countriesService, authService, rankingService
├── utils/          # shuffle, randomQuestion, scoreCalculator
├── types/          # Tipagens TypeScript
└── styles/         # CSS global
```

## Modos de jogo

| Modo | Descrição |
|------|-----------|
| 🏳️ Bandeira → País | Veja a bandeira, descubra o país |
| 🌍 País → Capital | Dado o país, qual é a capital? |
| 🏛️ Capital → País | Dada a capital, qual é o país? |

## Regras

- 8 perguntas por rodada
- 20 segundos por pergunta
- 4 alternativas sempre (1 correta)
- Ranking salvo no `localStorage`
- Dados da [REST Countries API](https://restcountries.com)
