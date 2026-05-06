/** Posts criados pelo usuário (persistência em localStorage). */

const LS_POSTS = 'furbconnect_user_posts'
const LS_DRAFT = 'furbconnect_create_post_draft'

export function loadLocalPosts() {
  try {
    const raw = localStorage.getItem(LS_POSTS)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function saveLocalPostsList(posts) {
  localStorage.setItem(LS_POSTS, JSON.stringify(posts))
}

/** Insere no início da lista (mais recentes primeiro). */
export function prependUserPost(post) {
  const next = [post, ...loadLocalPosts()]
  saveLocalPostsList(next)
  return post
}

export function loadCreateDraft() {
  try {
    const raw = localStorage.getItem(LS_DRAFT)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveCreateDraft(draft) {
  localStorage.setItem(LS_DRAFT, JSON.stringify(draft))
}

export function clearCreateDraft() {
  localStorage.removeItem(LS_DRAFT)
}

export function hasCreateDraft() {
  return Boolean(loadCreateDraft())
}
