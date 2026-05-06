import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import avatarNicolas from '../assets/perfilNicolas.png'

const LS_AUTH = 'furbconnect_auth'

const SKILL_POOL = [
  'JavaScript',
  'TypeScript',
  'Python',
  'SQL',
  'Git',
  'Docker',
  'Node.js',
  'React',
  'Estruturas de dados',
  'Sistemas distribuídos',
  'APIs REST',
  'Análise de algoritmos',
  'Engenharia de software',
  'Testes automatizados',
]

function pickRandomSkills(count) {
  const shuffled = [...SKILL_POOL].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

function randomPhone() {
  const a = 1000 + Math.floor(Math.random() * 9000)
  const b = 1000 + Math.floor(Math.random() * 9000)
  return `(47) 9${a}-${b}`
}

/**
 * Perfil de demonstração para Nicolas Voigt — aluno de SI, ligado ao post de grafos no feed.
 */
export function createNicolasProfile(emailInput) {
  const email =
    emailInput && String(emailInput).includes('@')
      ? String(emailInput).trim()
      : 'nicolas.voigt@furb.br'

  const skills = pickRandomSkills(5 + Math.floor(Math.random() * 3))

  return {
    id: 'nicolas-voigt',
    displayName: 'Nicolas Voigt',
    handle: 'nicolas.voigt',
    email,
    roleBadge: 'Estudante',
    phone: randomPhone(),
    description:
      'Graduando em Sistemas de Informação na FURB. Colabora com o grupo de Otimização Combinatória no material sobre caminhos mínimos dinâmicos em grafos esparsos — contribui com scripts de benchmark, notebooks de experimentos e documentação técnica. Busca estágio em backend ou dados, com foco em algoritmos e APIs.',
    skills,
    avatarInitial: 'N',
    avatarUrl: avatarNicolas,
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_AUTH)
      if (raw) {
        const data = JSON.parse(raw)
        if (data?.displayName === 'Nicolas Voigt' && data?.id) {
          setUser({
            ...data,
            avatarUrl: data.avatarUrl || avatarNicolas,
          })
        }
      }
    } catch {
      /* ignore */
    }
  }, [])

  const login = useCallback((email, _password) => {
    const profile = createNicolasProfile(email)
    localStorage.setItem(LS_AUTH, JSON.stringify(profile))
    setUser(profile)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(LS_AUTH)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
