/**
 * Três posts de exemplo sobre linhas clássicas de pesquisa em computação.
 * Mesma estrutura de dados; conteúdo distinto por id.
 */
export const researchPosts = [
  {
    id: '1',
    /** IDs alinhados a `courses` em `homeLayoutData.js` (matérias às quais o post pertence). */
    contributorUserIds: ['nicolas-voigt'],
    courseIds: ['cc', 'eng'],
    title: 'Aproximação e limites inferiores em caminhos mínimos dinâmicos em grafos esparsos',
    tagline:
      'Notas de pesquisa sobre como manter estimativas de distância sob atualizações de arestas com custo sublinear em |V|.',
    tags: ['Algoritmos', 'Teoria dos grafos', 'Complexidade'],
    author: 'Grupo de Otimização Combinatória (exemplo)',
    publishedAt: 'Março de 2024',
    /** Canal estilo Reddit + métricas iniciais para a UI do post. */
    channelLabel: 'p/GrafosFURB',
    authorHandle: 'optcombinatoria',
    stats: { score: 428, commentCount: 67 },
    paragraphs: [
      'Trabalhos clássicos em algoritmos de grafos mostram que, em grafos direcionados com pesos não negativos, caminhos mínimos de única fonte podem ser obtidos em tempo quase linear na soma |V|+|E|, desde que se usem filas de prioridade adequadas e representações esparsas. Quando o grafo sofre inserções ou remoções incrementais de arestas, porém, reexecutar o algoritmo completo deixa de ser atrativo em aplicações de rede, logística ou compilação, onde o grafo evolui continuamente.',
      'Uma linha de pesquisa convencional investiga estruturas de dados que mantêm aproximações de distâncias com erro controlado, trocando exatidão por atualizações mais baratas. *Esquemas baseados em hopsets*, em árvores de embaralhamento e em decomposições em clusters de diâmetro limitado aparecem repetidamente na literatura; o desafio teórico é fechar lacunas entre limites superiores construtivos e barreiras inferiores condicionadas a hipóteses de complexidade **fine-grained**.',
      'Em sala de aula e em grupos de pesquisa introdutórios, costuma-se ilustrar o tema com experimentos em grafos de colaboração ou malhas rodoviárias reduzidas: mede-se o tempo de atualização médio, a precisão relativa das distâncias estimadas e o consumo de memória. Esses protótipos não substituem provas formais, mas ajudam a conectar decisões de projeto — como o grau de aproximação aceitável — a cenários reais de sistemas que mudam o tempo todo.',
    ],
  },
  {
    id: '2',
    courseIds: ['cc', 'adm'],
    title: 'Modelos de consistência fraca em sistemas distribuídos geo-replicados',
    tagline:
      'Síntese conceitual sobre *trade-offs* entre latência percebida, garantias de leitura e tolerância a partições.',
    tags: ['Sistemas distribuídos', 'Banco de dados', 'CAP'],
    author: 'Laboratório de Computação Distribuída (exemplo)',
    publishedAt: 'Setembro de 2023',
    channelLabel: 'p/DistribuidosFURB',
    authorHandle: 'lab_dist_cc',
    stats: { score: 612, commentCount: 89 },
    paragraphs: [
      'Sistemas distribuídos que atendem usuários em várias regiões frequentemente adotam replicação assíncrona para manter a latência de escrita e leitura baixa. Sob o prisma teórico do teorema CAP, quando ocorre partição de rede, não é possível oferecer simultaneamente consistência linearizável e disponibilidade total sem compromissos; na prática, muitos serviços escolhem modelos de consistência eventual ou causal, documentando explicitamente quais anomalias de leitura podem surgir.',
      'Pesquisas consolidadas na área formalizam esses modelos com histórias de execução, relações “acontece-antes” e níveis de isolamento inspirados em transações. Ferramentas de verificação e testes de caos exploram se implementações respeitam as garantias anunciadas — por exemplo, se leituras monotônicas ou “read your writes” são preservadas sob falhas de processo ou atrasos arbitrários de mensagem.',
      'Para equipes que desenvolvem aplicações sobre esses armazenamentos, o conselho recorrente na literatura é declarar invariantes de negócio que não dependam de leituras fortemente consistentes em todos os caminhos, ou então isolar operações críticas em pequenos conjuntos de chaves sincronizadas de forma síncrona. Estudos de caso em catálogos de e-commerce e em jogos online mostram como essa disciplina de modelagem reduz incidentes difíceis de reproduzir em ambiente de desenvolvimento.',
      '- Declarar invariantes que sobrevivam a leituras fracas\n- Isolar operações críticas com sincronização pontual\n- Documentar anomalias aceitáveis para o produto',
    ],
  },
  {
    id: '3',
    courseIds: ['cc', 'med'],
    title: 'Transferência de representação em visão computacional para imagens médicas de baixo contraste',
    tagline:
      'Rascunho de revisão sobre CNNs pré-treinadas, fine-tuning e métricas clínicas proxy em conjuntos pequenos.',
    tags: ['Aprendizado de máquina', 'Visão computacional', 'Saúde'],
    author: 'Núcleo de Imagens e Saúde Digital (exemplo)',
    publishedAt: 'Janeiro de 2025',
    channelLabel: 'p/VisaoSaudeFURB',
    authorHandle: 'imagens_saude',
    stats: { score: 891, commentCount: 142 },
    paragraphs: [
      'Em visão computacional aplicada à saúde, conjuntos rotulados por especialistas costumam ser pequenos em comparação com benchmarks genéricos de classificação de objetos. Uma estratégia de pesquisa amplamente citada é iniciar com representações aprendidas em grandes bases naturais (ImageNet e sucessores) e depois aplicar fine-tuning supervisionado com regularização forte, data augmentation conservador e, quando possível, arquiteturas que preservem resolução fina relevante ao diagnóstico.',
      'Artigos de survey destacam que a transferência nem sempre é automática: diferenças de intensidade, ruído específico de modalidade (raio-X, ultrassom, ressonância) e distribuição de classes podem degradar o desempenho se o pré-treino não for alinhado ao domínio. Técnicas como normalização por histograma, GANs de estilo e aprendizado por contraste entre vistas da mesma anatomia tentam reduzir esse desvio de domínio sem exigir milhões de exames anotados.',
      'Do ponto de vista experimental, equipes costumam reportar não só acurácia global, mas sensibilidade, especificidade e calibração de probabilidades, além de estudos de ablação que isolam o ganho atribuível ao pré-treino versus à arquitetura. Críticas metodológicas recorrentes incluem vazamento de informação entre treino e teste quando há pacientes repetidos e a necessidade de validação externa em hospitais parceiros antes de generalizar conclusões.',
    ],
  },
]

export function getResearchPost(id) {
  return researchPosts.find((p) => p.id === id) ?? null
}

/** Se `courseId` for `all`, qualquer post aparece; caso contrário o post precisa listar o curso em `courseIds`. */
export function researchPostMatchesCourse(post, courseId) {
  if (!post || courseId === 'all') return true
  const ids = post.courseIds
  return Array.isArray(ids) && ids.includes(courseId)
}

export const researchPostIds = researchPosts.map((p) => p.id)
