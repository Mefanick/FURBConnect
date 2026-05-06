import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageChrome from '../layout/PageChrome.jsx'
import { courses } from '../data/homeLayoutData.js'
import { getAllPostsForFeed, researchPostMatchesCourse } from '../data/postQueries.js'
import './HomePage.css'

const feedTabs = [
  { id: 'recent', label: 'Recentes' },
  { id: 'popular', label: 'Populares' },
  { id: 'trending', label: 'Em Alta' },
]

function buildFeedPosts() {
  const all = getAllPostsForFeed()
  return all.map((p) => ({
    id: `feed-${p.id}`,
    researchId: p.id,
    title: p.title,
    description: p.tagline,
    tags: p.tags,
    author: p.author,
    time: p.publishedAt,
    comments: p.stats?.commentCount ?? 0,
    score: p.stats?.score ?? 1,
  }))
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

function tabIcon(id) {
  if (id === 'recent') return <IconClock />
  if (id === 'popular') return <IconStar />
  return <IconTrending />
}

function ProjectCard({ post, researchPostPath }) {
  return (
    <article className="home-card">
      <div className="home-vote">
        <button type="button" className="home-vote__btn" aria-label="Voto positivo">
          <IconArrowUp />
        </button>
        <span className="home-vote__score">{post.score}</span>
        <button type="button" className="home-vote__btn" aria-label="Voto negativo">
          <IconArrowDown />
        </button>
      </div>
      <Link
        className="home-card__body home-card__body--link"
        to={researchPostPath}
        aria-label={`Abrir post de pesquisa: ${post.title}`}
      >
        <div className="home-card__copy">
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
            <span>{post.author}</span>
            <span className="home-card__meta-sep" aria-hidden>
              ·
            </span>
            <span>{post.time}</span>
            <span className="home-card__meta-sep" aria-hidden>
              ·
            </span>
            <span>
              {post.comments} comentários
            </span>
            <span className="home-card__meta-sep" aria-hidden>
              ·
            </span>
            <span className="home-card__meta-hint">Ver post</span>
          </p>
        </div>
      </Link>
    </article>
  )
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const rawTab = searchParams.get('tab')
  const activeTab =
    rawTab === 'popular' || rawTab === 'trending' ? rawTab : 'recent'

  const cursoParam = searchParams.get('curso')
  const selectedCourseId = courses.some((c) => c.id === cursoParam) ? cursoParam : 'all'

  function handleSelectCourse(id) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev)
      if (id === 'all') p.delete('curso')
      else p.set('curso', id)
      return p
    })
  }

  const allPosts = getAllPostsForFeed()
  const postById = Object.fromEntries(allPosts.map((p) => [p.id, p]))
  const feedPosts = buildFeedPosts()
  const visiblePosts = feedPosts.filter((fp) =>
    researchPostMatchesCourse(postById[fp.researchId], selectedCourseId),
  )

  const sortedVisiblePosts = useMemo(() => {
    const list = [...visiblePosts]
    if (activeTab === 'popular') list.sort((a, b) => b.score - a.score)
    else if (activeTab === 'trending') list.sort((a, b) => b.comments - a.comments)
    return list
  }, [visiblePosts, activeTab])

  return (
    <PageChrome
      showLeftSidebar
      selectedCourseId={selectedCourseId}
      onSelectCourse={handleSelectCourse}
    >
      <main className="home-feed">
        <section className="home-hero home-hero--light" aria-labelledby="feed-hero-title">
          <h1 id="feed-hero-title" className="home-hero__title">
            Feed de Projetos
          </h1>
          <p className="home-hero__subtitle">
            Explore projetos acadêmicos, descubra talentos e colabore com a comunidade FURB.
          </p>
          <Link className="home-hero__cta" to="/criar-post" title="Criar um novo projeto">
            <IconPlus />
            Criar Novo Projeto
          </Link>
        </section>

        <div className="home-tabs" role="tablist" aria-label="Ordenação do feed">
          {feedTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              className={activeTab === t.id ? 'home-tab home-tab--active' : 'home-tab'}
              onClick={() => {
                setSearchParams((prev) => {
                  const p = new URLSearchParams(prev)
                  if (t.id === 'recent') p.delete('tab')
                  else p.set('tab', t.id)
                  return p
                })
              }}
            >
              {tabIcon(t.id)}
              {t.label}
            </button>
          ))}
        </div>

        <div className="home-feed__posts">
          {sortedVisiblePosts.length === 0 ? (
            <p className="home-feed__empty" role="status">
              Nenhum post associado a este curso. Escolha outra matéria ou &quot;Todos os Cursos&quot;.
            </p>
          ) : (
            sortedVisiblePosts.map((post) => (
              <ProjectCard
                key={post.id}
                post={post}
                researchPostPath={`/post/${post.researchId}`}
              />
            ))
          )}
        </div>
      </main>
    </PageChrome>
  )
}
