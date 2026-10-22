import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { YamaLogo } from "@/components/yama-logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir senha — YAMA Vidros e Alumínio" },
      { name: "description", content: "Defina uma nova senha para acessar o painel administrativo da YAMA." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // O link de recuperação chega com type=recovery no hash da URL.
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
      return;
    }
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    const timer = window.setTimeout(() => setInvalid(true), 4000);
    return () => {
      sub.subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError("Não foi possível salvar a nova senha. Abra novamente o link enviado por e-mail.");
      return;
    }
    setDone(true);
    window.setTimeout(() => navigate({ to: "/admin" }), 2500);
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
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm text-navy-muted transition-colors hover:text-navy-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-24">
        <p className="eyebrow text-muted-foreground">Área restrita</p>
        <h1 className="mt-4 font-serif text-4xl text-primary">Redefinir senha</h1>

        {!ready && !invalid && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {invalid && !ready && (
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Este link de recuperação é inválido ou já expirou. Volte para o login e solicite um novo link em
            &quot;Esqueceu sua senha?&quot;.
          </p>
        )}

        {ready && !done && (
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Nova senha</label>
              <input
                className={inputCls}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                autoComplete="new-password"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Confirmar nova senha</label>
              <input
                className={inputCls}
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repita a nova senha"
                autoComplete="new-password"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="eyebrow flex w-full items-center justify-center gap-3 bg-primary px-8 py-4 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar nova senha
            </button>
          </form>
        )}

        {done && (
          <p className="mt-6 text-sm leading-relaxed text-primary">
            Senha redefinida com sucesso! Você será levado de volta para o login em instantes.
          </p>
        )}
      </main>
    </div>
  );
}
