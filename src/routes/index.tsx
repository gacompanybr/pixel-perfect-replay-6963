import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, MapPin, Phone, Mail, Instagram, MessageCircle, Globe, ArrowUpRight } from "lucide-react";
import { YamaLogo } from "@/components/yama-logo";
import hero from "@/assets/hero.jpg";
import box from "@/assets/box.jpg";
import quemSomos from "@/assets/quem-somos.webp";
import sacada from "@/assets/sacada.webp";
import portasJanelas from "@/assets/portas-janelas.webp";
import portao from "@/assets/portao.webp";
import manutencao from "@/assets/manutencao.webp";
import veneziana from "@/assets/veneziana.webp";
import cobertura from "@/assets/cobertura.webp";
import espelho from "@/assets/espelho.webp";
import portinhola from "@/assets/portinhola.webp";
import guardaCorpo from "@/assets/guarda-corpo.webp";
import muroVidro from "@/assets/muro-vidro.webp";
import peleVidro from "@/assets/pele-vidro.webp";
import lambril from "@/assets/lambril.webp";

const WA = "https://wa.me/5514996313014?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YAMA Vidros e Alumínio — Vidros e esquadrias sob medida em Duartina - SP" },
      {
        name: "description",
        content:
          "Há mais de 18 anos produzindo e instalando vidros e esquadrias de alumínio sob medida: box, sacadas, portas, janelas, portões, coberturas, espelhos, guarda-corpos e fachadas. Solicite seu orçamento.",
      },
      { property: "og:title", content: "YAMA Vidros e Alumínio — Vidros e esquadrias sob medida" },
      {
        property: "og:description",
        content:
          "Soluções completas em vidro e alumínio há mais de 18 anos em Duartina - SP. Box, esquadrias, coberturas, espelhos e muito mais.",
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
  ["Inspirações", "#inspiracoes"],
  ["Contato", "#contato"],
];

const servicos = [
  {
    img: box,
    t: "Box para Banheiro",
    d: "Soluções sob medida para transformar o banheiro com mais elegância, segurança e praticidade.",
    extra:
      "Fabricamos boxes sob medida para valorizar cada espaço, com acabamento moderno e personalizado. As portas são desenvolvidas de acordo com as medidas e características de cada projeto.",
    uso: "Banheiros residenciais e comerciais",
    cta: "Orçar meu box",
  },
  {
    img: sacada,
    t: "Fechamento de Sacadas",
    d: "Mais proteção e aproveitamento do ambiente sem abrir mão da estética.",
    extra:
      "Uma solução para projetos que buscam integração visual, valorização do espaço e proteção, mantendo a leveza e a iluminação do ambiente.",
    uso: "Apartamentos e varandas",
    cta: "Solicitar orçamento",
  },
  {
    img: portasJanelas,
    t: "Portas e Janelas de Vidro",
    d: "Soluções em vidro que valorizam a iluminação natural e a estética dos ambientes.",
    extra:
      "Portas e janelas pensadas para projetos modernos, buscando equilíbrio entre funcionalidade e estética em cada abertura.",
    uso: "Salas, cozinhas e áreas de convívio",
    cta: "Falar com a YAMA",
  },
  {
    img: portao,
    t: "Portões em Esquadrias de Alumínio",
    d: "Portões sob medida que combinam resistência, funcionalidade e acabamento moderno.",
    extra:
      "Produzidos de acordo com o projeto de cada residência, unindo durabilidade e uma estética que valoriza a fachada.",
    uso: "Entradas de residências e garagens",
    cta: "Solicitar orçamento",
  },
  {
    img: manutencao,
    t: "Manutenção e Troca de Vidros",
    d: "Serviços para substituir ou renovar vidros, mantendo o ambiente funcional e com bom acabamento.",
    extra:
      "Atendimento para troca e manutenção de vidros em esquadrias, boxes e demais aplicações, com cuidado em cada detalhe.",
    uso: "Reparos e renovações",
    cta: "Solicitar atendimento",
  },
  {
    img: veneziana,
    t: "Venezianas Automatizadas",
    d: "Praticidade e funcionalidade para projetos que buscam mais controle e conforto no ambiente.",
    extra:
      "Uma solução que alia controle de luz e ventilação à praticidade da automação, com acabamento discreto e elegante.",
    uso: "Quartos, salas e áreas íntimas",
    cta: "Falar com a YAMA",
  },
  {
    img: cobertura,
    t: "Coberturas de Vidro",
    d: "Soluções que aproveitam a iluminação natural e agregam sofisticação aos ambientes.",
    extra:
      "Coberturas que protegem áreas externas sem abrir mão da luz natural, com estrutura em alumínio e visual contemporâneo.",
    uso: "Áreas gourmet, garagens e jardins",
    cta: "Orçar projeto",
  },
  {
    img: espelho,
    t: "Espelhos sob Medida",
    d: "Espelhos produzidos sob medida para valorizar diferentes ambientes e composições.",
    extra:
      "Do banheiro ao hall, do quarto ao ambiente comercial: cada espelho é produzido na medida ideal para o seu espaço.",
    uso: "Banheiros, halls, quartos e comércios",
    cta: "Solicitar orçamento",
  },
  {
    img: portinhola,
    t: "Portinholas de Gás",
    d: "Soluções funcionais em vidro e alumínio para atender às necessidades específicas do ambiente.",
    extra:
      "Portinholas produzidas sob medida, com acabamento discreto que se integra à cozinha ou à área de serviço.",
    uso: "Cozinhas e áreas de serviço",
    cta: "Falar com a YAMA",
  },
  {
    img: guardaCorpo,
    t: "Guarda-corpos",
    d: "Segurança e elegância em uma solução que valoriza escadas, varandas e diferentes áreas do projeto.",
    extra:
      "Guarda-corpos de vidro que protegem sem pesar o visual, mantendo a transparência e a leveza da arquitetura.",
    uso: "Escadas, varandas e mezaninos",
    cta: "Solicitar orçamento",
  },
  {
    img: muroVidro,
    t: "Muro de Vidro",
    d: "Uma solução contemporânea para delimitar espaços mantendo leveza visual, iluminação e sofisticação.",
    extra:
      "O muro de vidro valoriza a fachada e o jardim, delimitando o terreno sem criar barreiras visuais.",
    uso: "Fachadas e jardins residenciais",
    cta: "Orçar meu projeto",
  },
  {
    img: peleVidro,
    t: "Pele de Vidro",
    d: "Solução arquitetônica que valoriza fachadas com uma estética contemporânea e grande presença visual.",
    extra:
      "Fachadas em pele de vidro para projetos comerciais e arquitetônicos que buscam uma identidade moderna e marcante.",
    uso: "Fachadas comerciais e corporativas",
    cta: "Falar com a YAMA",
  },
];

const categorias = [
  { t: "Banheiro", itens: "Box + Espelhos", img: box },
  { t: "Área Externa", itens: "Coberturas + Fechamento de Sacadas + Guarda-corpos", img: cobertura },
  { t: "Fachadas", itens: "Pele de Vidro + Esquadrias", img: peleVidro },
  { t: "Residencial", itens: "Portas + Janelas + Venezianas", img: portasJanelas },
  { t: "Segurança", itens: "Guarda-corpos + Muros de Vidro", img: guardaCorpo },
];

const galeria = [
  { img: box, alt: "Box de vidro sob medida em banheiro contemporâneo" },
  { img: sacada, alt: "Sacada envidraçada em apartamento moderno" },
  { img: portasJanelas, alt: "Portas de vidro com esquadrias de alumínio" },
  { img: portao, alt: "Portão de alumínio em residência contemporânea" },
  { img: cobertura, alt: "Cobertura de vidro em área externa" },
  { img: guardaCorpo, alt: "Guarda-corpo de vidro em escada" },
  { img: espelho, alt: "Espelho sob medida em banheiro sofisticado" },
  { img: muroVidro, alt: "Muro de vidro em fachada residencial" },
  { img: peleVidro, alt: "Fachada em pele de vidro" },
  { img: veneziana, alt: "Veneziana de alumínio em janela moderna" },
  { img: lambril, alt: "Porta de lambril sob medida" },
  { img: quemSomos, alt: "Detalhe de esquadria de alumínio e vidro" },
];

const diferenciais = [
  ["Experiência", "Há mais de 18 anos no mercado, desenvolvendo e instalando soluções em vidros e esquadrias de alumínio."],
  ["Atendimento", "Compromisso com um atendimento rápido, próximo e eficiente."],
  ["Qualidade", "Atenção à qualidade dos materiais utilizados em cada projeto."],
  ["Acabamento", "Cuidado com cada detalhe para entregar um resultado elegante e bem executado."],
  ["Instalação", "Profissionalismo e cuidado na execução dos serviços."],
];

const etapas = [
  ["Você entra em contato", "Conte à YAMA o que você precisa."],
  ["Entendemos seu projeto", "A equipe identifica a melhor solução para sua necessidade."],
  ["Orçamento", "Você recebe uma proposta de acordo com o seu projeto."],
  ["Instalação", "Após a aprovação, o serviço é realizado com cuidado e profissionalismo."],
];

const avaliacoes = [
  "Atendimento rápido e eficiente",
  "Qualidade nos materiais",
  "Excelente acabamento",
  "Profissionalismo na instalação",
];

function WaCta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <a href={WA} target="_blank" rel="noreferrer" className={`eyebrow inline-block transition-opacity hover:opacity-80 ${className}`}>
      {children}
    </a>
  );
}

function Index() {
  const [open, setOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-navy text-navy-foreground">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-24">
          <a href="#inicio" aria-label="YAMA Vidros e Alumínio">
            <YamaLogo className="h-11 w-auto md:h-14" />




          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map(([l, h]) => (
              <a key={h} href={h} className="text-sm text-navy-muted transition-colors hover:text-navy-foreground">
                {l}
              </a>
            ))}
          </nav>
          <WaCta className="hidden border border-navy-foreground/40 px-5 py-3 hover:bg-navy-foreground hover:text-navy lg:inline-block">
            Solicitar orçamento
          </WaCta>
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
            <WaCta className="mt-3 border border-navy-foreground/40 px-5 py-3">Solicitar orçamento</WaCta>
          </nav>
        )}
      </header>

      {/* Início */}
      <section id="inicio" className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:min-h-[70vh] lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <p className="eyebrow inline-block border border-primary/30 px-4 py-2 text-primary">+18 anos de experiência</p>
          <h1 className="mt-8 font-serif text-4xl leading-tight text-primary md:text-5xl">
            Vidros e esquadrias de alumínio sob medida.
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            Há mais de 18 anos, transformando projetos com qualidade, segurança, sofisticação e excelente acabamento.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <WaCta className="bg-primary px-6 py-4 text-primary-foreground">Solicitar orçamento</WaCta>
            <a href="#servicos" className="eyebrow border-b border-primary/30 pb-1 text-primary">
              Conhecer nossos serviços
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
            <p className="mt-2 text-sm text-muted-foreground">anos de mercado</p>
            <img
              src={quemSomos}
              alt="Ambiente moderno com painéis de vidro e esquadrias de alumínio"
              width={1600}
              height={1200}
              loading="lazy"
              className="mt-10 aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-foreground/80 lg:col-span-8">
            <h2 className="font-serif text-3xl leading-snug text-primary md:text-4xl">
              Experiência que faz a diferença em cada projeto.
            </h2>
            <p>
              A YAMA Vidros e Alumínio nasceu com o propósito de oferecer qualidade, segurança e sofisticação em soluções
              de vidros e esquadrias de alumínio.
            </p>
            <p>
              Desde o início, a empresa se destaca pelo compromisso com seus clientes, prezando pelo bom atendimento e
              pela entrega de serviços com excelência.
            </p>
            <p>
              Há mais de 18 anos no mercado, a YAMA é especializada na produção e instalação de vidros e esquadrias de
              alumínio, atendendo projetos residenciais e comerciais em Duartina e região.
            </p>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow text-muted-foreground">Nossos serviços</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl text-primary">
            Soluções em vidro e alumínio desenvolvidas para diferentes ambientes, necessidades e projetos.
          </h2>
          <div className="mt-16 grid gap-x-12 gap-y-20 md:grid-cols-2">
            {servicos.map((s, i) => (
              <article key={s.t}>
                <img
                  src={s.img}
                  alt={s.t}
                  width={1600}
                  height={1067}
                  loading="lazy"
                  className="aspect-[3/2] w-full object-cover"
                />
                <div className="mt-6 flex items-baseline gap-4">
                  <span className="text-xs tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-serif text-2xl text-primary">{s.t}</h3>
                </div>
                <p className="mt-3 font-medium leading-relaxed text-foreground">{s.d}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.extra}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{s.uso}</p>
                <WaCta className="mt-5 border-b border-primary/30 pb-1 text-primary">
                  <span className="inline-flex items-center gap-1">
                    {s.cta}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </WaCta>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Destaque — Box */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <img src={box} alt="Banheiro contemporâneo com box de vidro sob medida" width={1024} height={1280} loading="lazy" className="aspect-[4/5] w-full object-cover" />
        </div>
        <div className="lg:col-span-6">
          <p className="eyebrow text-muted-foreground">Box para banheiro</p>
          <h2 className="mt-4 font-serif text-4xl text-primary">Seu banheiro com mais elegância e personalidade.</h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Transforme seu banheiro com um box desenvolvido sob medida para o seu espaço. Na YAMA, cada projeto é
            pensado para unir praticidade, segurança e acabamento moderno.
          </p>
          <WaCta className="mt-10 bg-primary px-6 py-4 text-primary-foreground">Quero orçar meu box</WaCta>
        </div>
      </section>

      {/* Destaque — Lambril */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-12">
          <div className="order-last lg:order-first lg:col-span-6">
            <p className="eyebrow text-muted-foreground">Sob medida</p>
            <h2 className="mt-4 font-serif text-4xl text-primary">Portas de Lambril Sob Medida</h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Design moderno, resistente e elegante para diferentes ambientes. As portas de lambril sob medida são uma
              solução que combina personalidade, segurança e excelente acabamento.
            </p>
            <WaCta className="mt-10 bg-primary px-6 py-4 text-primary-foreground">Solicitar orçamento</WaCta>
          </div>
          <div className="lg:col-span-6">
            <img src={lambril} alt="Porta de lambril contemporânea em hall de entrada" width={1600} height={1067} loading="lazy" className="aspect-[3/2] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Destaque — Esquadrias */}
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <img src={manutencao} alt="Detalhe de esquadria de alumínio com vidro" width={1600} height={1067} loading="lazy" className="aspect-[3/2] w-full object-cover" />
          </div>
          <div className="lg:col-span-6">
            <p className="eyebrow text-muted-foreground">Esquadrias de alumínio</p>
            <h2 className="mt-4 font-serif text-4xl text-primary">Esquadrias de alumínio: durabilidade e estética em equilíbrio.</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                As esquadrias de alumínio são amplamente escolhidas pela alta durabilidade, resistência à corrosão e
                facilidade de manutenção.
              </p>
              <p>
                A escolha da combinação ideal entre vidro e esquadria depende do objetivo de cada projeto, seja ele
                focado em estética moderna, conforto térmico ou privacidade.
              </p>
              <p>
                As esquadrias de alumínio são versáteis e permitem molduras finas que maximizam a entrada de luz
                natural.
              </p>
            </div>
            <WaCta className="mt-10 bg-primary px-6 py-4 text-primary-foreground">Solicitar orçamento</WaCta>
          </div>
        </div>
      </section>

      {/* Encontre a solução ideal */}
      <section id="solucoes" className="mx-auto max-w-6xl px-6 py-24">
        <p className="eyebrow text-muted-foreground">Encontre a solução ideal</p>
        <h2 className="mt-4 font-serif text-4xl text-primary">Qual solução combina com o seu projeto?</h2>
        <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {categorias.map((c) => (
            <div key={c.t} className="bg-background">
              <img src={c.img} alt={c.t} width={1600} height={1067} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="p-6">
                <h3 className="eyebrow text-primary">{c.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.itens}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Galeria de inspiração */}
      <section id="inspiracoes" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow text-muted-foreground">Galeria</p>
          <h2 className="mt-4 font-serif text-4xl text-primary">Inspirações para o seu projeto</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Referências visuais das soluções que a YAMA desenvolve sob medida. Toque em uma imagem para ampliar.
          </p>
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {galeria.map((g, i) => (
              <button
                key={g.alt}
                onClick={() => setLightbox(i)}
                className="group overflow-hidden"
                aria-label={`Ampliar: ${g.alt}`}
              >
                <img
                  src={g.img}
                  alt={g.alt}
                  width={1600}
                  height={1067}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section id="diferenciais" className="bg-navy text-navy-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow text-navy-muted">Diferenciais</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl">Por que escolher a YAMA?</h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {diferenciais.map(([t, d]) => (
              <div key={t} className="border-t border-navy-foreground/20 pt-6">
                <h3 className="font-serif text-2xl">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processo de atendimento */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="eyebrow text-muted-foreground">Como funciona</p>
        <h2 className="mt-4 font-serif text-4xl text-primary">Do primeiro contato à instalação.</h2>
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {etapas.map(([t, d], i) => (
            <li key={t} className="border-t border-border pt-6">
              <span className="text-xs tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-serif text-2xl text-primary">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
        <WaCta className="mt-14 bg-primary px-6 py-4 text-primary-foreground">Orçar meu projeto</WaCta>
      </section>

      {/* O que os clientes valorizam */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow text-muted-foreground">Reconhecimento</p>
          <h2 className="mt-4 font-serif text-4xl text-primary">O que nossos clientes valorizam</h2>
          <ul className="mt-14 grid border-t border-border sm:grid-cols-2">
            {avaliacoes.map((a) => (
              <li key={a} className="border-b border-border py-6 pr-6 font-serif text-2xl text-primary">
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Essas opiniões reforçam nosso compromisso em entregar sempre o melhor em vidros e esquadrias de alumínio.
            Obrigado a todos os clientes pela confiança.
          </p>
        </div>
      </section>

      {/* Não encontrou o que procura? — Fale conosco */}
      <section className="bg-navy text-navy-foreground">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="eyebrow text-navy-muted">Fale conosco</p>
          <h2 className="mt-4 font-serif text-4xl">Não encontrou o que procura?</h2>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-navy-muted">
            Trabalhamos com soluções sob medida em vidro e alumínio. Conte para nós o que o seu projeto precisa — a YAMA desenvolve a solução ideal para você.
          </p>
          <WaCta className="mt-10 bg-navy-foreground px-8 py-4 text-navy">Fale conosco pelo WhatsApp</WaCta>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-muted-foreground">Contato</p>
            <h2 className="mt-4 font-serif text-4xl text-primary">Vamos conversar sobre seu projeto?</h2>
            <p className="mt-6 text-muted-foreground">Responsável: Lucas Yamada</p>
            <WaCta className="mt-10 bg-primary px-6 py-4 text-primary-foreground">Solicitar orçamento pelo WhatsApp</WaCta>
            <div className="mt-12">
              <p className="eyebrow text-muted-foreground">Localização</p>
              <p className="mt-3 text-sm text-foreground/80">Duartina — São Paulo · Rua Henrique Hortelã, 06</p>
              <iframe
                title="Localização da YAMA Vidros e Alumínio em Duartina - SP"
                src="https://www.google.com/maps?q=Rua%20Henrique%20Hortel%C3%A3%2C%206%2C%20Duartina%20-%20SP&output=embed"
                loading="lazy"
                className="mt-4 aspect-[16/9] w-full border border-border"
              />
            </div>
          </div>
          <ul className="divide-y divide-border self-start border-y border-border text-foreground/80">
            <li className="flex gap-4 py-5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <a href={WA} target="_blank" rel="noreferrer">(14) 99631-3014</a>
                {" · "}
                <a href="https://wa.me/5514988036113" target="_blank" rel="noreferrer">(14) 98803-6113</a>
              </span>
            </li>
            <li className="flex gap-4 py-5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href="mailto:yamavidros_duartina@hotmal.com">yamavidros_duartina@hotmal.com</a>
            </li>
            <li className="flex gap-4 py-5">
              <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href="https://instagram.com/yamavidros" target="_blank" rel="noreferrer">@yamavidros</a>
            </li>
            <li className="flex gap-4 py-5">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href="https://www.yamavidros.com" target="_blank" rel="noreferrer">www.yamavidros.com</a>
            </li>
            <li className="flex gap-4 py-5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Rua Henrique Hortelã, 06 — Duartina - SP
                <br />
                CEP 17470-060
              </span>
            </li>
          </ul>
        </div>
      </section>

      <footer className="bg-navy text-navy-muted">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <YamaLogo className="h-10 w-auto" />
          <p className="text-xs">© {new Date().getFullYear()} YAMA Vidros e Alumínio · Duartina - SP</p>
        </div>
      </footer>

      {/* WhatsApp flutuante */}
      <a
        href={WA}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar pelo WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      {/* Lightbox */}
      {lightbox !== null && galeria[lightbox] && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/90 p-6"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={galeria[lightbox].alt}
        >
          <button className="absolute right-6 top-6 text-navy-foreground" onClick={() => setLightbox(null)} aria-label="Fechar">
            <X className="h-8 w-8" />
          </button>
          <img
            src={galeria[lightbox].img}
            alt={galeria[lightbox].alt}
            className="max-h-[85vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
