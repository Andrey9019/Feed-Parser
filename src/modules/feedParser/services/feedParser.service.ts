import type { FastifyInstance } from "fastify";
import Parser, { type Item } from "rss-parser";
import { getFeedFromDB, saveFeedToDB } from "./mongo.service";

const parser = new Parser();

export interface NewsItem {
  title: string;
  link: string;
  image?: string;
  pubDate: string;
  contentSnippet: string;
  description: string;
  content: string;
  isoDate: string;
  [key: string]: unknown;
}

export interface Feed {
  title: string;
  description?: string;
  image?: string;
  items: NewsItem[];
  [key: string]: unknown;
}

export async function parseFeed(
  fastify: FastifyInstance,
  url: string
): Promise<Feed | null> {
  try {
    const feed = await parser.parseURL(url);

    return {
      title: feed.title || "Newss Feed",
      description: feed.description || "",
      link: feed.link || url,
      items: feed.items.map((item: Item) => ({
        title: item.title || "",
        link: item.link || "",
        image: item.enclosure?.url,
        pubDate: item.pubDate || new Date().toUTCString(),
        contentSnippet: item.contentSnippet || "",
        description: item.contentSnippet || "",
        content: item.content || "",
        isoDate: item.isoDate || "",
      })),
    };
  } catch (error) {
    fastify.log.error(`Error parsing feed: ${error}`);
    return null;
  }
}

export async function getOrParseFeed(
  fastify: FastifyInstance,
  url: string,
  force?: number
): Promise<Feed> {
  fastify.log.info(`Processing feed for URL: ${url}, Force: ${force}`);
  if (force === 1) {
    fastify.log.info("Force mode: parsing feed");
    const feed = await parseFeed(fastify, url);
    if (!feed) {
      throw new Error("Failed to parse feed");
    }
    await saveFeedToDB(fastify, feed);
    return feed;
  }

  const newsItems = await getFeedFromDB(fastify, url);
  if (!newsItems) {
    fastify.log.info("No news items in DB, parsing...");
    const feed = await parseFeed(fastify, url);
    if (!feed) {
      throw new Error("Failed to parse feed and no data in DB");
    }
    await saveFeedToDB(fastify, feed);
    return feed;
  }

  fastify.log.info("Returning news items from DB");
  return { title: "News Feed", items: newsItems };
}
