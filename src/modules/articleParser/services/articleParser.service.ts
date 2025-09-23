import type { FastifyInstance } from "fastify";
// import { fromURL, load } from "cheerio";
import * as cheerio from "cheerio";

export interface Article {
  title: string;
  image?: string;
  content: string;
}

export async function parseArticle(
  fastify: FastifyInstance,
  url: string
): Promise<Article> {
  fastify.log.info(`Parsing article: ${url}`);
  try {
    const $ = await cheerio.fromURL(url);

    const title = $("h1").text();
    const image = $("article img").attr("src");
    const content = $(".storytext p")
      .map((_, p) => {
        const text = $(p).text().trim();

        return text &&
          !text.includes("hide caption") &&
          !text.includes("FILE -") &&
          !text.includes("/AP/")
          ? text
          : null;
      })
      .get()
      .filter(Boolean)
      .join(" ");

    fastify.log.info(`Parsed article title: ${title}`);
    fastify.log.info(`Parsed article image: ${image}`);
    fastify.log.info(`Parsed article content: ${content}`);
    return { title, image, content };
  } catch (error) {
    fastify.log.error(`Error parsing article: ${url}`, error);
    throw error;
  }
}
