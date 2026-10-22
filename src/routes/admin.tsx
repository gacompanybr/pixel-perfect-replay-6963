import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, LogOut, MessageCircle, X } from "lucide-react";
import { YamaLogo } from "@/components/yama-logo";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — YAMA Vidros e Alumínio" },
      { name: "description", content: "Área restrita da equipe YAMA para acompanhar os pedidos de orçamento." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Orcamento = Tables<"orcamentos">;

const STATUS = ["Novo", "Em análise", "Contatado", "Orçamento enviado", "Fechado", "Perdido"] as const;

const ACOES: Array<{ label: string; status: (typeof STATUS)[number] }> = [
  { label: "Marcar como contatado", status: "Contatado" },
  { label: "Marcar como orçamento enviado", status: "Orçamento enviado" },
  { label: "Marcar como fechado", status: "Fechado" },
  { label: "Marcar como perdido", status: "Perdido" },
];

function waLink(whatsapp: string) {
  const d = whatsapp.replace(/\D/g, "");
  return `https://wa.me/55${d}`;
}

function fmtData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Novo: "bg-primary text-primary-foreground",
    "Em análise": "bg-accent text-accent-foreground",
    Contatado: "bg-accent text-accent-foreground",
    "Orçamento enviado": "bg-secondary text-secondary-foreground",
    Fechado: "bg-navy text-navy-foreground",
    Perdido: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`eyebrow inline-block px-3 py-1.5 ${styles[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function AdminPage() {
  const [session, setSession] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modo, setModo] = useState<"login" | "registrar" | "recuperar">("login");
  const [authError, setAuthError] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [lista, setLista] = useState<Orcamento[]>([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [selecionado, setSelecionado] = useState<Orcamento | null>(null);
  const [fotosUrls, setFotosUrls] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);

  const carregar = useCallback(async () => {
    setLoadingLista(true);
    const { data } = await supabase.from("orcamentos").select("*").order("created_at", { ascending: false });
    setLista(data ?? []);
    setLoadingLista(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase.rpc("has_role", { _user_id: uid, _role: "admin" });
      setIsAdmin(!!data);
      if (data) carregar();
    })();
  }, [session, carregar]);

  async function handleLogin(ev: React.FormEvent) {
    ev.preventDefault();
    setAuthError("");
    setAuthMsg("");
    setAuthLoading(true);
    if (modo === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setAuthError("E-mail ou senha incorretos.");
    } else if (modo === "registrar") {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) {
        setAuthError("Não foi possível criar a conta. Verifique os dados e tente novamente.");
      } else {
        setAuthMsg(
          "Conta criada! Enviamos um e-mail de confirmação para você. Depois de confirmar, a equipe YAMA precisa liberar seu acesso ao painel."
        );
        setModo("login");
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setAuthError("Não foi possível enviar o e-mail de recuperação. Tente novamente.");
      } else {
        setAuthMsg("Enviamos um e-mail com o link para redefinir sua senha. Verifique sua caixa de entrada.");
        setModo("login");
      }
    }
    setAuthLoading(false);
  }

  async function handleGoogle() {
    setAuthError("");
    setAuthMsg("");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/admin`,
    });
    if (result.error) setAuthError("Não foi possível entrar com o Google. Tente novamente.");
  }

  async function abrir(o: Orcamento) {
    setSelecionado(o);
    setFotosUrls([]);
    if (o.fotos?.length) {
      const { data } = await supabase.storage.from("orcamento-fotos").createSignedUrls(o.fotos, 3600);
      setFotosUrls((data ?? []).map((d) => d.signedUrl).filter((u): u is string => !!u));
    }
  }

  async function mudarStatus(status: (typeof STATUS)[number]) {
    if (!selecionado || updating) return;
    setUpdating(true);
    const { error } = await supabase.from("orcamentos").update({ status }).eq("id", selecionado.id);
    if (!error) {
      setSelecionado({ ...selecionado, status });
      setLista((l) => l.map((o) => (o.id === selecionado.id ? { ...o, status } : o)));
    }
    setUpdating(false);
  }

  const inputCls =
    "w-full border border-input bg-background px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-navy text-navy-foreground">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-24">
          <Link to="/" aria-label="YAMA Vidros e Alumínio">
            <YamaLogo className="h-11 w-auto md:h-14" />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-navy-muted transition-colors hover:text-navy-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o site
            </Link>
            {session && isAdmin && (
              <button
                onClick={() => supabase.auth.signOut()}
                className="inline-flex items-center gap-2 text-sm text-navy-muted transition-colors hover:text-navy-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {session === null || (session && isAdmin === null) ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !session ? (
          <div className="mx-auto max-w-md py-12">
            <p className="eyebrow text-muted-foreground">Área restrita</p>
            <h1 className="mt-4 font-serif text-4xl text-primary">Painel administrativo</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Acesso exclusivo da equipe YAMA para acompanhar os pedidos de orçamento.
            </p>
            <form onSubmit={handleLogin} className="mt-10 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">E-mail</label>
                <input
                  className={inputCls}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@email.com"
                  autoComplete="email"
                  required
                />
              </div>
              {modo !== "recuperar" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Senha</label>
                  <input
                    className={inputCls}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={modo === "registrar" ? "Crie uma senha (mín. 6 caracteres)" : "Sua senha"}
                    autoComplete={modo === "registrar" ? "new-password" : "current-password"}
                    minLength={modo === "registrar" ? 6 : undefined}
                    required
                  />
                </div>
              )}
              {authError && <p className="text-sm text-destructive">{authError}</p>}
              {authMsg && <p className="text-sm leading-relaxed text-primary">{authMsg}</p>}
              <button
                type="submit"
                disabled={authLoading}
                className="eyebrow flex w-full items-center justify-center gap-3 bg-primary px-8 py-4 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {authLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {modo === "login" ? "Entrar" : modo === "registrar" ? "Criar conta" : "Enviar link de recuperação"}
              </button>
            </form>

            {modo === "login" && (
              <>
                <div className="mt-6 flex items-center gap-4">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <button
                  type="button"
                  onClick={handleGoogle}
                  className="eyebrow mt-6 flex w-full items-center justify-center gap-3 border border-border px-8 py-4 text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
                    />
                  </svg>
                  Entrar com Google
                </button>
              </>
            )}

            <div className="mt-8 space-y-3 text-center text-sm">
              {modo === "login" && (
                <>
                  <p>
                    <button
                      type="button"
                      onClick={() => {
                        setModo("recuperar");
                        setAuthError("");
                        setAuthMsg("");
                      }}
                      className="text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                    >
                      Esqueceu sua senha?
                    </button>
                  </p>
                  <p className="text-muted-foreground">
                    Ainda não tem conta?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setModo("registrar");
                        setAuthError("");
                        setAuthMsg("");
                      }}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Criar conta
                    </button>
                  </p>
                </>
              )}
              {modo !== "login" && (
                <p className="text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => {
                      setModo("login");
                      setAuthError("");
                      setAuthMsg("");
                    }}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Voltar para o login
                  </button>
                </p>
              )}
            </div>
          </div>
        ) : !isAdmin ? (
          <div className="mx-auto max-w-md py-12 text-center">
            <h1 className="font-serif text-3xl text-primary">Acesso não autorizado</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Esta conta não tem permissão para acessar o painel administrativo.
            </p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="eyebrow mt-8 border border-border px-6 py-3 text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Sair
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow text-muted-foreground">Painel administrativo</p>
            <h1 className="mt-4 font-serif text-4xl text-primary">Pedidos de orçamento</h1>

            {loadingLista ? (
              <div className="flex justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : lista.length === 0 ? (
              <p className="mt-10 text-sm text-muted-foreground">Nenhum pedido de orçamento recebido ainda.</p>
            ) : (
              <ul className="mt-12 divide-y divide-border border-y border-border">
                {lista.map((o) => (
                  <li key={o.id}>
                    <button
                      onClick={() => abrir(o)}
                      className="grid w-full grid-cols-2 items-center gap-3 py-5 text-left transition-colors hover:bg-secondary/60 sm:grid-cols-[1.4fr_1.2fr_1fr_auto] sm:gap-6 sm:px-4"
                    >
                      <span>
                        <span className="block font-medium text-foreground">{o.nome}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{o.cidade}</span>
                      </span>
                      <span className="text-sm text-muted-foreground">{o.servico}</span>
                      <span className="text-xs text-muted-foreground">{fmtData(o.created_at)}</span>
                      <StatusBadge status={o.status} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      {/* Detalhe do pedido */}
      {selecionado && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-navy/80 p-0 sm:items-center sm:p-6"
          onClick={() => setSelecionado(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Pedido de ${selecionado.nome}`}
        >
          <div
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-background p-6 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl text-primary">{selecionado.nome}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{fmtData(selecionado.created_at)}</p>
              </div>
              <button onClick={() => setSelecionado(null)} aria-label="Fechar" className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6">
              <StatusBadge status={selecionado.status} />
            </div>

            <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-border pt-8 sm:grid-cols-2">
              <div>
                <dt className="eyebrow text-muted-foreground">Serviço</dt>
                <dd className="mt-1.5 text-sm font-medium text-foreground">{selecionado.servico}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">WhatsApp</dt>
                <dd className="mt-1.5 text-sm font-medium text-foreground">{selecionado.whatsapp}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">E-mail</dt>
                <dd className="mt-1.5 text-sm text-foreground">{selecionado.email || "—"}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Cidade / Bairro</dt>
                <dd className="mt-1.5 text-sm text-foreground">
                  {selecionado.cidade}
                  {selecionado.bairro ? ` · ${selecionado.bairro}` : ""}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Prazo desejado</dt>
                <dd className="mt-1.5 text-sm text-foreground">{selecionado.prazo || "—"}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Medidas</dt>
                <dd className="mt-1.5 text-sm text-foreground">{selecionado.medidas || "—"}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Prefere contato por</dt>
                <dd className="mt-1.5 text-sm text-foreground">{selecionado.preferencia_contato}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="eyebrow text-muted-foreground">Descrição do projeto</dt>
                <dd className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {selecionado.descricao}
                </dd>
              </div>
            </dl>

            {fotosUrls.length > 0 && (
              <div className="mt-8">
                <p className="eyebrow text-muted-foreground">Fotos enviadas</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {fotosUrls.map((u, i) => (
                    <a key={u} href={u} target="_blank" rel="noreferrer">
                      <img
                        src={u}
                        alt={`Foto ${i + 1} enviada pelo cliente`}
                        className="aspect-square w-full border border-border object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-8">
              {ACOES.map((a) => (
                <button
                  key={a.status}
                  onClick={() => mudarStatus(a.status)}
                  disabled={updating || selecionado.status === a.status}
                  className="eyebrow border border-border px-4 py-3 text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {a.label}
                </button>
              ))}
              <a
                href={waLink(selecionado.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="eyebrow inline-flex items-center gap-2 bg-primary px-4 py-3 text-primary-foreground transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                Abrir WhatsApp do cliente
              </a>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-navy text-navy-muted">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <YamaLogo className="h-8 w-auto" />
          <p className="text-xs">© {new Date().getFullYear()} YAMA Vidros e Alumínio · Duartina - SP</p>
        </div>
      </footer>
    </div>
  );
}
