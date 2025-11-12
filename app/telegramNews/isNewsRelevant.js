const {ALL_NEWS_PATTERNS} = require('./patterns');

function hasText(msg) {
  return typeof msg?.message === 'string' && msg.message.trim().length > 0;
}

function isNewsRelevant(text) {
  if (!text) return false;
  const t = text.trim().replace(/\s+/g, ' ').toLowerCase();
  return ALL_NEWS_PATTERNS.some((rx) => rx.test(t));
}

module.exports = {
  hasText,
  isNewsRelevant,
};
