import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import PageChrome from '../layout/PageChrome.jsx'
import { researchPostIds } from '../data/researchPosts.js'
import { getAllPostsForFeed, getPostById } from '../data/postQueries.js'
import { threadCommentsByPostId } from '../data/threadComments.js'
import logoFurbConnect from '../assets/Logo furbconnect.png'
import './PostPage.css'

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.', ',')} mil`
  return String(n)
}

function IconArrowUp({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m18 15-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconArrowDown({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconComment() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12a8 8 0 0 1-8 8H8l-5 3v-3a8 8 0 1 1 18-8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconShare() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconMore() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IconReply() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Marcação leve no texto do post: **negrito** e *itálico* (conteúdo vem dos dados locais). */
function parseInlineMarks(text) {
  const chunks = text.split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== '')
  const out = []
  let k = 0
  for (const chunk of chunks) {
    if (/^\*\*[^*]+\*\*$/.test(chunk)) {
      out.push(<strong key={`b-${k++}`}>{chunk.slice(2, -2)}</strong>)
      continue
    }
    const subs = chunk.split(/(\*[^*]+\*)/g).filter((p) => p !== '')
    for (const s of subs) {
      if (/^\*[^*]+\*$/.test(s)) {
        out.push(<em key={`i-${k++}`}>{s.slice(1, -1)}</em>)
      } else if (s) {
        out.push(s)
      }
    }
  }
  return out.length ? out : [text]
}

function PostArticleBlock({ text }) {
  const trimmed = text.trim()
  const lines = trimmed.split(/\n/).map((l) => l.trim()).filter(Boolean)
  const allBullets = lines.length >= 2 && lines.every((l) => /^[-•]\s+/.test(l))
  if (allBullets) {
    return (
      <ul className="post-thread__bullets">
        {lines.map((l, i) => (
          <li key={i} className="post-thread__bullet-item">
            {parseInlineMarks(l.replace(/^[-•]\s+/, ''))}
          </li>
        ))}
      </ul>
    )
  }
  return <p className="post-thread__paragraph">{parseInlineMarks(trimmed)}</p>
}

/** Insere resposta após o bloco de descendentes do comentário pai na lista plana. */
function insertReplyInThread(prev, parentId, reply) {
  const byId = Object.fromEntries(prev.map((x) => [x.id, x]))
  const i = prev.findIndex((x) => x.id === parentId)
  if (i === -1) return [{ ...reply, parentId }, ...prev]

  let j = i + 1
  while (j < prev.length) {
    const c = prev[j]
    let pid = c.parentId
    let under = false
    while (pid) {
      if (pid === parentId) {
        under = true
        break
      }
      pid = byId[pid]?.parentId
    }
    if (!under) break
    j++
  }
  const next = [...prev]
  next.splice(j, 0, { ...reply, parentId })
  return next
}

/** Monta árvore a partir da lista plana (ordem dos irmãos = ordem no array). */
function buildCommentTree(flat) {
  const nodes = new Map()
  for (const c of flat) {
    nodes.set(c.id, { ...c, children: [] })
  }
  const roots = []
  for (const c of flat) {
    const node = nodes.get(c.id)
    const parent = c.parentId ? nodes.get(c.parentId) : null
    if (parent) parent.children.push(node)
    else roots.push(node)
  }
  return roots
}

function CommentThreadNode({
  node,
  collapsedThreadIds,
  onToggleThread,
  expandedCommentIds,
  onToggleCommentExpanded,
  replyingToId,
  onReplyClick,
  replyDraft,
  setReplyDraft,
  onReplySubmit,
  onReplyCancel,
}) {
  const hasReplies = node.children.length > 0
  const collapsed = collapsedThreadIds.has(node.id)
  const isExpanded = expandedCommentIds.has(node.id)
  const longEnough = node.body.length > 220

  return (
    <li className="post-comment-thread">
      <div className="post-comment-thread__row">
        <div
          className={`post-comment-thread__rail ${hasReplies ? 'post-comment-thread__rail--branch' : 'post-comment-thread__rail--leaf'}`}
        >
          {hasReplies ? (
            <button
              type="button"
              className="post-comment-thread__collapse"
              aria-expanded={!collapsed}
              aria-controls={`thread-replies-${node.id}`}
              id={`thread-toggle-${node.id}`}
              title={collapsed ? 'Expandir respostas' : 'Recolher respostas'}
              onClick={() => onToggleThread(node.id)}
            >
              <span className="post-comment-thread__collapse-icon" aria-hidden>
                {collapsed ? '+' : '−'}
              </span>
            </button>
          ) : (
            <span className="post-comment-thread__rail-spacer" aria-hidden />
          )}
        </div>
        <div className="post-comment post-comment--thread">
          <div className="post-comment__vote" aria-hidden>
            <button type="button" className="post-comment__vote-btn" tabIndex={-1}>
              <IconArrowUp className="post-comment__vote-icon" />
            </button>
            <span className="post-comment__vote-score">{node.score}</span>
            <button type="button" className="post-comment__vote-btn" tabIndex={-1}>
              <IconArrowDown className="post-comment__vote-icon" />
            </button>
          </div>
          <div className="post-comment__main">
            <p className="post-comment__meta">
              <strong className="post-comment__user">{node.user}</strong>
              <span className="post-comment__sep">·</span>
              <span className="post-comment__time">{node.ago}</span>
            </p>
            <div
              className={`post-comment__body-wrap ${!isExpanded && longEnough ? 'post-comment__body-wrap--clamped' : ''}`}
            >
              <p className="post-comment__body">{node.body}</p>
            </div>
            {longEnough ? (
              <button
                type="button"
                className="post-comment__expand"
                onClick={() => onToggleCommentExpanded(node.id)}
              >
                {isExpanded ? 'Ver menos' : 'Ver mais'}
              </button>
            ) : null}
            <div className="post-comment__actions" role="group" aria-label="Interações do comentário">
              <button type="button" className="post-comment__action" onClick={() => onReplyClick(node.id)}>
                <IconReply />
                <span>Responder</span>
              </button>
            </div>
            {replyingToId === node.id ? (
              <form className="post-comment__reply-form" onSubmit={(e) => onReplySubmit(e, node.id)}>
                <label className="sr-only" htmlFor={`reply-${node.id}`}>
                  Responder a {node.user}
                </label>
                <input
                  id={`reply-${node.id}`}
                  className="post-comment__reply-input"
                  type="text"
                  autoComplete="off"
                  placeholder={`Responder a ${node.user.split('·')[0]?.trim() ?? node.user}…`}
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                  autoFocus
                />
                <div className="post-comment__reply-actions">
                  <button type="button" className="post-comment__reply-cancel" onClick={onReplyCancel}>
                    Cancelar
                  </button>
                  <button type="submit" className="post-comment__reply-submit" disabled={!replyDraft.trim()}>
                    Publicar
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      </div>
      {hasReplies && !collapsed ? (
        <ul className="post-comment-thread__children" id={`thread-replies-${node.id}`} role="list">
          {node.children.map((ch) => (
            <CommentThreadNode
              key={ch.id}
              node={ch}
              collapsedThreadIds={collapsedThreadIds}
              onToggleThread={onToggleThread}
              expandedCommentIds={expandedCommentIds}
              onToggleCommentExpanded={onToggleCommentExpanded}
              replyingToId={replyingToId}
              onReplyClick={onReplyClick}
              replyDraft={replyDraft}
              setReplyDraft={setReplyDraft}
              onReplySubmit={onReplySubmit}
              onReplyCancel={onReplyCancel}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export default function PostPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const post = getPostById(postId)

  const [vote, setVote] = useState(null)
  const [shareHint, setShareHint] = useState('')
  const [commentDraft, setCommentDraft] = useState('')
  const [comments, setComments] = useState([])
  const [replyingToId, setReplyingToId] = useState(null)
  const [replyDraft, setReplyDraft] = useState('')
  const [expandedCommentIds, setExpandedCommentIds] = useState(() => new Set())
  const [collapsedThreadIds, setCollapsedThreadIds] = useState(() => new Set())

  const baseScore = post?.stats?.score ?? 0
  const baseCommentCount = post?.stats?.commentCount ?? 0

  const scoreDisplay = baseScore + (vote === 'up' ? 1 : vote === 'down' ? -1 : 0)
  const channelLabel = post?.channelLabel ?? 'p/FURBConnect'
  const authorHandle = post?.authorHandle ?? 'autor'

  useEffect(() => {
    if (!postId) return
    setComments(threadCommentsByPostId[postId] ?? [])
    setVote(null)
    setCommentDraft('')
    setShareHint('')
    setReplyingToId(null)
    setReplyDraft('')
    setExpandedCommentIds(() => new Set())
    setCollapsedThreadIds(() => new Set())
  }, [postId])

  if (!post) {
    return <Navigate to={`/post/${researchPostIds[0]}`} replace />
  }

  const orderedFeed = getAllPostsForFeed()
  const idx = orderedFeed.findIndex((p) => p.id === post.id)
  const prevId = idx > 0 ? orderedFeed[idx - 1].id : null
  const nextId = idx >= 0 && idx < orderedFeed.length - 1 ? orderedFeed[idx + 1].id : null

  const totalCommentCount = baseCommentCount + comments.filter((c) => c.isNew).length

  function toggleVote(direction) {
    setVote((v) => {
      if (v === direction) return null
      return direction
    })
  }

  function handleShare() {
    const url = window.location.href
    const title = post.title
    ;(async () => {
      try {
        if (navigator.share) {
          await navigator.share({ title, url })
        } else {
          await navigator.clipboard.writeText(url)
          setShareHint('Link copiado para a área de transferência.')
        }
      } catch (e) {
        if (e?.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(url)
            setShareHint('Link copiado para a área de transferência.')
          } catch {
            setShareHint('Não foi possível compartilhar.')
          }
        }
      }
      window.setTimeout(() => setShareHint(''), 3200)
    })()
  }

  function handleCommentSubmit(e) {
    e.preventDefault()
    const text = commentDraft.trim()
    if (!text) return
    setComments((prev) => [
      {
        id: `new-${Date.now()}`,
        user: 'você',
        body: text,
        ago: 'agora',
        score: 1,
        isNew: true,
      },
      ...prev,
    ])
    setCommentDraft('')
  }

  function handleReplySubmit(e, parentId) {
    e.preventDefault()
    const text = replyDraft.trim()
    if (!text || !parentId) return
    const reply = {
      id: `new-${Date.now()}`,
      user: 'você',
      body: text,
      ago: 'agora',
      score: 1,
      isNew: true,
    }
    setComments((prev) => insertReplyInThread(prev, parentId, reply))
    setReplyDraft('')
    setReplyingToId(null)
  }

  function toggleCommentExpanded(id) {
    setExpandedCommentIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleThreadCollapsed(id) {
    setCollapsedThreadIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const commentTree = useMemo(() => buildCommentTree(comments), [comments])

  return (
    <PageChrome
      showLeftSidebar
      currentPostId={post.id}
      onSelectCourse={(id) =>
        navigate(id === 'all' ? '/home' : `/home?curso=${encodeURIComponent(id)}`)
      }
    >
      <main className="home-feed post-page">
        <nav className="post-page__crumb" aria-label="Navegação do post">
          <Link to="/home">Início</Link>
          <span aria-hidden className="post-page__crumb-sep">
            /
          </span>
          <span className="post-page__crumb-current">{channelLabel}</span>
          <span className="post-page__crumb-spacer" aria-hidden>
            ·
          </span>
          {prevId ? (
            <Link className="post-page__crumb-jump" to={`/post/${prevId}`}>
              ← Post anterior
            </Link>
          ) : null}
          {nextId ? (
            <Link className="post-page__crumb-jump" to={`/post/${nextId}`}>
              Próximo post →
            </Link>
          ) : null}
        </nav>

        <article className="post-thread">
          <div className="post-thread__body-wrap">
            <div className="post-thread__content-panel">
              <header className="post-thread__header">
                <div className="post-thread__header-block">
                  <img
                    className="post-thread__channel-icon"
                    src={logoFurbConnect}
                    alt=""
                    width={40}
                    height={40}
                  />
                  <div className="post-thread__header-copy">
                    <div className="post-thread__meta-line">
                      <span className="post-thread__channel">{channelLabel}</span>
                      <span className="post-thread__sep" aria-hidden>
                        ·
                      </span>
                      <span className="post-thread__time">{post.publishedAt}</span>
                    </div>
                    <div className="post-thread__author-line">
                      <span className="post-thread__author">u/{authorHandle}</span>
                    </div>
                  </div>
                </div>
                <button type="button" className="post-thread__more" aria-label="Mais opções">
                  <IconMore />
                </button>
              </header>

              <h1 id="post-title" className="post-thread__title">
                {post.title}
              </h1>
              <p className="post-thread__tagline">{parseInlineMarks(post.tagline)}</p>

              <ul className="post-thread__tags">
                {(post.tags ?? []).map((tag) => (
                  <li key={tag}>
                    <span className="post-thread__chip">{tag}</span>
                  </li>
                ))}
              </ul>

              <div className="post-thread__article" aria-label="Texto do post">
                {post.linkUrl ? (
                  <p className="post-thread__link-wrap">
                    <a
                      className="post-thread__link"
                      href={post.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.linkUrl}
                    </a>
                  </p>
                ) : null}
                {post.imageDataUrl ? (
                  <figure className="post-thread__figure">
                    <img className="post-thread__media" src={post.imageDataUrl} alt="" />
                  </figure>
                ) : null}
                {(post.paragraphs ?? [])
                  .filter((t) => t && String(t).trim())
                  .map((text, i) => (
                    <PostArticleBlock key={i} text={String(text)} />
                  ))}
              </div>

              <div className="post-thread__toolbar" role="group" aria-label="Interações">
                <div className="post-toolbar__pill post-toolbar__pill--votes">
                  <button
                    type="button"
                    className={vote === 'up' ? 'post-toolbar__vote is-up' : 'post-toolbar__vote'}
                    aria-label="Voto positivo"
                    onClick={() => toggleVote('up')}
                  >
                    <IconArrowUp />
                  </button>
                  <span className="post-toolbar__count">{formatCount(scoreDisplay)}</span>
                  <button
                    type="button"
                    className={vote === 'down' ? 'post-toolbar__vote is-down' : 'post-toolbar__vote'}
                    aria-label="Voto negativo"
                    onClick={() => toggleVote('down')}
                  >
                    <IconArrowDown />
                  </button>
                </div>
                <span className="post-toolbar__pill post-toolbar__pill--comments">
                  <IconComment />
                  <span>{formatCount(totalCommentCount)} comentários</span>
                </span>
                <button type="button" className="post-toolbar__pill post-toolbar__pill--action" onClick={handleShare}>
                  <IconShare />
                  <span>Compartilhar</span>
                </button>
              </div>
              {shareHint ? (
                <p className="post-thread__share-hint" role="status">
                  {shareHint}
                </p>
              ) : null}
            </div>

            <section className="post-comments post-comments--panel" aria-labelledby="comments-heading">
              <h2 id="comments-heading" className="post-comments__heading">
                Discussão
              </h2>

              <form className="post-comments__composer" onSubmit={handleCommentSubmit}>
                <label className="sr-only" htmlFor="post-comment-input">
                  Novo comentário
                </label>
                <input
                  id="post-comment-input"
                  className="post-comments__input"
                  type="text"
                  autoComplete="off"
                  placeholder="Participe da conversa"
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                />
                <button type="submit" className="post-comments__submit" disabled={!commentDraft.trim()}>
                  Comentar
                </button>
              </form>

              <ul className="post-comments__list" role="list">
                {commentTree.map((node) => (
                  <CommentThreadNode
                    key={node.id}
                    node={node}
                    collapsedThreadIds={collapsedThreadIds}
                    onToggleThread={toggleThreadCollapsed}
                    expandedCommentIds={expandedCommentIds}
                    onToggleCommentExpanded={toggleCommentExpanded}
                    replyingToId={replyingToId}
                    onReplyClick={(id) => {
                      setReplyingToId((cur) => (cur === id ? null : id))
                      setReplyDraft('')
                    }}
                    replyDraft={replyDraft}
                    setReplyDraft={setReplyDraft}
                    onReplySubmit={handleReplySubmit}
                    onReplyCancel={() => {
                      setReplyingToId(null)
                      setReplyDraft('')
                    }}
                  />
                ))}
              </ul>
            </section>
          </div>
        </article>
      </main>
    </PageChrome>
  )
}
