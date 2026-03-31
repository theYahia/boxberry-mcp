#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { listCitiesSchema, handleListCities } from "./tools/cities.js";
import { listPointsSchema, handleListPoints } from "./tools/points.js";
import { calcDeliverySchema, handleCalcDelivery } from "./tools/calculate.js";
import { trackSchema, handleTrack } from "./tools/tracking.js";

const server = new McpServer({ name: "boxberry-mcp", version: "1.0.1" });

server.tool("list_cities", "Список городов Boxberry с возможностью поиска по названию.", listCitiesSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListCities(params) }] }));

server.tool("list_points", "Список пунктов выдачи Boxberry в указанном городе.", listPointsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListPoints(params) }] }));

server.tool("calc_delivery", "Расчёт стоимости и сроков доставки Boxberry.", calcDeliverySchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCalcDelivery(params) }] }));

server.tool("track", "Отслеживание отправления Boxberry по трек-номеру.", trackSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleTrack(params) }] }));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[boxberry-mcp] Сервер запущен. 4 инструмента.");
}

main().catch((error) => { console.error("[boxberry-mcp] Ошибка:", error); process.exit(1); });
