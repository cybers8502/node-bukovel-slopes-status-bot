const LETTERS = String.raw`[\p{L}\p{M}]`;

const OPENING_ANNOUNCE = [
  new RegExp(
    String.raw`(старт(?:ує|уємо)?\s+сезон|відкритт(?:я|о)\s+сезон|почина${LETTERS}*\s+катан${LETTERS}*|зустріча${LETTERS}*мось|зустрінемося)`,
    'iu',
  ),
  new RegExp(String.raw`зі\s+стартом\s+сезону`, 'iu'),
];

// 2) Факт відкриття сезону
const SEASON_OPENED_NOW = [
  /сезон\s+відкрито/iu,
  /відкрито\s+сезон/iu,
  /сезон\s+стартував/iu,
  /старт\s+сезону/iu,
  /починаємо\s+катат[иь]/iu,
  new RegExp(String.raw`зимов${LETTERS}+\s+магія\s+вже\s+тут`, 'iu'),
];

// 3) Відкриття/готовність/запуск схилів/трас/витягів
const SLOPES_LIFTS = [
  new RegExp(
    String.raw`(працю(?:є|ють)|відкрит(?:о|і)|готов(?:а|і)|запуска(?:ємо|ються)|стартуємо|розпочинає(?:мо)?(?:\s+роботу)?|починає(?:мо)?\s+працювати)\s+(схил(?:и)?|трас(?:а|и)|витяг(?:и|ів)?)`,
    'iu',
  ),
  /(схили|траси|працюють\s+витяги|працює\s+витяг|запустяться\s+витяги)\s*[:\-]/iu,
  /розпочинає\s+роботу\s+трас[а-и]\s*[0-9]+[A-ZА-Я]?/iu,
  new RegExp(String.raw`(можна\s+катат[иь]|працює|працюють|відкрит[оі])`, 'iu'),
  new RegExp(String.raw`(будуть?\s+готов(?:і|а)|готов(?:і|а))(\s+(схил${LETTERS}*|трас${LETTERS}*))?`, 'iu'),
  new RegExp(String.raw`(нічн(?:е|ого)|вечірн(?:є|ього))\s+катанн(?:я)`, 'iu'),
];

// 4) Продовження сезону до дати
const SEASON_EXTENDED = [
  new RegExp(String.raw`(сезон|роботу\s+витягів\s+та\s+схилів)\s+продовжен(?:о|ий)\s+до`, 'iu'),
];

// 5) Закриття/фініш сезону
const SEASON_CLOSING = [
  new RegExp(
    String.raw`(фінішн${LETTERS}+\s+мітк${LETTERS}+|завершенн${LETTERS}+\s+сезон${LETTERS}*|останн${LETTERS}+\s+(день|вікенд)\s+катанн${LETTERS}*)`,
    'iu',
  ),
  new RegExp(String.raw`катанн${LETTERS}*\s+завершен(?:о|е)`, 'iu'),
  new RegExp(String.raw`сезон\s+(завершен(?:о|ий)|закрит(?:о|ий))`, 'iu'),
  new RegExp(String.raw`ставимо\s+фінішн${LETTERS}+\s+мітк${LETTERS}+`, 'iu'),
];

const ALL_NEWS_PATTERNS = [
  ...OPENING_ANNOUNCE,
  ...SEASON_OPENED_NOW,
  ...SLOPES_LIFTS,
  ...SEASON_EXTENDED,
  ...SEASON_CLOSING,
];

module.exports = {
  ALL_NEWS_PATTERNS,
};
