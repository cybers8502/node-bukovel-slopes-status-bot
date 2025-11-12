const {hasText} = require('../app/telegramNews/isNewsRelevant');

describe('hasText', () => {
  test('повертає true для нормального тексту', () => {
    expect(hasText({message: 'Сезон відкрито!'})).toBe(true);
  });

  test('false для порожнього рядка', () => {
    expect(hasText({message: ''})).toBe(false);
    expect(hasText({message: '   '})).toBe(false);
  });

  test('false якщо message відсутній або не string', () => {
    expect(hasText({})).toBe(false);
    expect(hasText({message: null})).toBe(false);
    expect(hasText({message: 123})).toBe(false);
  });
});
