import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { schema } from "../schemas/getFeedData.schema";
import { type Feed, parseFeed } from "../services/feedParser.service";
import { getFeedFromDB, saveFeedToDB } from "../services/mongo.service";

export async function getFeedDataRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.get(
    "/feed",
    {
      schema: schema,
    },
    async (request, reply) => {
      fastify.log.info("Handling /feed request");
      try {
        const { url, force } = request.query as {
          url?: string;
          force?: number;
        };
        const effectiveUrl = url || fastify.config.DEFAULT_RSS_URL;
        fastify.log.info(`Effective URL: ${effectiveUrl}, Force: ${force}`);

        if (force === 1) {
          fastify.log.info("Force mode: parsing feed");
          const feed: Feed = await parseFeed(fastify, effectiveUrl);
          reply.send(feed);
          saveFeedToDB(fastify, effectiveUrl, feed);
          return;
        }

        const feedFromDB = await getFeedFromDB(fastify, effectiveUrl); //
        if (!feedFromDB) {
          fastify.log.info("Feed not in DB, parsing...");
          const feed: Feed = await parseFeed(fastify, effectiveUrl);
          reply.send(feed);
          saveFeedToDB(fastify, effectiveUrl, feed);
          return;
        }
        fastify.log.info("Returning feed from DB");
        reply.send(feedFromDB);
      } catch (err) {
        fastify.log.error(`Error in /feed: ${err}`);
        reply.status(500).send({ error: "Failed to fetch feed data" });
      }
    },
  );
}
