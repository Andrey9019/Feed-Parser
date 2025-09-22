import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { schema } from "../schemas/getFeedData.schema";
import { getOrParseFeed } from "../services/feedParser.service";

export async function getFeedDataRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.get("/feed", { schema: schema }, async (request) => {
    const { url, force } = request.query;
    const effectiveUrl = url ?? fastify.config.DEFAULT_RSS_URL;
    const data = await getOrParseFeed(fastify, effectiveUrl, force);
    return data;
  });
}
