import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { schema } from "../schemas/getFeedData.schema";
import { parseFeed } from "../services/feedParser.service";

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
        if (url && !url.match(/^https?:\/\/.+/)) {
          return reply.status(400).send({ error: "Invalid URL format" });
        }

        const effectiveUrl = url || "https://feeds.bbci.co.uk/ukrainian/rss.xml";
        const feed = await parseFeed(effectiveUrl);
        reply.send(feed);
      } catch (err) {
        reply.status(500).send({ error: "Failed to fetch feed data" });
      }
    },
  );
}
