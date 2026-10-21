import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, MapPin, Phone, Mail, Instagram } from "lucide-react";
import logo from "@/assets/yama-logo.jpg.asset.json";
import hero from "@/assets/hero.jpg";
import box from "@/assets/box.jpg";

const WA = "https://wa.me/5514996313014";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YAMA Vidros e Alumínio — Vidros e esquadrias sob medida" },
      {
        name: "description",
        content:
          "Há mais de 18 anos produzindo e instalando vidros e esquadrias de alumínio sob medida em Duartina - SP. Solicite seu orçamento.",
      },
      { property: "og:title", content: "YAMA Vidros e Alumínio" },
      {
        property: "og:description",
        content: "Vidros e esquadrias de alumínio sob medida, com mais de 18 anos de experiência.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = [
  ["Início", "#inicio"],
  ["Quem Somos", "#quem-somos"],
  ["Serviços", "#servicos"],
  ["Soluções", "#solucoes"],
  ["Diferenciais", "#diferenciais"],
  ["Contato", "#contato"],
];

const servicos = [
  "Box para Banheiro",
  "Fechamento de Sacadas",
  "Portas e Janelas de Vidro",
  "Portões em Esquadrias de Alumínio",
  "Manutenção e Troca de Vidros",
  "Venezianas Automatizadas",
  "Coberturas de Vidro",
  "Espelhos sob Medida",
  "Portinholas de Gás",
  "Guarda-corpos",
  "Muro de Vidro",
  "Pele de Vidro",
];

const solucoes = [
  {
    t: "Box para Banheiro",
    d: "Fabricamos box sob medida, ideal para valorizar seu espaço com acabamento moderno e personalizado. Portas na medida do seu projeto.",
  },
  {
    t: "Portas de Lambril sob Medida",
    d: "Design moderno, resistente e elegante. Ideal para qualquer ambiente, com ótimo acabamento e segurança.",
  },
  {
    t: "Esquadrias de Alumínio",
    d: "Alta durabilidade, resistência à corrosão e facilidade de manutenção. Molduras finas que maximizam a entrada de luz natural.",
  },
];

const diferenciais = [
  ["Atendimento", "Rápido e eficiente, do primeiro contato à entrega."],
  ["Materiais", "Qualidade comprovada em vidros e perfis de alumínio."],
  ["Acabamento", "Excelência em cada detalhe do projeto."],
  ["Instalação", "Profissionalismo e cuidado em cada obra."],
];

function Index() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-navy text-navy-foreground">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <a href="#inicio" aria-label="YAMA Vidros e Alumínio">
            <img src={logo.url} alt="YAMA Vidros e Alumínio" className="h-16 w-16 object-contain" />
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map(([l, h]) => (
              <a key={h} href={h} className="text-sm text-navy-muted transition-colors hover:text-navy-foreground">
                {l}
              </a>
            ))}
          </nav>
          <a
            href={WA}
            target="_blank"
            rel="noreferrer"
            className="eyebrow hidden border border-navy-foreground/40 px-5 py-3 transition-colors hover:bg-navy-foreground hover:text-navy lg:inline-block"
          >
            Solicitar orçamento
          </a>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-navy-foreground/10 px-6 pb-6 lg:hidden">
            {nav.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)} className="block py-3 text-sm text-navy-muted">
                {l}
              </a>
            ))}
            <a href={WA} target="_blank" rel="noreferrer" className="eyebrow mt-3 inline-block border border-navy-foreground/40 px-5 py-3">
              Solicitar orçamento
            </a>
          </nav>
        )}
      </header>

      {/* Início */}
      <section id="inicio" className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:min-h-[70vh] lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <p className="eyebrow text-muted-foreground">Há mais de 18 anos no mercado</p>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-primary md:text-5xl">
            Vidros e esquadrias de alumínio sob medida.
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            Qualidade, segurança e sofisticação para ambientes elegantes, funcionais e iluminados.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a href={WA} target="_blank" rel="noreferrer" className="eyebrow bg-primary px-6 py-4 text-primary-foreground transition-opacity hover:opacity-90">
              Solicitar orçamento
            </a>
            <a href="#servicos" className="eyebrow border-b border-primary/30 pb-1 text-primary">
              Ver serviços
            </a>
          </div>
        </div>
        <div className="lg:col-span-7">
          <img src={hero} alt="Ambiente com portas de vidro e esquadrias de alumínio" width={1280} height={960} className="aspect-[4/3] w-full object-cover" />
        </div>
      </section>

      {/* Quem somos */}
      <section id="quem-somos" className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-muted-foreground">Quem somos</p>
            <p className="mt-8 font-serif text-7xl text-primary">18+</p>
            <p className="mt-2 text-sm text-muted-foreground">anos no mercado</p>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-foreground/80 lg:col-span-8">
            <p className="font-serif text-3xl leading-snug text-primary">
              Nascemos com o propósito de oferecer qualidade, segurança e sofisticação em vidros e esquadrias de alumínio.
            </p>
            <p>
              Desde o início, a empresa se destacou pelo compromisso com o cliente, prezando sempre pelo bom atendimento e pela entrega de serviços com excelência.
            </p>
            <p>Há mais de 18 anos no mercado, somos especialistas na produção e instalação de vidros e esquadrias de alumínio.</p>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow text-muted-foreground">Nossos serviços</p>
          <h2 className="mt-4 font-serif text-4xl text-primary">Soluções completas em vidro e alumínio</h2>
          <ul className="mt-14 grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {servicos.map((s, i) => (
              <li key={s} className="flex items-baseline gap-5 border-b border-border py-6 pr-6">
                <span className="text-xs tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-foreground">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Soluções */}
      <section id="solucoes" className="mx-auto grid max-w-6xl gap-16 px-6 py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <img src={box} alt="Box de vidro sob medida" width={1024} height={1280} loading="lazy" className="aspect-[4/5] w-full object-cover" />
        </div>
        <div className="lg:col-span-7">
          <p className="eyebrow text-muted-foreground">Destaques sob medida</p>
          <h2 className="mt-4 font-serif text-4xl text-primary">Em busca da combinação perfeita</h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            A escolha ideal entre vidros e esquadrias depende do objetivo do projeto — estética moderna, conforto térmico ou privacidade.
          </p>
          <div className="mt-12 divide-y divide-border border-y border-border">
            {solucoes.map((s) => (
              <div key={s.t} className="py-8">
                <h3 className="font-serif text-2xl text-primary">{s.t}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section id="diferenciais" className="bg-navy text-navy-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow text-navy-muted">Diferenciais</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl">O que nossos clientes destacam</h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {diferenciais.map(([t, d]) => (
              <div key={t} className="border-t border-navy-foreground/20 pt-6">
                <h3 className="font-serif text-2xl">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-muted">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-16 max-w-2xl text-sm leading-relaxed text-navy-muted">
            Essas opiniões reforçam nosso compromisso em entregar sempre o melhor em vidros e esquadrias de alumínio. Obrigado a todos os clientes pela confiança.
          </p>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-muted-foreground">Contato</p>
          <h2 className="mt-4 font-serif text-4xl text-primary">Vamos conversar sobre o seu projeto</h2>
          <p className="mt-6 text-muted-foreground">Responsável: Lucas Yamada</p>
          <a href={WA} target="_blank" rel="noreferrer" className="eyebrow mt-10 inline-block bg-primary px-6 py-4 text-primary-foreground hover:opacity-90">
            Falar no WhatsApp
          </a>
        </div>
        <ul className="divide-y divide-border border-y border-border text-foreground/80">
          <li className="flex gap-4 py-5"><Phone className="mt-0.5 h-4 w-4 text-primary" /><span><a href={WA} target="_blank" rel="noreferrer">(14) 99631-3014</a> · <a href="https://wa.me/5514988036113" target="_blank" rel="noreferrer">(14) 98803-6113</a></span></li>
          <li className="flex gap-4 py-5"><Mail className="mt-0.5 h-4 w-4 text-primary" /><a href="mailto:yamavidros_duartina@hotmal.com">yamavidros_duartina@hotmal.com</a></li>
          <li className="flex gap-4 py-5"><Instagram className="mt-0.5 h-4 w-4 text-primary" /><a href="https://instagram.com/yamavidros" target="_blank" rel="noreferrer">@yamavidros</a></li>
          <li className="flex gap-4 py-5"><MapPin className="mt-0.5 h-4 w-4 text-primary" /><span>Rua Henrique Hortelã, 06 — Duartina - SP · CEP 17470-060</span></li>
        </ul>
      </section>

      <footer className="bg-navy text-navy-muted">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <img src={logo.url} alt="YAMA Vidros e Alumínio" className="h-14 w-14 object-contain" />
          <p className="text-xs">© {new Date().getFullYear()} YAMA Vidros e Alumínio · Duartina - SP</p>
        </div>
      </footer>
    </div>
  );
}
