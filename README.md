# boxberry-mcp

MCP-сервер для API Boxberry — поиск городов, пунктов выдачи, расчёт доставки, отслеживание.

## Возможности (4 инструмента)

| Инструмент | Описание |
|---|---|
| `list_cities` | Список городов Boxberry |
| `list_points` | Пункты выдачи в городе |
| `calc_delivery` | Расчёт стоимости доставки |
| `track` | Отслеживание отправления |

## Быстрый старт

```json
{
  "mcpServers": {
    "boxberry": {
      "command": "npx",
      "args": ["-y", "@theyahia/boxberry-mcp"],
      "env": {
        "BOXBERRY_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## Переменные окружения

| Переменная | Обязательная | Описание |
|---|---|---|
| `BOXBERRY_TOKEN` | Да | API-токен из личного кабинета Boxberry |

## Лицензия

MIT
