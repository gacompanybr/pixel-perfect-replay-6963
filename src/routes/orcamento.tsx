import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, ImagePlus, Loader2, MessageCircle, X } from "lucide-react";
import { YamaLogo } from "@/components/yama-logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/orcamento")({
  head: () => ({
    meta: [
      { title: "Solicite seu orçamento — YAMA Vidros e Alumínio" },
      {
        name: "description",
        content:
          "Conte um pouco sobre o seu projeto e solicite seu orçamento de vidros e esquadrias de alumínio sob medida com a YAMA. É rápido, gratuito e sem compromisso.",
      },
      { property: "og:title", content: "Solicite seu orçamento — YAMA Vidros e Alumínio" },
      {
        property: "og:description",
        content: "Conte um pouco sobre o seu projeto. Nossa equipe analisará as informações e entrará em contato.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrcamentoPage,
});

const WA = "https://wa.me/5514996313014?text=Ol%C3%A1!%20Acabei%20de%20solicitar%20um%20or%C3%A7amento%20pelo%20site.";

const SERVICOS = [
  "Box para Banheiro",
  "Fechamento de Sacadas",
  "Portas e Janelas de Vidro",
  "Portões em Esquadrias de Alumínio",
  "Manutenção e Troca de Vidros",
  "Venezianas Automatizadas",
  "Coberturas de Vidro",
  "Espelhos Sob Medida",
  "Portinholas de Gás",
  "Guarda-corpos",
  "Muro de Vidro",
  "Pele de Vidro",
  "Outro",
  "Não tenho certeza / Preciso de orientação",
];

const PRAZOS = ["O quanto antes", "Nas próximas semanas", "Nos próximos meses", "Ainda estou pesquisando"];
const CONTATOS = ["WhatsApp", "Ligação", "E-mail"];

type FormErrors = Partial<
  Record<"nome" | "whatsapp" | "email" | "cidade" | "servico" | "descricao" | "fotos", string>
>;

const MAX_FOTOS = 5;
const MAX_BYTES = 5 * 1024 * 1024;
const TIPOS = ["image/jpeg", "image/png", "image/webp"];

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const inputCls =
  "w-full border border-input bg-background px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary";
const labelCls = "mb-2 block text-sm font-medium text-foreground";
const errCls = "mt-1.5 text-xs text-destructive";

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
      {error && <p className={errCls}>{error}</p>}
    </div>
  );
}

function BlockTitle({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-border pb-4">
      <span className="text-xs tabular-nums text-muted-foreground">{n}</span>
      <h2 className="eyebrow text-primary">{children}</h2>
    </div>
  );
}

function OrcamentoPage() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [servico, setServico] = useState("");
  const [descricao, setDescricao] = useState("");
  const [medidas, setMedidas] = useState("");
  const [prazo, setPrazo] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [preferencia, setPreferencia] = useState("WhatsApp");
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function addFotos(list: FileList | null) {
    if (!list) return;
    const next = [...fotos];
    for (const f of Array.from(list)) {
      if (next.length >= MAX_FOTOS) break;
      if (!TIPOS.includes(f.type)) {
        setErrors((e) => ({ ...e, fotos: "Formato não aceito. Envie JPG, PNG ou WEBP." }));
        continue;
      }
      if (f.size > MAX_BYTES) {
        setErrors((e) => ({ ...e, fotos: "Cada foto pode ter no máximo 5 MB." }));
        continue;
      }
      next.push(f);
    }
    setFotos(next);
    if (next.length) setErrors((e) => ({ ...e, fotos: "" }));
    if (fileRef.current) fileRef.current.value = "";
  }

  function validate() {
    const e: FormErrors = {};
    if (!nome.trim()) e.nome = "Informe seu nome completo.";
    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length < 10) e.whatsapp = "Informe um WhatsApp válido com DDD.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Informe um e-mail válido.";
    if (!cidade.trim()) e.cidade = "Informe sua cidade.";
    if (!servico) e.servico = "Selecione o serviço que você procura.";
    if (!descricao.trim()) e.descricao = "Conte um pouco sobre o que você precisa.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (sending) return;
    setSubmitError("");
    if (!validate()) {
      document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSending(true);
    try {
      const paths: string[] = [];
      for (const f of fotos) {
        const ext = f.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("orcamento-fotos").upload(path, f, { contentType: f.type });
        if (error) throw new Error("Não foi possível enviar uma das fotos. Tente novamente.");
        paths.push(path);
      }
      const { error } = await supabase.from("orcamentos").insert({
        nome: nome.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim() || null,
        cidade: cidade.trim(),
        bairro: bairro.trim() || null,
        servico,
        descricao: descricao.trim(),
        medidas: medidas.trim() || null,
        prazo: prazo || null,
        preferencia_contato: preferencia,
        fotos: paths,
      });
      if (error) throw new Error("Não foi possível enviar sua solicitação. Tente novamente.");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Algo deu errado. Tente novamente.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-navy text-navy-foreground">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-24">
          <Link to="/" aria-label="YAMA Vidros e Alumínio">
            <YamaLogo className="h-11 w-auto md:h-14" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-navy-muted transition-colors hover:text-navy-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o site
          </Link>
        </div>
      </header>

      {done ? (
        <main className="mx-auto max-w-2xl px-6 py-24 text-center md:py-32">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" strokeWidth={1.5} />
          <h1 className="mt-8 font-serif text-4xl text-primary">Orçamento solicitado com sucesso!</h1>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-muted-foreground">
            Recebemos suas informações. Nossa equipe entrará em contato em breve para entender melhor o seu projeto e
            preparar seu orçamento.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={WA}
              target="_blank"
              rel="noreferrer"
              className="eyebrow inline-flex items-center gap-2 bg-primary px-8 py-4 text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              Falar pelo WhatsApp
            </a>
            <Link
              to="/"
              className="eyebrow border border-border px-8 py-4 text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Voltar para o site
            </Link>
          </div>
        </main>
      ) : (
        <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <p className="eyebrow text-muted-foreground">Orçamento</p>
          <h1 className="mt-4 font-serif text-4xl text-primary md:text-5xl">Solicite seu orçamento</h1>
          <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
            Conte um pouco sobre o seu projeto. Nossa equipe analisará as informações e entrará em contato para
            entender todos os detalhes.
          </p>
          <p className="mt-3 text-sm font-medium text-primary">É rápido, gratuito e sem compromisso.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-16 space-y-16">
            {/* 1. Seus dados */}
            <section className="space-y-6">
              <BlockTitle n="01">Seus dados</BlockTitle>
              <div className="grid gap-6 sm:grid-cols-2">
                <div data-error={errors.nome ? true : undefined}>
                  <Field label="Nome completo" required error={errors.nome}>
                    <input
                      className={inputCls}
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Digite seu nome"
                      autoComplete="name"
                      maxLength={100}
                    />
                  </Field>
                </div>
                <div data-error={errors.whatsapp ? true : undefined}>
                  <Field label="WhatsApp" required error={errors.whatsapp}>
                    <input
                      className={inputCls}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(maskPhone(e.target.value))}
                      placeholder="(14) 99999-9999"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </Field>
                </div>
                <div data-error={errors.email ? true : undefined}>
                  <Field label="E-mail" error={errors.email}>
                    <input
                      className={inputCls}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@email.com"
                      autoComplete="email"
                      inputMode="email"
                      maxLength={255}
                    />
                  </Field>
                </div>
                <div data-error={errors.cidade ? true : undefined}>
                  <Field label="Cidade" required error={errors.cidade}>
                    <input
                      className={inputCls}
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      placeholder="Digite sua cidade"
                      autoComplete="address-level2"
                      maxLength={100}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Bairro">
                    <input
                      className={inputCls}
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      placeholder="Digite seu bairro"
                      maxLength={100}
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* 2. Sobre o projeto */}
            <section className="space-y-6" data-error={errors.servico ? true : undefined}>
              <BlockTitle n="02">Sobre o projeto</BlockTitle>
              <Field label="Qual serviço você procura?" required error={errors.servico}>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SERVICOS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setServico(s)}
                      aria-pressed={servico === s}
                      className={`border px-3 py-3.5 text-left text-sm leading-snug transition-colors ${
                        servico === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
            </section>

            {/* 3. Detalhes */}
            <section className="space-y-6">
              <BlockTitle n="03">Detalhes do projeto</BlockTitle>
              <div data-error={errors.descricao ? true : undefined}>
                <Field label="Conte um pouco sobre o que você precisa" required error={errors.descricao}>
                  <textarea
                    className={`${inputCls} min-h-36 resize-y`}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva seu projeto, medidas aproximadas, quantidade de peças, local da instalação ou qualquer outra informação que possa nos ajudar."
                    maxLength={2000}
                  />
                </Field>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Medidas aproximadas">
                  <input
                    className={inputCls}
                    value={medidas}
                    onChange={(e) => setMedidas(e.target.value)}
                    placeholder="Ex.: 2,00m x 1,80m"
                    maxLength={100}
                  />
                </Field>
                <Field label="Quando pretende realizar o projeto?">
                  <div className="grid gap-2">
                    {PRAZOS.map((p) => (
                      <label
                        key={p}
                        className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors ${
                          prazo === p ? "border-primary bg-accent text-primary" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="prazo"
                          className="accent-primary"
                          checked={prazo === p}
                          onChange={() => setPrazo(p)}
                        />
                        {p}
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
            </section>

            {/* 4. Fotos */}
            <section className="space-y-6">
              <BlockTitle n="04">Fotos do local</BlockTitle>
              <div>
                <p className={labelCls}>Possui fotos do local?</p>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Se quiser, envie fotos do ambiente para nos ajudar a entender melhor o projeto. JPG, PNG ou WEBP, até
                  5 MB cada (máximo {MAX_FOTOS} fotos).
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => addFotos(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={fotos.length >= MAX_FOTOS}
                  className="eyebrow inline-flex items-center gap-2 border border-border px-6 py-3.5 text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ImagePlus className="h-4 w-4" />
                  Adicionar fotos
                </button>
                {errors.fotos && <p className={errCls}>{errors.fotos}</p>}
                {fotos.length > 0 && (
                  <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {fotos.map((f, i) => (
                      <li key={`${f.name}-${i}`} className="group relative">
                        <img
                          src={URL.createObjectURL(f)}
                          alt={`Foto ${i + 1} do local`}
                          className="aspect-square w-full border border-border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFotos(fotos.filter((_, j) => j !== i))}
                          aria-label={`Remover foto ${i + 1}`}
                          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy text-navy-foreground opacity-90 transition-opacity hover:opacity-100"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* 5. Preferência de contato */}
            <section className="space-y-6">
              <BlockTitle n="05">Preferência de contato</BlockTitle>
              <Field label="Como prefere receber nosso contato?">
                <div className="grid grid-cols-3 gap-2">
                  {CONTATOS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPreferencia(c)}
                      aria-pressed={preferencia === c}
                      className={`border px-4 py-3.5 text-sm transition-colors ${
                        preferencia === c
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>
            </section>

            {/* Envio */}
            <section className="border-t border-border pt-10">
              {submitError && <p className="mb-4 text-sm text-destructive">{submitError}</p>}
              <button
                type="submit"
                disabled={sending}
                className="eyebrow flex w-full items-center justify-center gap-3 bg-primary px-8 py-5 text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                {sending ? "Enviando..." : "Solicitar orçamento"}
              </button>
              <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                Seus dados serão utilizados apenas para entrarmos em contato sobre o seu projeto.
              </p>
            </section>
          </form>
        </main>
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
