import type { FastifyInstance } from "fastify";
import Parser from "rss-parser";

const parser = new Parser();

interface ItemFeed {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  isoDate?: string;
  [key: string]: unknown;
}

export interface Feed {
  title?: string;
  description?: string;
  items: ItemFeed[];
  [key: string]: unknown;
}

export async function parseFeed(
  fastify: FastifyInstance,
  url: string
): Promise<Feed> {
  try {
    fastify.log.info(`Parsing RSS feed: ${url}`);
    const feed = await parser.parseURL(url);
    fastify.log.info(`Parsed feed successfully: ${feed.title || "No title"}`);
    return feed;
  } catch (error) {
    fastify.log.error("Error parsing feed:", error);
    throw error;
  }
}
