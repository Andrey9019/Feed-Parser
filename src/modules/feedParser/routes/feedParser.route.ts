import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { schema } from "../schemas/getFeedData.schema";
import { type Feed, parseFeed } from "../services/feedParser.service";

export async function getFeedDataRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.get(
    "/feed",
    {
      schema: schema,
    },
    async (request, reply) => {
      try {
        const { url } = request.query as { url?: string };
        const effectiveUrl = url || fastify.config.DEFAULT_RSS_URL;
        const feed: Feed = await parseFeed(fastify, effectiveUrl);
        reply.send(feed);
      } catch (err) {
        reply.status(500).send({ error: "Failed to fetch feed data" });
      }
    }
  );
}
