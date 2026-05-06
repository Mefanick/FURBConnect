import { Link } from 'react-router-dom'
import logoFurbConnect from '../assets/Logo furbconnect.png'
import './HomePage.css'

const courses = [
  { id: 'all', label: 'Todos os Cursos', count: 1240 },
  { id: 'cc', label: 'Ciência da Computação', count: 342, active: true },
  { id: 'eng', label: 'Engenharia', count: 218 },
  { id: 'adm', label: 'Administração', count: 156 },
  { id: 'des', label: 'Design', count: 98 },
  { id: 'dir', label: 'Direito', count: 87 },
  { id: 'med', label: 'Medicina', count: 76 },
  { id: 'arq', label: 'Arquitetura', count: 64 },
]

const feedTabs = [
  { id: 'recent', label: 'Recentes', active: true },
  { id: 'popular', label: 'Populares', active: false },
  { id: 'trending', label: 'Em Alta', active: false },
]

const mockPosts = [
  {
    id: 'p1',
    title: 'Sistema de Detecção de Fraudes com Deep Learning',
    description:
      'Pipeline completo com redes neurais para scoring de transações, explicabilidade (XAI) e integração com APIs bancárias simuladas — foco em baixa latência e auditoria.',
    tags: ['IA', 'Deep Learning', 'Segurança', 'Python'],
    author: 'João Santos',
    time: 'há cerca de 2 anos',
    comments: 24,
    score: 87,
  },
  {
    id: 'p2',
    title: 'App de monitoramento de cultivos com visão computacional',
    description:
      'Protótipo mobile para classificação de folhas e alerta de pragas usando modelos leves (MobileNet) e dados coletados no campus.',
    tags: ['Visão computacional', 'Mobile', 'Agro'],
    author: 'Marina Costa',
    time: 'há 3 semanas',
    comments: 11,
    score: 42,
  },
  {
    id: 'p3',
    title: 'Blockchain para rastreabilidade acadêmica de TCCs',
    description:
      'Registro imutável de versões e pareceres em rede permissionada, com foco em transparência e integração com repositório institucional.',
    tags: ['Blockchain', 'Web3', 'TCC'],
    author: 'Pedro Henrique Lima',
    time: 'há 5 dias',
    comments: 8,
    score: 31,
  },
  {
    id: 'p4',
    title: 'Chatbot de suporte ao estudante com LLM local',
    description:
      'Assistente em português com RAG sobre editais e calendário acadêmico; privacidade preservada com inferência on-premise.',
    tags: ['LLM', 'RAG', 'Python'],
    author: 'Ana Beatriz Souza',
    time: 'há 1 dia',
    comments: 19,
    score: 64,
  },
  {
    id: 'p5',
    title: 'Simulador de tráfego urbano para Blumenau',
    description:
      'Modelagem multiagente e visualização 3D simplificada para cenários de semáforos inteligentes e ônibus prioritários.',
    tags: ['Simulação', '3D', 'Cidades'],
    author: 'Lucas Meyer',
    time: 'há 2 meses',
    comments: 33,
    score: 55,
  },
  {
    id: 'p6',
    title: 'Dashboard de sustentabilidade no campus',
    description:
      'Painéis com consumo de energia, resíduos e mobilidade; integração com APIs abertas e metas ODS para relatórios da universidade.',
    tags: ['Dados', 'ODS', 'Dashboard'],
    author: 'Fernanda Rocha',
    time: 'há 4 meses',
    comments: 7,
    score: 28,
  },
  {
    id: 'p7',
    title: 'Serious game sobre ética em IA generativa',
    description:
      'Jogo web narrativo com ramificações e métricas de escolhas; material de apoio para disciplinas de computação e design.',
    tags: ['Games', 'IA generativa', 'UX'],
    author: 'Rafael Duarte',
    time: 'há 6 horas',
    comments: 3,
    score: 15,
  },
]

const suggestedConnections = [
  {
    id: 'c1',
    initial: 'C',
    name: 'Carlos Silva',
    role: 'professor',
    roleLabel: 'Professor',
    field: 'Inteligência Artificial',
  },
  {
    id: 'c2',
    initial: 'B',
    name: 'Beatriz Oliveira',
    role: 'investor',
    roleLabel: 'Investidor',
    field: 'Tecnologia',
  },
]

const recentBadges = [
  {
    id: 'b1',
    title: 'Estudante Ativo',
    desc: '5 projetos publicados',
    tone: 'blue',
  },
  {
    id: 'b2',
    title: 'Colaborador',
    desc: '10 contribuições',
    tone: 'green',
  },
  {
    id: 'b3',
    title: 'Discussão Ativa',
    desc: '50 comentários',
    tone: 'orange',
  },
]

const quickActions = [
  {
    id: 'invest',
    title: 'Buscar Investimento',
    desc: 'Conecte-se com investidores e editais',
    tone: 'hsl(220, 70%, 45%)',
    bg: 'color-mix(in srgb, hsl(220 70% 45%) 18%, white)',
  },
  {
    id: 'collab',
    title: 'Colaborar em Projeto',
    desc: 'Encontre equipes e coautores',
    tone: 'hsl(160, 55%, 38%)',
    bg: 'color-mix(in srgb, hsl(160 55% 38%) 18%, white)',
  },
  {
    id: 'mentor',
    title: 'Solicitar Mentoria',
    desc: 'Agende com professores da área',
    tone: 'hsl(280, 45%, 48%)',
    bg: 'color-mix(in srgb, hsl(280 45% 48%) 18%, white)',
  },
  {
    id: 'chat',
    title: 'Iniciar Discussão',
    desc: 'Abra tópicos na comunidade',
    tone: 'hsl(25, 85%, 48%)',
    bg: 'color-mix(in srgb, hsl(25 85% 48%) 18%, white)',
  },
]

function IconSearch(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconPeople() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconGradCap() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 10v6M2 10l10-5 10 5-10 5L2 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m12 2 2.9 6.62L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l7.1-.65L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconTrending() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 17h4l3-8 4 10 3-6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function IconArrowUp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m18 15-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconArrowDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function QuickActionGlyph({ id }) {
  const stroke = 'currentColor'
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true }
  switch (id) {
    case 'invest':
      return (
        <svg {...common}>
          <path
            d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'collab':
      return (
        <svg {...common}>
          <path
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'mentor':
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={stroke} strokeWidth="2" />
          <path
            d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
            stroke={stroke}
            strokeWidth="2"
          />
          <path d="M8 7h8M8 11h6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path
            d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}

function IconTrophy() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M7 4H5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2M17 4h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function IconGradCapSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 10v6M2 10l10-5 10 5-10 5L2 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function IconTrendUpSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 6h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconRibbon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 14 6 20 12 17l6 3-2-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconTarget() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RoleTag({ type, label }) {
  if (type === 'professor') {
    return (
      <span className="home-role-tag home-role-tag--professor">
        <IconGradCapSmall />
        {label}
      </span>
    )
  }
  return (
    <span className="home-role-tag home-role-tag--investor">
      <IconTrendUpSmall />
      {label}
    </span>
  )
}

function BadgeRowIcon({ tone }) {
  const cls =
    tone === 'green'
      ? 'home-badge-row__icon home-badge-row__icon--green'
      : tone === 'orange'
        ? 'home-badge-row__icon home-badge-row__icon--orange'
        : 'home-badge-row__icon home-badge-row__icon--blue'
  let inner = <IconRibbon />
  if (tone === 'green') inner = <IconTarget />
  if (tone === 'orange') inner = <IconBolt />
  return <span className={cls}>{inner}</span>
}

function ProjectCard({ post }) {
  return (
    <article className="home-card" aria-label={post.title}>
      <div className="home-vote">
        <button type="button" className="home-vote__btn" aria-label="Voto positivo">
          <IconArrowUp />
        </button>
        <span className="home-vote__score">{post.score}</span>
        <button type="button" className="home-vote__btn" aria-label="Voto negativo">
          <IconArrowDown />
        </button>
      </div>
      <div className="home-card__body">
        <h3 className="home-card__title">{post.title}</h3>
        <p className="home-card__text">{post.description}</p>
        <div className="home-chips">
          {post.tags.map((tag) => (
            <span key={tag} className="home-chip">
              {tag}
            </span>
          ))}
        </div>
        <p className="home-card__meta">
          {post.author} • {post.time} • {post.comments} comentários • <a href={`#post-${post.id}`}>Link</a>
        </p>
      </div>
    </article>
  )
}

function tabIcon(id) {
  if (id === 'recent') return <IconClock />
  if (id === 'popular') return <IconStar />
  return <IconTrending />
}

export default function HomePage() {
  return (
    <div className="home">
      <header className="home-topbar">
        <Link className="home-topbar__brand" to="/">
          <img
            className="home-topbar__logo"
            src={logoFurbConnect}
            alt="FURB Connect"
            width={40}
            height={40}
          />
          <span className="home-topbar__brand-text">
            <span className="home-topbar__brand-furb">FURB</span>{' '}
            <span className="home-topbar__brand-connect">Connect</span>
          </span>
        </Link>
        <div className="home-topbar__search-wrap">
          <label className="home-topbar__search">
            <span className="sr-only">Buscar na plataforma</span>
            <IconSearch />
            <input type="search" placeholder="Buscar posts, cursos, pessoas..." readOnly tabIndex={-1} />
          </label>
        </div>
        <div className="home-topbar__actions">
          <Link className="home-topbar__login" to="/login">
            Entrar
          </Link>
          <button type="button" className="home-icon-btn">
            <IconPeople />
            <span>Pessoas</span>
          </button>
          <button type="button" className="home-icon-btn home-icon-btn--round" aria-label="Notificações">
            <IconBell />
          </button>
          <span className="home-avatar" aria-hidden title="Perfil" />
        </div>
      </header>

      <div className="home-body">
        <aside className="home-sidebar" aria-label="Cursos">
          <h2 className="home-sidebar__title">
            <IconGradCap />
            Cursos
          </h2>
          <ul className="home-nav-list">
            {courses.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={
                    c.active
                      ? 'home-nav-item home-nav-item--active'
                      : 'home-nav-item'
                  }
                >
                  <span className="home-nav-item__label">{c.label}</span>
                  <span className="home-nav-item__meta">
                    {c.count}
                    {c.active ? <IconChevronRight /> : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="home-feed">
          <section className="home-hero" aria-labelledby="feed-hero-title">
            <h1 id="feed-hero-title" className="home-hero__title">
              Feed de Projetos
            </h1>
            <p className="home-hero__subtitle">
              Explore projetos acadêmicos, pesquisas e iniciativas inovadoras da FURB.
            </p>
            <button type="button" className="home-hero__cta">
              <IconPlus />
              Criar Novo Projeto
            </button>
          </section>

          <div className="home-tabs" role="tablist" aria-label="Ordenação do feed">
            {feedTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={Boolean(t.active)}
                className={t.active ? 'home-tab home-tab--active' : 'home-tab'}
              >
                {tabIcon(t.id)}
                {t.label}
              </button>
            ))}
          </div>

          <div className="home-feed__posts">
            {mockPosts.map((post) => (
              <ProjectCard key={post.id} post={post} />
            ))}
          </div>
        </main>

        <aside className="home-aside">
          <section className="home-widget" aria-labelledby="quick-actions-title">
            <h2 id="quick-actions-title" className="home-widget__head">
              Ações Rápidas
            </h2>
            <ul className="home-widget-list">
              {quickActions.map((a) => (
                <li key={a.id}>
                  <button type="button" className="home-widget-link">
                    <span
                      className="home-widget-link__icon"
                      style={{ background: a.bg, color: a.tone }}
                      aria-hidden
                    >
                      <QuickActionGlyph id={a.id} />
                    </span>
                    <span>
                      <span className="home-widget-link__title">{a.title}</span>
                      <span className="home-widget-link__desc">{a.desc}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="home-widget" aria-labelledby="suggested-connections-title">
            <h2 id="suggested-connections-title" className="home-widget__head home-widget__head--connections">
              <IconPeople />
              Conexões Sugeridas
            </h2>
            <ul className="home-suggested-list">
              {suggestedConnections.map((c) => (
                <li key={c.id}>
                  <div className="home-suggested-card">
                    <div className="home-suggested-card__header">
                      <span className="home-suggested-avatar" aria-hidden>
                        {c.initial}
                      </span>
                      <div className="home-suggested-info">
                        <p className="home-suggested-name">{c.name}</p>
                        <RoleTag type={c.role} label={c.roleLabel} />
                        <p className="home-suggested-field">{c.field}</p>
                      </div>
                    </div>
                    <button type="button" className="home-btn-connect">
                      Conectar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="home-widget home-widget--achievements"
            aria-labelledby="achievements-title"
          >
            <h2 id="achievements-title" className="home-widget__head home-widget__head--trophy">
              <IconTrophy />
              Suas Conquistas
            </h2>
            <div className="home-achievements-level">
              <div className="home-level">
                <span>Nível de Atividade</span>
                <span className="home-level__badge">Nível 3</span>
              </div>
              <div
                className="home-progress"
                role="progressbar"
                aria-valuenow={350}
                aria-valuemin={0}
                aria-valuemax={500}
              >
                <div className="home-progress__bar" />
              </div>
              <p className="home-progress__label">350/500 pontos para o próximo nível</p>
            </div>

            <hr className="home-badges-divider" />

            <h3 className="home-badges-heading">Badges Recentes</h3>
            <ul className="home-badge-rows">
              {recentBadges.map((b) => (
                <li key={b.id}>
                  <div className="home-badge-row">
                    <BadgeRowIcon tone={b.tone} />
                    <div className="home-badge-row__body">
                      <span className="home-badge-row__title">{b.title}</span>
                      <span className="home-badge-row__desc">{b.desc}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
