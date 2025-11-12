const {isNewsRelevant} = require('../app/telegramNews/isNewsRelevant');

describe('edge cases', () => {
  test('«зі стартом сезону 12.12» проходить', () => {
    expect(isNewsRelevant('Траси, які чекатимуть на вас зі стартом сезону 12.12')).toBe(true);
  });

  test('місяць словами: «12 грудня» проходить', () => {
    expect(isNewsRelevant('Схили будуть готові 12 грудня — зустрінемось на старті сезону!')).toBe(true);
  });

  test('«продовжено до 15.04» проходить', () => {
    expect(isNewsRelevant('Сезон продовжено до 15.04 включно')).toBe(true);
  });

  test('«катання завершено» проходить', () => {
    expect(isNewsRelevant('Друзі, катання завершено. Дякуємо що були з нами!')).toBe(true);
  });

  test('чиста реклама НЕ проходить', () => {
    expect(isNewsRelevant('Знижки на проживання весь тиждень — бронюй зараз!')).toBe(false);
  });
});
