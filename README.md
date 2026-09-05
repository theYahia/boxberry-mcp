> ## 🗄 Репозиторий заархивирован
>
> Разработка переехала в **[theYahia/WWmcp](https://github.com/theYahia/WWmcp)** — монорепозиторий MCP-серверов для незападных API: СНГ, MENA, Африка, LATAM, Юго-Восточная Азия. Общее ядро `@theyahia/mcp-core`, единый CI, единый релизный конвейер.
>
> Актуальная версия того, что лежало здесь: [`servers/boxberry/`](https://github.com/theYahia/WWmcp/tree/main/servers/boxberry)
>
> Пакет в npm прежний — [`@theyahia/boxberry-mcp`](https://www.npmjs.com/package/@theyahia/boxberry-mcp), ставится и работает как раньше.
> Здесь больше ничего не обновляется. Задачи и pull request'ы — в WWmcp.
>
> **Archived — development moved to [theYahia/WWmcp](https://github.com/theYahia/WWmcp),** a monorepo of MCP servers for non-Western APIs.
> The current version of this package now lives at [`servers/boxberry/`](https://github.com/theYahia/WWmcp/tree/main/servers/boxberry).
> The npm package [`@theyahia/boxberry-mcp`](https://www.npmjs.com/package/@theyahia/boxberry-mcp) is unchanged.
> Please open issues and pull requests there.

# Boxberry MCP — расчёт доставки и пункты выдачи в диалоге с нейросетью

Если вы искали, как посчитать стоимость доставки Boxberry обычным вопросом, найти ближайший пункт выдачи в городе клиента или отследить посылку по трек-номеру не заходя в личный кабинет — это оно. 6 инструментов поверх API Boxberry: города, пункты выдачи, расчёт доставки, отслеживание, проверка индекса и список услуг.

## Возможности (6 инструментов)

| Инструмент | Описание |
|---|---|
| `list_cities` | Список городов Boxberry с поиском по названию |
| `list_points` | Пункты выдачи в указанном городе |
| `calc_delivery` | Расчёт стоимости и сроков доставки |
| `track` | Отслеживание отправления по трек-номеру |
| `zip_check` | Проверка почтового индекса на зону доставки |
| `list_services` | Список оказанных услуг по отправлению |

## Быстрый старт (stdio)

```json
{
  "mcpServers": {
    "boxberry": {
      "command": "npx",
      "args": ["-y", "@theyahia/boxberry-mcp"],
      "env": {
        "BOXBERRY_API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## HTTP-транспорт (Streamable HTTP)

```bash
BOXBERRY_API_TOKEN=<TOKEN> npx @theyahia/boxberry-mcp --http
# Endpoint: http://localhost:3000/mcp
# Health:   http://localhost:3000/health
```

Порт настраивается через `PORT`:

```bash
PORT=8080 BOXBERRY_API_TOKEN=<TOKEN> npx @theyahia/boxberry-mcp --http
```

## Smithery

Файл `smithery.yaml` включён. Требует `BOXBERRY_API_TOKEN`.

## Переменные окружения

| Переменная | Обязательная | Описание |
|---|---|---|
| `BOXBERRY_API_TOKEN` | Да | API-токен из личного кабинета Boxberry |
| `PORT` | Нет | Порт для HTTP-транспорта (по умолчанию 3000) |

## Skills (Claude Code)

| Skill | Описание |
|---|---|
| `/skill-track <трек>` | Отследить посылку Boxberry |
| `/skill-calculate <город> <вес>` | Расчёт стоимости доставки |
| `/delivery <город> <вес>` | Полный цикл: город → ПВЗ → расчёт |

## Разработка

```bash
npm install
npm run build
npm test
BOXBERRY_API_TOKEN=<TOKEN> npm run dev
```

## Лицензия

MIT

---

Telegram: [@vhodvai](https://t.me/vhodvai)
