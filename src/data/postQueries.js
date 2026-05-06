import { loadLocalPosts } from './localPosts.js'
import { researchPosts } from './researchPosts.js'

export { researchPostMatchesCourse } from './researchPosts.js'

/** Posts da comunidade + pesquisa (usuário primeiro — mais recentes no topo do array local). */
export function getAllPostsForFeed() {
  return [...loadLocalPosts(), ...researchPosts]
}

export function getPostById(id) {
  const local = loadLocalPosts().find((p) => p.id === id)
  if (local) return local
  return researchPosts.find((p) => p.id === id) ?? null
}

/** Posts exibidos em “Meus posts” no perfil (colaboração reconhecida ou posts criados pelo usuário). */
export function getPostsForUserProfile(user) {
  if (!user?.id) return []
  return getAllPostsForFeed().filter((p) => {
    if (Array.isArray(p.contributorUserIds) && p.contributorUserIds.includes(user.id)) return true
    if (p.isUserPost && p.authorUserId === user.id) return true
    return false
  })
}
