import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import logoFurbConnect from '../assets/Logo furbconnect.png'
import {
  courses,
  quickActions,
  suggestedConnections,
  recentBadges,
} from '../data/homeLayoutData.js'
import { getAllPostsForFeed } from '../data/postQueries.js'
import '../pages/HomePage.css'

function feedSortFromLocation(pathname, search) {
  if (pathname !== '/home') return null
  const t = new URLSearchParams(search).get('tab')
  if (t === 'popular' || t === 'trending') return t
  return 'recent'
}

function IconRNavHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconRNavPopular() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v10M8 10l4-3 4 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconRNavTrending() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 17h4l3-8 4 10 3-6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconRNavPlus() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function IconRNavPost() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6M10 13h4M10 17h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Uma única seta: recolher (←) ou expandir (→) */
function IconSidebarToggle({ pointLeft }) {
  return pointLeft ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 6 9 12l6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const SIDEBAR_COLLAPSED_KEY = 'furbconnect.sidebarCollapsed'
const MOBILE_QUERY = '(max-width: 768px)'

function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

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
      <path
        d="M7 4H5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2M17 4h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"
        stroke="currentColor"
        strokeWidth="2"
      />
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

/**
 * Shell visual da home: topbar, sidebar de cursos (opcional), conteúdo principal e aside direito.
 * Passe `selectedCourseId` e `onSelectCourse` na home para a lista de cursos filtrar o feed.
 */
export default function PageChrome({
  children,
  showLeftSidebar = true,
  selectedCourseId = 'all',
  onSelectCourse,
  currentPostId = null,
}) {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const feedSort = feedSortFromLocation(location.pathname, location.search)
  const sidebarPosts = getAllPostsForFeed()
    .filter((p) => p.id !== currentPostId)
    .slice(0, 6)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
    } catch {
      return false
    }
  })

  const [isMobile, setIsMobile] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [sidebarCollapsed])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!mobileNavOpen || !isMobile) return
    function onKey(e) {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileNavOpen, isMobile])

  const bodyClass = [
    'home-body',
    !showLeftSidebar && 'home-body--no-left',
    showLeftSidebar && sidebarCollapsed && !isMobile && 'home-body--sidebar-collapsed',
  ]
    .filter(Boolean)
    .join(' ')

  const homeRootClass = ['home', isMobile && mobileNavOpen && 'home--nav-open'].filter(Boolean).join(' ')

  const showSidebarNav = !sidebarCollapsed || isMobile

  return (
    <div className={homeRootClass}>
      <header className="home-topbar">
        {showLeftSidebar && isMobile ? (
          <button
            type="button"
            className="home-topbar__menu-btn"
            aria-expanded={mobileNavOpen}
            aria-controls="home-sidebar-nav"
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            <IconMenu />
            <span className="sr-only">Abrir menu de navegação</span>
          </button>
        ) : null}
        <Link className="home-topbar__brand" to="/home">
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
          {isAuthenticated && user ? (
            <button
              type="button"
              className="home-topbar__logout home-topbar__logout--touch-only"
              onClick={logout}
            >
              Sair
            </button>
          ) : (
            <Link className="home-topbar__login" to="/login">
              Entrar
            </Link>
          )}
          <button type="button" className="home-icon-btn">
            <IconPeople />
            <span>Pessoas</span>
          </button>
          <button type="button" className="home-icon-btn home-icon-btn--round" aria-label="Notificações">
            <IconBell />
          </button>
          {isAuthenticated && user ? (
            <div className="home-account-menu">
              <Link
                className="home-avatar home-avatar--link"
                to="/perfil"
                title="Meu perfil"
                aria-label="Ir para meu perfil"
              >
                {user.avatarUrl ? (
                  <img className="home-avatar__img" src={user.avatarUrl} alt="" width={38} height={38} />
                ) : (
                  <span className="home-avatar__letter">{user.avatarInitial}</span>
                )}
              </Link>
              <div className="home-account-menu__panel">
                <div className="home-account-menu__preview">
                  {user.avatarUrl ? (
                    <img
                      className="home-account-menu__preview-img"
                      src={user.avatarUrl}
                      alt=""
                      width={40}
                      height={40}
                    />
                  ) : (
                    <span className="home-account-menu__preview-fallback">{user.avatarInitial}</span>
                  )}
                  <div className="home-account-menu__preview-text">
                    <span className="home-account-menu__preview-name">{user.displayName}</span>
                    <span className="home-account-menu__preview-handle">u/{user.handle}</span>
                  </div>
                </div>
                <div className="home-account-menu__actions" role="menu" aria-label="Conta">
                  <Link className="home-account-menu__btn" role="menuitem" to="/perfil">
                    Perfil
                  </Link>
                  <button
                    type="button"
                    className="home-account-menu__btn"
                    role="menuitem"
                    disabled
                    title="Em breve"
                  >
                    Configurações
                  </button>
                  <button type="button" className="home-account-menu__btn home-account-menu__btn--danger" role="menuitem" onClick={logout}>
                    Deslogar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link className="home-avatar home-avatar--link home-avatar--guest" to="/login" title="Entrar" aria-label="Entrar">
              <span className="home-avatar__letter home-avatar__letter--guest">?</span>
            </Link>
          )}
        </div>
      </header>

      <div className={bodyClass}>
        {showLeftSidebar ? (
          <aside
            className={`home-sidebar home-sidebar--reddit ${sidebarCollapsed && !isMobile ? 'home-sidebar--collapsed' : ''}`}
            aria-label={
              isMobile ? 'Menu de navegação' : sidebarCollapsed ? 'Menu lateral recolhido' : 'Navegação e filtros'
            }
            aria-hidden={isMobile ? !mobileNavOpen : undefined}
          >
            {isMobile ? (
              <div className="home-sidebar__mobile-head">
                <span className="home-sidebar__mobile-title">Menu</span>
                <button
                  type="button"
                  className="home-sidebar__mobile-close"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Fechar menu"
                >
                  ×
                </button>
              </div>
            ) : null}
            <div className="home-sidebar__toolbar">
              <button
                type="button"
                className="home-sidebar__collapse"
                aria-expanded={!sidebarCollapsed}
                aria-controls={sidebarCollapsed ? undefined : 'home-sidebar-nav'}
                title={sidebarCollapsed ? 'Mostrar menu lateral' : 'Recolher menu lateral'}
                onClick={() => setSidebarCollapsed((v) => !v)}
              >
                <IconSidebarToggle pointLeft={!sidebarCollapsed} />
                <span className="sr-only">
                  {sidebarCollapsed ? 'Mostrar menu lateral' : 'Recolher menu lateral'}
                </span>
              </button>
            </div>

            {showSidebarNav ? (
            <div
              id="home-sidebar-nav"
              className="home-sidebar__scroll"
              onClick={(e) => {
                if (!isMobile) return
                if (e.target.closest('a[href], button.home-nav-item')) setMobileNavOpen(false)
              }}
            >
              <nav className="home-rnav" aria-label="Atalhos do feed">
                <Link
                  className={`home-rnav__item ${feedSort === 'recent' ? 'home-rnav__item--active' : ''}`}
                  to="/home"
                  title="Início"
                  aria-label="Início"
                >
                  <span className="home-rnav__glyph" aria-hidden>
                    <IconRNavHome />
                  </span>
                  <span className="home-rnav__text">Início</span>
                </Link>
                <Link
                  className={`home-rnav__item ${feedSort === 'popular' ? 'home-rnav__item--active' : ''}`}
                  to="/home?tab=popular"
                  title="Populares"
                  aria-label="Populares"
                >
                  <span className="home-rnav__glyph" aria-hidden>
                    <IconRNavPopular />
                  </span>
                  <span className="home-rnav__text">Populares</span>
                </Link>
                <Link
                  className={`home-rnav__item ${feedSort === 'trending' ? 'home-rnav__item--active' : ''}`}
                  to="/home?tab=trending"
                  title="Em alta"
                  aria-label="Em alta"
                >
                  <span className="home-rnav__glyph" aria-hidden>
                    <IconRNavTrending />
                  </span>
                  <span className="home-rnav__text">Em alta</span>
                </Link>
                <Link
                  className={`home-rnav__item ${location.pathname === '/criar-post' ? 'home-rnav__item--active' : ''}`}
                  to="/criar-post"
                  title="Criar post"
                  aria-label="Criar post"
                >
                  <span className="home-rnav__glyph" aria-hidden>
                    <IconRNavPlus />
                  </span>
                  <span className="home-rnav__text">Criar post</span>
                </Link>
              </nav>

              <hr className="home-sidebar__rule" />

              <p className="home-sidebar__section-label">Filtros · curso</p>
              <ul className="home-nav-list home-nav-list--compact">
                {courses.map((c) => {
                  const isActive = selectedCourseId === c.id
                  const initial = c.label.trim().charAt(0).toUpperCase()
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        className={
                          isActive ? 'home-nav-item home-nav-item--filter home-nav-item--filter-active' : 'home-nav-item home-nav-item--filter'
                        }
                        aria-pressed={isActive}
                        title={`${c.label} · ${c.count} posts`}
                        aria-label={`Filtrar por ${c.label}`}
                        onClick={() => onSelectCourse?.(c.id)}
                      >
                        <span className="home-nav-item__course-icon" aria-hidden>
                          {initial}
                        </span>
                        <span className="home-nav-item__label">{c.label}</span>
                        <span className="home-nav-item__meta home-nav-item__meta--plain">{c.count}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>

              <hr className="home-sidebar__rule" />

              <p className="home-sidebar__section-label">Mais posts</p>
              <ul className="home-rnav-posts">
                {sidebarPosts.map((p) => (
                  <li key={p.id}>
                    <Link
                      className="home-rnav-posts__link"
                      to={`/post/${p.id}`}
                      title={p.title}
                      aria-label={p.title}
                    >
                      <span className="home-rnav-posts__icon" aria-hidden>
                        <IconRNavPost />
                      </span>
                      <span className="home-rnav-posts__title">{p.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            ) : null}
          </aside>
        ) : null}

        {isMobile && showLeftSidebar ? (
          <button
            type="button"
            className="home-mobile-backdrop"
            aria-label="Fechar menu"
            tabIndex={mobileNavOpen ? 0 : -1}
            onClick={() => setMobileNavOpen(false)}
          />
        ) : null}

        {children}

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

          <section className="home-widget home-widget--achievements" aria-labelledby="achievements-title">
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

      {isMobile ? (
        <nav className="home-mobile-footer" aria-label="Navegação inferior">
          <NavLink
            to="/home"
            end
            className={({ isActive }) =>
              `home-mobile-footer__link${isActive ? ' home-mobile-footer__link--active' : ''}`
            }
          >
            <IconRNavHome />
            <span>Início</span>
          </NavLink>
          <NavLink
            to="/criar-post"
            className={({ isActive }) =>
              `home-mobile-footer__link${isActive ? ' home-mobile-footer__link--active' : ''}`
            }
          >
            <IconRNavPlus />
            <span>Criar</span>
          </NavLink>
          <NavLink
            to={isAuthenticated ? '/perfil' : '/login'}
            className={({ isActive }) =>
              `home-mobile-footer__link${isActive ? ' home-mobile-footer__link--active' : ''}`
            }
          >
            {isAuthenticated && user?.avatarUrl ? (
              <img className="home-mobile-footer__avatar" src={user.avatarUrl} alt="" width={22} height={22} />
            ) : (
              <span className="home-mobile-footer__avatar-fallback" aria-hidden>
                {isAuthenticated && user ? (user.avatarInitial ?? 'V') : '?'}
              </span>
            )}
            <span>Você</span>
          </NavLink>
        </nav>
      ) : null}
    </div>
  )
}
