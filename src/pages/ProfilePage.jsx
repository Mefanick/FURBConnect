import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import PageChrome from '../layout/PageChrome.jsx'
import { getPostsForUserProfile } from '../data/postQueries.js'
import './ProfilePage.css'

function IconArrowBack() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconPencil() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.11a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconDoc() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconSparkles() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m12 3 1.9 5.8h6l-4.9 3.6 1.9 5.8-5-3.6-5 3.6 1.9-5.8-4.9-3.6h6L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const myPosts = getPostsForUserProfile(user)

  return (
    <PageChrome showLeftSidebar={false}>
      <div className="profile-page">
        <Link className="profile-page__back" to="/home">
          <IconArrowBack />
          Voltar ao feed
        </Link>

        <article className="profile-card">
          <div className="profile-card__banner" aria-hidden />
          <div className="profile-card__head">
            <div className="profile-card__avatar" aria-hidden>
              {user.avatarUrl ? (
                <img
                  className="profile-card__avatar-img"
                  src={user.avatarUrl}
                  alt=""
                  width={88}
                  height={88}
                />
              ) : (
                user.avatarInitial
              )}
            </div>
            <div className="profile-card__identity">
              <span className="profile-card__badge">{user.roleBadge}</span>
              <h1 className="profile-card__name">{user.displayName}</h1>
              <p className="profile-card__handle">u/{user.handle}</p>
            </div>
            <button type="button" className="profile-card__edit" title="Em breve">
              <IconPencil />
              Editar
            </button>
          </div>

          <div className="profile-card__fields">
            <section className="profile-field">
              <h2 className="profile-field__label">
                <IconPhone />
                Contato
              </h2>
              <p className="profile-field__value">
                {user.phone}
                <br />
                <span className="profile-field__muted">{user.email}</span>
              </p>
            </section>
            <section className="profile-field">
              <h2 className="profile-field__label">
                <IconDoc />
                Descrição
              </h2>
              <p className="profile-field__value profile-field__value--desc">{user.description}</p>
            </section>
            <section className="profile-field">
              <h2 className="profile-field__label">
                <IconSparkles />
                Skills
              </h2>
              {user.skills?.length ? (
                <ul className="profile-skills">
                  {user.skills.map((s) => (
                    <li key={s} className="profile-skills__chip">
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="profile-field__placeholder">Nenhuma skill adicionada</p>
              )}
            </section>
          </div>
        </article>

        <section className="profile-posts" aria-labelledby="profile-posts-title">
          <h2 id="profile-posts-title" className="profile-posts__title">
            Meus posts
          </h2>
          <div className="profile-posts__box">
            {myPosts.length === 0 ? (
              <p className="profile-posts__empty">Você ainda não publicou nenhum post.</p>
            ) : (
              <ul className="profile-posts__list">
                {myPosts.map((p) => (
                  <li key={p.id}>
                    <Link className="profile-posts__item" to={`/post/${p.id}`}>
                      <span className="profile-posts__item-title">{p.title}</span>
                      <span className="profile-posts__item-meta">
                        {p.isUserPost ? 'Seu post' : 'Colaboração'} · {p.publishedAt}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </PageChrome>
  )
}
