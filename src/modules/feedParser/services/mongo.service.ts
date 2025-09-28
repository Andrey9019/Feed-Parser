// import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../prisma/client";
import type { FastifyInstance } from "fastify";
import type { Feed, NewsItem } from "../types";

// const prisma = new PrismaClient();

export async function getFeedFromDB(
  fastify: FastifyInstance,
  url: string
): Promise<NewsItem[] | null> {
  fastify.log.info(`Attempting to get feed from DB: ${url}`);
  try {
    fastify.log.info(`Getting feed from DB: ${url}`);
    const dbItems = await prisma.news.findMany({
      orderBy: {
        pubDate: "desc",
      },
      take: 50,
      // where: { link: { contains: url } },
    });
    if (dbItems.length === 0) {
      fastify.log.info("No news items found in the database.");
      return null;
    }
    fastify.log.info("Found ${dbItems.length} items in the database.");
    return dbItems.map((item) => ({
      title: item.title,
      link: item.link,
      image: item.image,
      pubDate: item.pubDate.toISOString(),
      contentSnippet: item.contentSnippet || "",

      content: item.contentSnippet || "",
      isoDate: item.pubDate.toISOString(),
    }));
  } catch (error) {
    fastify.log.error(`Error getting feed from DB: ${url}`, error);
  }
  return null;
}

export async function saveFeedToDB(
  fastify: FastifyInstance,
  feed: Feed
): Promise<void> {
  fastify.log.info(
    `[DB SAVE] Starting to save ${feed.items.length} items for feed: ${feed.title}`
  );
  try {
    for (const item of feed.items) {
      fastify.log.info(`[DB SAVE] Upserting item: ${item.link}`);
      await prisma.news.upsert({
        where: { link: item.link },
        update: {
          title: item.title || "",
          image: item.image || "",
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          contentSnippet: item.contentSnippet || null,
        },
        create: {
          title: item.title || "",
          link: item.link,
          image: item.image || "",
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          contentSnippet: item.contentSnippet || null,
        },
      });
    }
    fastify.log.info(`[DB SAVE] Finished saving items for feed: ${feed.title}`);
  } catch (error) {
    fastify.log.error("[DB SAVE] Error during upsert process:", error);
  }
}
