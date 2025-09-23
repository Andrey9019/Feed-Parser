import type { FastifyInstance } from "fastify";
import { parseArticle } from "../services/articleParser.service";

export async function articleParserRoutes(fastify: FastifyInstance) {
  fastify.get("/parse-article", async (request, reply) => {
    const { url } = request.query as { url: string };
    const article = await parseArticle(fastify, url);
    return reply.send(article);
  });
}
