Node.js application for parsing ski trail status data from the Bukovel resort website (bukovel.com). The bot notifies Telegram users about changes in trail status. Bot is not official application.

```
project/
├── src/
│   ├── utils/          # Мелкие утилитные функции
│   ├── services/       # Самодостаточные функции (с вводными данными или захардкоженными)
│   ├── modules/        # Крупные модульные функции
│   ├── config/         # Конфигурационные файлы (API ключи, параметры подключения и т.д.)
│   └── tests/          # Тесты для всех модулей        
│   index.js            # Точка входа в приложение
└── package.json        # Описание проекта
```

## Категории функций

### Мелкие утилитные функции

**Назначение:** Логика, повторно используемая в разных частях проекта.

**Хранение:** В папке src/utils/.

**Примеры:**

Форматирование даты (formatDate.js).

Работа с базой данных (firebaseHelpers.js).

Выполнение HTTP-запросов (fetchHelper.js).

### Самодостаточные функции с вводными данными

**Назначение:** Выполняют задачу, требуют данные для работы.

**Хранение:** В папке src/services/.

**Пример:** Снятие скриншота, получение данных из API.

### Самодостаточные функции с захардкоженными данными

**Назначение:** Выполняют конкретную задачу с заданными параметрами, могут использовать утилиты.

**Хранение:** Также в src/services/, но можно группировать по категориям, если функций много.

**Пример:** Очистка базы, обновление конкретных данных.

