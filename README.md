# Dashboard Builder

Конструктор дашбордов: пользователь собирает дашборд из готовых виджетов, меняет раскладку (drag & drop / resize) и сохраняет конфигурацию. Основной акцент задания — качество архитектуры, а не объём фич.

Данные — [REST Countries API v5](https://restcountries.com/) (прокси через Next.js Route Handler, ключ API не попадает на клиент).

## Демо

| Окружение   | Ссылка |
|-------------|--------|
| Development | _TODO: ссылка на deploy_ |
| Production  | _TODO: ссылка на deploy_ |

## Стек

- React 18, TypeScript, Next.js App Router
- TanStack React Query — серверные данные
- Zustand — клиентское состояние дашборда
- SCSS Modules
- Feature-Sliced Design (FSD)
- Zod — валидация ответов API
- `react-grid-layout` — сетка виджетов

## Возможности

- Каталог виджетов и добавление на дашборд
- Удаление виджетов
- Drag & drop и resize раскладки
- Сохранение конфигурации в `localStorage` и восстановление после перезагрузки
- Умное размещение новых виджетов (свободная колонка, если есть место)

### Виджеты

| Виджет | Назначение |
|--------|------------|
| **Table** | Таблица стран (мультивыбор) |
| **Statistics** | Метрика населения по выбранной стране |
| **Chart** | Население по регионам |
| **News card** | Краткая карточка-брифинг по стране |

Источник данных общий: топ-100 стран по населению. Наборы опций в селектах зависят от окружения (см. ниже).

## Архитектура (FSD)

```
app/                  # Next.js App Router (страницы, layout, API routes)
1_widgets/            # Композиция экрана: Header, Dashboard, Footer
2_features/           # Сценарии: dashboard store, feature-виджеты с логикой
3_entities/           # Домен: country API/query/mappers, UI виджетов без бизнес-логики
4_shared/             # API-утилиты, configs, UI-примитивы, стили
```

### Почему FSD

- Слои с однонаправленными зависимостями: `app → widgets → features → entities → shared`
- Серверные данные (React Query) живут в `entities`, UI-конфиг дашборда — в `features`
- `shared` без доменной логики: транспорт запросов, env, общие компоненты
- Feature-виджеты тонкие: хуки с настройками/лимитами + entity UI для отображения

## Принятые решения

1. **Zustand только для дашборда**  
   Layout, список виджетов и их settings. Кеш API — в React Query, без дублирования.

2. **React Query для стран — разные keys под разные ресурсы**  
   - **Catalog** (`/api/countries/catalog`) — лёгкий список name + alpha-3 + region для селектов  
   - **Detail** (`/codes.alpha_3/{code}`) — Metric / News / строки Table  
   - **By region** (`?region=`) — Chart  
   Один и тот же key шарится; смена страны/региона = отдельный запрос (повтор — из кеша).

3. **Прокси `/api/countries`**  
   `API_KEY` и upstream URL — только на сервере (`serverEnvConfig`). Клиент ходит на `NEXT_PUBLIC_APP_API_BASE_URL`.

4. **Один light-catalog, разные лимиты UI + разные data-query**  
   Dev/prod делят один catalog top-100; в development короче селекты. Данные виджетов не берутся из catalog — только из detail/region queries.

5. **Persist + `skipHydration`**  
   Конфиг в `localStorage` (`dashboard-config-v4`), ручная rehydrate после монтирования — без рассинхрона SSR/клиента.

6. **Размещение виджетов**  
   При добавлении ищется первая свободная ячейка (слева направо, сверху вниз), а не всегда новая строка.

## Окружения

Не только разные названия — разное поведение через env и `featureConfig` (feature flags).

| | Development | Production |
|---|-------------|------------|
| `NEXT_PUBLIC_APP_ENV` | `development` | `production` |
| Metric / News (селект) | top 5 catalog | полный catalog |
| Table (мультивыбор) | top 5 + detail queries | полный catalog + detail |
| Chart (регионы) | 3 + `?region=` | все регионы + `?region=` |
| Debug panel / метка в UI | по флагу `NEXT_PUBLIC_ENABLE_DEBUG_PANEL` | обычно выключен / Production |

Секретный ключ: `API_KEY` (без `NEXT_PUBLIC_`). Upstream: `REST_COUNTRIES_API_BASE_URL`.

**Про «разные API endpoints» из ТЗ.** Источник данных один — публичный REST Countries v5; отдельного staging/prod API у провайдера нет, поэтому клиентский proxy и upstream URL совпадают в обоих окружениях. Отличие env здесь сознательно через feature flags и UI (лимиты селектов, debug-панель), а не через второй фейковый бэкенд. В проде с реальным staging/prod API те же `envConfig` / `serverEnvConfig` просто указывали бы на разные base URL без смены архитектуры.

## Запуск локально

```bash
npm install
cp env.example .env
# заполнить API_KEY и при необходимости остальные переменные
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm run start   # production-сборка локально
```

Пример переменных — в `env.example`.

### Deploy

Два отдельных деплоя (Vercel / Railway / Render и т.п.), у каждого свой набор env. GitHub Pages не подходит из‑за SSR/API routes Next.js.

## Использование AI

Над проектом работали с AI-ассистентом (Cursor): архитектура, FSD-разбиение, API-прокси, виджеты, env-различия, рефакторинг и документация. Решения и структура ревьюились вручную; финальная ответственность за код и соответствие ТЗ — за автором.

---

## Что можно улучшить

При дополнительном времени:

- **Дизайн** — более цельная визуальная система, типографика, отступы, состояния пустых экранов
- **UX-friendly компоненты** — удобнее селекты, подсказки, анимации добавления/удаления, мобильная раскладка сетки
- **TanStack Table** — сортировка, фильтрация, пагинация и виртуализация для Table-виджета вместо простой HTML-таблицы
- **Виртуализация селектов** — виртуальный список опций в Select / MultiSelect (например, TanStack Virtual), чтобы длинный catalog в prod не тормозил DOM

<!-- сюда можно дописать пункты -->
