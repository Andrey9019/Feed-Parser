import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";

import { parseArticle } from "../services/articleParser.service";
import { schema } from "../schemas/articleParser.schema";

export async function articleParserRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.get("/parse-article", { schema: schema }, async (request) => {
    const { url } = request.query;
    const article = await parseArticle(fastify, url);
    return article;
  });
}
