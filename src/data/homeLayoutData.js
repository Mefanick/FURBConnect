/** Dados compartilhados entre a home e o chrome (sidebar cursos + aside direito). */

export const courses = [
  { id: 'all', label: 'Todos os Cursos', count: 1240 },
  { id: 'cc', label: 'Ciência da Computação', count: 342 },
  { id: 'eng', label: 'Engenharia', count: 218 },
  { id: 'adm', label: 'Administração', count: 156 },
  { id: 'des', label: 'Design', count: 98 },
  { id: 'dir', label: 'Direito', count: 87 },
  { id: 'med', label: 'Medicina', count: 76 },
  { id: 'arq', label: 'Arquitetura', count: 64 },
]

export const quickActions = [
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

export const suggestedConnections = [
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

export const recentBadges = [
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
