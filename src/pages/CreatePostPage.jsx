import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import PageChrome from '../layout/PageChrome.jsx'
import { courses } from '../data/homeLayoutData.js'
import {
  clearCreateDraft,
  hasCreateDraft,
  loadCreateDraft,
  prependUserPost,
  saveCreateDraft,
} from '../data/localPosts.js'
import logoFurbConnect from '../assets/Logo furbconnect.png'
import './CreatePostPage.css'

const TITLE_MAX = 300
const IMAGE_MAX_BYTES = 1_500_000

const selectableCourses = courses.filter((c) => c.id !== 'all')

const TABS = [
  { id: 'text', label: 'Texto' },
  { id: 'images', label: 'Imagens' },
  { id: 'link', label: 'Link' },
  { id: 'poll', label: 'Enquete', disabled: true },
]

function isValidHttpUrl(str) {
  try {
    const u = new URL(str)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export default function CreatePostPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('text')
  const [title, setTitle] = useState('')
  const [tagline, setTagline] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [body, setBody] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [imageDataUrl, setImageDataUrl] = useState('')
  const [imageName, setImageName] = useState('')
  const [courseIds, setCourseIds] = useState(() => new Set(['cc']))
  const [draftLoaded, setDraftLoaded] = useState(false)
  const [showDraftHint, setShowDraftHint] = useState(false)

  useEffect(() => {
    const d = loadCreateDraft()
    if (!d || typeof d !== 'object') {
      setDraftLoaded(true)
      return
    }
    const hasMeaningful =
      Boolean(
        d.title?.trim() ||
          d.body?.trim() ||
          d.linkUrl?.trim() ||
          d.imageDataUrl ||
          d.tagline?.trim() ||
          d.tagsInput?.trim(),
      ) || (Array.isArray(d.courseIds) && d.courseIds.length > 0)
    setShowDraftHint(hasMeaningful)
    setActiveTab(d.activeTab || 'text')
    setTitle(d.title || '')
    setTagline(d.tagline || '')
    setTagsInput(d.tagsInput || '')
    setBody(d.body || '')
    setLinkUrl(d.linkUrl || '')
    setImageDataUrl(d.imageDataUrl || '')
    setImageName(d.imageName || '')
    setCourseIds(new Set(Array.isArray(d.courseIds) && d.courseIds.length ? d.courseIds : ['cc']))
    setDraftLoaded(true)
  }, [])

  const titleLen = title.length
  const canSubmit = useMemo(() => {
    if (!title.trim() || courseIds.size === 0) return false
    if (activeTab === 'text') return body.trim().length > 0
    if (activeTab === 'link') return isValidHttpUrl(linkUrl.trim())
    if (activeTab === 'images') return Boolean(imageDataUrl)
    return false
  }, [title, courseIds.size, activeTab, body, linkUrl, imageDataUrl])

  function toggleCourse(id) {
    setCourseIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size === 1) return next
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function persistDraft() {
    saveCreateDraft({
      activeTab,
      title,
      tagline,
      tagsInput,
      body,
      linkUrl,
      imageDataUrl,
      imageName,
      courseIds: [...courseIds],
    })
  }

  function handleSaveDraft() {
    persistDraft()
    setShowDraftHint(false)
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      window.alert('Escolha um arquivo de imagem.')
      return
    }
    if (file.size > IMAGE_MAX_BYTES) {
      window.alert('Imagem muito grande. Use até cerca de 1,5 MB para armazenar no navegador.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImageDataUrl(typeof reader.result === 'string' ? reader.result : '')
      setImageName(file.name)
    }
    reader.readAsDataURL(file)
  }

  function buildUserPost() {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const id = `u-${Date.now()}`
    const courseIdsArr = [...courseIds]
    const taglineFinal =
      tagline.trim() ||
      (activeTab === 'text' && body.trim()
        ? `${body.trim().slice(0, 140)}${body.trim().length > 140 ? '…' : ''}`
        : activeTab === 'link'
          ? `Link: ${linkUrl.trim()}`
          : 'Post com imagem')

    let paragraphs = []
    if (activeTab === 'text') {
      paragraphs = body
        .trim()
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
      if (paragraphs.length === 0) paragraphs = [body.trim()]
    } else if (activeTab === 'link') {
      const extra = body.trim()
      paragraphs = extra ? [extra, `🔗 ${linkUrl.trim()}`] : [`🔗 ${linkUrl.trim()}`]
    } else {
      const cap = body.trim() || 'Imagem enviada pela comunidade.'
      paragraphs = [cap]
    }

    return {
      id,
      isUserPost: true,
      authorUserId: user?.id,
      courseIds: courseIdsArr,
      title: title.trim(),
      tagline: taglineFinal,
      tags: tags.length ? tags : ['Comunidade'],
      author: user?.displayName ?? 'Você',
      publishedAt: new Date().toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      paragraphs,
      channelLabel: 'p/FURBConnect',
      authorHandle: user?.handle ?? 'voce',
      stats: { score: 1, commentCount: 0 },
      postKind: activeTab === 'images' ? 'image' : activeTab === 'link' ? 'link' : 'text',
      linkUrl: activeTab === 'link' ? linkUrl.trim() : undefined,
      imageDataUrl: activeTab === 'images' && imageDataUrl ? imageDataUrl : undefined,
    }
  }

  function handlePost(e) {
    e.preventDefault()
    if (!canSubmit) return
    const post = buildUserPost()
    prependUserPost(post)
    clearCreateDraft()
    navigate(`/post/${post.id}`)
  }

  if (!draftLoaded) {
    return null
  }

  return (
    <PageChrome showLeftSidebar={false}>
      <main className="home-feed create-post">
        <header className="create-post__header">
          <h1 className="create-post__title">Criar post</h1>
          <div className="create-post__header-actions">
            {hasCreateDraft() ? (
              <span className="create-post__draft-badge">Rascunho salvo</span>
            ) : null}
            <Link className="create-post__drafts-link" to="/criar-post">
              Rascunhos
            </Link>
          </div>
        </header>

        {showDraftHint ? (
          <p className="create-post__banner" role="status">
            Continuamos de onde você parou. Você pode limpar o rascunho ao publicar.
          </p>
        ) : null}

        <form className="create-post__form" onSubmit={handlePost}>
          <div className="create-post__community">
            <img src={logoFurbConnect} alt="" className="create-post__community-icon" width={28} height={28} />
            <span className="create-post__community-label">p/FURBConnect</span>
            <span className="create-post__community-hint">comunidade acadêmica</span>
          </div>

          <fieldset className="create-post__courses">
            <legend className="create-post__legend">Matérias relacionadas *</legend>
            <p className="create-post__hint">Usadas para filtrar no feed da página inicial. Selecione ao menos uma.</p>
            <div className="create-post__course-chips">
              {selectableCourses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={
                    courseIds.has(c.id) ? 'create-post__course create-post__course--on' : 'create-post__course'
                  }
                  onClick={() => toggleCourse(c.id)}
                  aria-pressed={courseIds.has(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="create-post__tabs" role="tablist" aria-label="Tipo de post">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activeTab === t.id}
                aria-disabled={t.disabled || undefined}
                disabled={t.disabled}
                className={
                  t.disabled
                    ? 'create-post__tab create-post__tab--disabled'
                    : activeTab === t.id
                      ? 'create-post__tab create-post__tab--active'
                      : 'create-post__tab'
                }
                onClick={() => !t.disabled && setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="create-post__field">
            <label className="sr-only" htmlFor="create-title">
              Título
            </label>
            <input
              id="create-title"
              className="create-post__input create-post__input--title"
              type="text"
              maxLength={TITLE_MAX}
              placeholder="Título *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
            />
            <span className="create-post__counter">
              {titleLen}/{TITLE_MAX}
            </span>
          </div>

          <div className="create-post__field">
            <label className="sr-only" htmlFor="create-tagline">
              Resumo opcional
            </label>
            <input
              id="create-tagline"
              className="create-post__input"
              type="text"
              placeholder="Resumo curto (opcional) — aparece no card do feed"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          <div className="create-post__field">
            <label className="sr-only" htmlFor="create-tags">
              Tags
            </label>
            <input
              id="create-tags"
              className="create-post__input"
              type="text"
              placeholder="Tags (opcional) — separadas por vírgula"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {activeTab === 'text' ? (
            <div className="create-post__field">
              <label className="sr-only" htmlFor="create-body">
                Texto
              </label>
              <textarea
                id="create-body"
                className="create-post__textarea"
                placeholder="Texto do post *"
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          ) : null}

          {activeTab === 'link' ? (
            <div className="create-post__stack">
              <label className="sr-only" htmlFor="create-link">
                URL
              </label>
              <input
                id="create-link"
                className="create-post__input"
                type="url"
                placeholder="https://… *"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <label className="sr-only" htmlFor="create-link-body">
                Comentário sobre o link
              </label>
              <textarea
                id="create-link-body"
                className="create-post__textarea"
                placeholder="Comentário ou contexto (opcional)"
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          ) : null}

          {activeTab === 'images' ? (
            <div className="create-post__upload">
              {imageDataUrl ? (
                <div className="create-post__preview-wrap">
                  <img src={imageDataUrl} alt="" className="create-post__preview" />
                  <p className="create-post__preview-name">{imageName}</p>
                  <div className="create-post__preview-actions">
                    <label className="create-post__change-image">
                      Trocar imagem
                      <input
                        type="file"
                        accept="image/*"
                        className="create-post__file-replace"
                        onChange={handleImageFile}
                      />
                    </label>
                    <button
                      type="button"
                      className="create-post__remove-image"
                      onClick={() => {
                        setImageDataUrl('')
                        setImageName('')
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <label className="create-post__drop">
                  <input type="file" accept="image/*" className="create-post__file" onChange={handleImageFile} />
                  <span className="create-post__drop-text">Arraste uma imagem ou clique para enviar</span>
                  <span className="create-post__drop-sub">PNG, JPG — máx. ~1,5 MB</span>
                </label>
              )}
              <label className="sr-only" htmlFor="create-image-caption">
                Legenda
              </label>
              <textarea
                id="create-image-caption"
                className="create-post__textarea"
                placeholder="Legenda (opcional)"
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          ) : null}

          {activeTab === 'poll' ? null : null}

          <footer className="create-post__footer">
            <Link className="create-post__cancel" to="/home">
              Cancelar
            </Link>
            <div className="create-post__footer-actions">
              <button
                type="button"
                className="create-post__btn create-post__btn--secondary"
                onClick={handleSaveDraft}
              >
                Salvar rascunho
              </button>
              <button type="submit" className="create-post__btn create-post__btn--primary" disabled={!canSubmit}>
                Postar
              </button>
            </div>
          </footer>
        </form>
      </main>
    </PageChrome>
  )
}
