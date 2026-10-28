# MIGRATION.md — Diagnóstico para migração do projeto

Projeto: **YAMA Vidros e Alumínio** (site institucional + formulário de orçamento + painel administrativo)

---

## 1. Tipo do projeto e stack

- **Tipo:** Site institucional (landing page) **com sistema de banco de dados**: formulário público de orçamento que grava no banco (com upload de fotos) e painel administrativo autenticado que lista e gerencia os pedidos.
- **Framework:** TanStack Start v1 (full-stack React 19 com SSR/server, roteamento via TanStack Router), construído sobre Vite 8.
- **Linguagem:** TypeScript 5.8.
- **UI:** Tailwind CSS v4 (via `src/styles.css`) + shadcn/ui (Radix UI) + lucide-react + sonner.
- **Node:** v22.23.4 (versão usada no ambiente atual; nenhuma versão mínima fixada em `package.json`).
- **Gerenciador de pacotes:** **Bun** (bun.lock + bunfig.toml). Funciona também com npm, mas o lockfile presente é o do Bun.
- **Deploy atual:** hospedado pela plataforma Lovable (build via Nitro direcionado a Cloudflare Workers).

## 2. Comandos

```bash
# Instalar dependências
bun install            # (ou npm install)

# Rodar em desenvolvimento
bun run dev            # (ou npm run dev)

# Build de produção
bun run build          # (ou npm run build)

# Testes
bun run test           # (ou npm run test)

# Lint / formatação
bun run lint
bun run format
```

O `vite.config.ts` importa o plugin `@lovable.dev/vite-tanstack-config` (ver seção 9). Fora da plataforma Lovable, esse pacote continua instalável via npm, mas faz partes específicas do ambiente (injeção de `VITE_*`, detecção de sandbox, devtools).

## 3. Banco de dados (Lovable Cloud / Supabase PostgreSQL)

| Objeto | Tipo | Linhas |
|---|---|---|
| `public.orcamentos` | tabela | 2 |
| `public.user_roles` | tabela | 2 |
| `public.has_role(uuid, app_role)` | função SQL (security definer) | — |
| `public.app_role` ('admin', 'user') | enum | — |

- RLS habilitado nas duas tabelas. Políticas: qualquer visitante pode **inserir** orçamento; apenas usuários com papel `admin` podem **ler/atualizar** orçamentos; usuário lê apenas os próprios papéis. DELETE negado.
- Bucket `orcamento-fotos` (privado, limite 5 MB) com policies equivalentes; nomes de arquivos ficam em `orcamentos.fotos` (text[]).
- SQL das migrations: `drizzle/migrations/0000_create_orcamentos_and_roles.sql` (Drizzle Kit; ver `drizzle.config.ts`).

**Sem dados de linhas neste arquivo.**

## 4. Autenticação

- **Auth padrão do Supabase** (Lovable Cloud), via `@supabase/supabase-js` no navegador.
- Métodos ativos: **e-mail/senha** e **OAuth Google** (login "Entrar com Google" no painel; também login via `@lovable.dev/cloud-auth-js` — ver seção 9).
- **Usuários: 2** (contas administrativas). Cadastro anônimo desativado; sem auto-confirmação de e-mail.
- Fluxo de recuperação de senha: página `/reset-password` (app), com e-mail de redefinição padrão do Supabase.
- Papéis: tabela `user_roles` + função `has_role` (nada derivado de metadata do usuário).

## 5. Storage

| Bucket | Público | Arquivos |
|---|---|---|
| `orcamento-fotos` | Não (privado) | 0 |

## 6. Edge Functions

- **Nenhuma.** Não existe pasta `supabase/functions` nem rotas de API próprias (`src/routes/api` não existe).
- Toda a lógica de back-end usada é feita direto do navegador contra o banco (RLS aplica as regras) e/ou pela infraestrutura gerada pela plataforma Lovable.

## 7. Secrets (apenas NOMES — nunca valores)

| Secret | Origem / serviço |
|---|---|
| `LOVABLE_API_KEY` | Plataforma Lovable (gateway de IA; **não é usado pelo código** — nenhuma chamada de IA no projeto) |
| `LOVABLE_CRON_SECRET` | Plataforma Lovable (autenticação de rotas agendadas; não usado pelo código) |
| `SUPABASE_ANON_KEY` | Supabase / Lovable Cloud |
| `SUPABASE_DB_URL` | Supabase / Lovable Cloud |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase / Lovable Cloud (usado só por módulos `.server.ts` gerados) |
| `SUPABASE_URL` | Supabase / Lovable Cloud |

## 8. Integrações externas

- **WhatsApp:** apenas **links profundos** (`https://wa.me/5514996313014` e `https://wa.me/5514988036113`) em CTAs e no painel admin. Nenhuma API/SDK do WhatsApp.
- **Google Fonts:** CSS remoto (Cormorant Garamond, Manrope) via `<link>` no `__root`.
- **Google Maps:** iframe público (embed) na seção de contato.
- **Google OAuth:** via provedor de Auth do Supabase.
- **IA:** **não usa IA** — nenhuma chamada ao gateway de IA da Lovable nem a outros provedores.
- **Pagamento / e-mail transacional:** nenhum.

## 9. Dependências da plataforma Lovable (o que quebraria fora dela)

Fora da plataforma, estes pontos precisam de atenção:

1. **`@lovable.dev/vite-tanstack-config`** (plugin do Vite): fornece TanStack Start + devtools + injeção de `VITE_*` + alias `@` + nitro/Cloudflare. Instalável via npm, mas é o empacotamento da Lovable; fora dela pode ser necessário montar config equivalente manualmente.
2. **Assets servidos pela Lovable (`lovable-assets`):** `src/assets/yama-logo-hd.png.asset.json`, `yama-logo.png.asset.json` e `yama-logo.jpg.asset.json` são *pointers* JSON que apontam para URLs internas (`/__l5e/assets-v1/...`) hospedadas no R2 da Lovable. **Fora da plataforma o arquivo não resolve** — baixar as imagens e trocar por imports estáticos (`import logo from "@/assets/yama-logo-hd.png"`).
3. **`src/integrations/supabase/previewAuthStorage.ts`** (auto-gerado): storage "brokered" de sessão usado só no preview da Lovable; fora dela o `client.ts` gerado precisa ser revisado/gerado por `supabase gen types` + client normal.
4. **`src/integrations/supabase/auth-middleware.ts`, `auth-attacher.ts`, `client.server.ts`** (auto-gerados): middleware de auth de server functions e client admin (service role) — dependem das variáveis de ambiente injetadas pela plataforma.
5. **`src/integrations/lovable/index.ts`** + **`@lovable.dev/cloud-auth-js`**: botão "Entrar com Google" do painel passa pelo wrapper `lovable.auth.signInWithOAuth`. Migração: trocar por `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } })`.
6. **`src/lib/lovable-error-reporting.ts`**: telemetria de erros para a plataforma (inofensiva fora dela, mas gera requisições que falharão — remover ou desativar).
7. **Variáveis injetadas pela plataforma:** `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `LOVABLE_API_KEY`, `LOVABLE_CRON_SECRET` são provisionadas pelo ambiente Lovable em runtime; em outro servidor devem ser configuradas manualmente.
8. **Deploy:** o build Nitro aponta para Cloudflare Workers conforme a plataforma; auto-hospedar exige escolher target (Node, Cloudflare, etc.) e adaptar `vite.config.ts`.
9. **`src/start.ts`**: middleware CSRF + `attachSupabaseAuth` — a parte da plataforma é o middleware gerado; a lógica em si é padrão TanStack Start.

## 10. Variáveis de ambiente (apenas NOMES)

Presentes no `.env` do projeto:

- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`

Injetadas pela plataforma (fora do `.env`): `SUPABASE_SERVICE_ROLE_KEY`, `LOVABLE_API_KEY`, `LOVABLE_CRON_SECRET`, `SUPABASE_ANON_KEY`, `SUPABASE_DB_URL` (ver seção 7).

## 11. Tipo de backend e IDs

- **Tipo:** Lovable Cloud (backend gerenciado — Supabase sob o capô; a mesma instância serve preview e produção).
- **Project ID do backend:** `qndzkdntnhfegeumtdla`
- **Project ID do Lovable (app):** `bc6d46d5-346f-454a-a210-a709ecaa4c2e`

---

## Valores (visíveis para mim)

Estes valores estão no `.env` do projeto (a publishable key é a chave pública/anon — não é secreta):

```
SUPABASE_PROJECT_ID=qndzkdntnhfegeumtdla
SUPABASE_PUBLISHABLE_KEY=sb_publishable_NknAsCrFARscWE9siRfPBA_aDE0Mq8M
SUPABASE_URL=https://qndzkdntnhfegeumtdla.supabase.co
VITE_SUPABASE_PROJECT_ID=qndzkdntnhfegeumtdla
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_NknAsCrFARscWE9siRfPBA_aDE0Mq8M
VITE_SUPABASE_URL=https://qndzkdntnhfegeumtdla.supabase.co
```

Os demais (seção 7/9) — **valor não acessível**.
