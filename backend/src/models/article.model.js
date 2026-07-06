// Model Article (documental) — formato de um artigo no store:
//   { id, authorId, title, content, status, tags, likes, reports, createdAt }
// likes/reports: arrays de ids de usuarios (preenchidos nos commits 09/10).
const ARTICLE_STATUS = {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
};

// Maquina de estados dos artigos: transicoes permitidas a partir de cada status.
//   DRAFT   -> REVIEW              (autor envia para revisao)
//   REVIEW  -> PUBLISHED/REJECTED  (admin aprova/rejeita)
const STATUS_TRANSITIONS = {
  [ARTICLE_STATUS.DRAFT]: [ARTICLE_STATUS.REVIEW],
  [ARTICLE_STATUS.REVIEW]: [ARTICLE_STATUS.PUBLISHED, ARTICLE_STATUS.REJECTED],
  [ARTICLE_STATUS.PUBLISHED]: [],
  [ARTICLE_STATUS.REJECTED]: [],
};

function canTransition(from, to) {
  return (STATUS_TRANSITIONS[from] || []).includes(to);
}

// Status em que o autor ainda pode editar ou excluir o proprio artigo,
// isto e, antes de ele ser publicado ou rejeitado.
const EDITABLE_STATUSES = [ARTICLE_STATUS.DRAFT, ARTICLE_STATUS.REVIEW];

function isEditable(status) {
  return EDITABLE_STATUSES.includes(status);
}

module.exports = {
  ARTICLE_STATUS,
  STATUS_TRANSITIONS,
  canTransition,
  EDITABLE_STATUSES,
  isEditable,
};
