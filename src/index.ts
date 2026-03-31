#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { listCitiesSchema, handleListCities } from "./tools/cities.js";
import { listPointsSchema, handleListPoints } from "./tools/points.js";
import { calcDeliverySchema, handleCalcDelivery } from "./tools/calculate.js";
import { trackSchema, handleTrack } from "./tools/tracking.js";
import { zipCodesSchema, handleZipCodes } from "./tools/zip-codes.js";
import { listServicesSchema, handleListServices } from "./tools/services.js";

const TOOL_COUNT = 6;

function createServer(): McpServer {
  const server = new McpServer({ name: "boxberry-mcp", version: "1.1.0" });

  server.tool("list_cities", "Список городов Boxberry с возможностью поиска по названию.", listCitiesSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleListCities(params) }] }));

  server.tool("list_points", "Список пунктов выдачи Boxberry в указанном городе.", listPointsSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleListPoints(params) }] }));

  server.tool("calc_delivery", "Расчёт стоимости и сроков доставки Boxberry.", calcDeliverySchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleCalcDelivery(params) }] }));

  server.tool("track", "Отслеживание отправления Boxberry по трек-номеру.", trackSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleTrack(params) }] }));

  server.tool("zip_check", "Проверка почтового индекса на доступность доставки Boxberry.", zipCodesSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleZipCodes(params) }] }));

  server.tool("list_services", "Список оказанных услуг по отправлению Boxberry.", listServicesSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleListServices(params) }] }));

  return server;
}

async function main() {
  const server = createServer();
  const useHttp = process.argv.includes("--http");

  if (useHttp) {
    const { StreamableHTTPServerTransport } = await import(
      "@modelcontextprotocol/sdk/server/streamableHttp.js"
    );
    const { createServer: createHttpServer } = await import("node:http");
    const { randomUUID } = await import("node:crypto");

    const port = parseInt(process.env.PORT ?? "3000", 10);

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
    });

    const httpServer = createHttpServer(async (req, res) => {
      const url = new URL(req.url ?? "/", `http://localhost:${port}`);

      if (url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", tools: TOOL_COUNT }));
        return;
      }

      if (url.pathname === "/mcp") {
        await transport.handleRequest(req, res);
        return;
      }

      res.writeHead(404);
      res.end("Not found");
    });

    await server.connect(transport);
    httpServer.listen(port, () => {
      console.error(`[boxberry-mcp] HTTP server on port ${port}. ${TOOL_COUNT} tools. Endpoint: /mcp`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`[boxberry-mcp] Stdio server started. ${TOOL_COUNT} tools.`);
  }
}

export { createServer };

main().catch((error) => { console.error("[boxberry-mcp] Error:", error); process.exit(1); });
