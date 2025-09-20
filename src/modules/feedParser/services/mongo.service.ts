import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { MongoClient } from "mongodb";
import type { Feed } from "./feedParser.service";

const prisma = new PrismaClient();
// const mongoClient = new MongoClient(process.env.DATABASE_URL!);
const mongoClient = new MongoClient("mongodb://localhost:27017");
const db = mongoClient.db("feed-parser");
const feedCollection = db.collection("feeds");

export async function getFeedFromDB(
  fastify: FastifyInstance,
  url: string
): Promise<Feed | null> {
  fastify.log.info(`Attempting to get feed from DB: ${url}`);
  try {
    fastify.log.info(`Getting feed from DB: ${url}`);
    const feed = await prisma.feed.findUnique({ where: { url } });
    if (feed) {
      fastify.log.info(`Feed found in DB: ${url}`);
      fastify.log.info(`Feed found in DB: ${feed}`);
      return feed.data as Feed;
    }
    fastify.log.info(`No feed found in DB: ${url}`);
  } catch (error) {
    fastify.log.error(`Error getting feed from DB: ${url}`, error);
  }
  return null;
}

export async function saveFeedToDB(
  fastify: FastifyInstance,
  url: string,
  data: Feed
): Promise<void> {
  fastify.log.info(`Attempting to save feed to DB: ${url}`);
  try {
    await mongoClient.connect();
    const existingFeed = await prisma.feed.findUnique({ where: { url } });
    if (existingFeed) {
      fastify.log.info(`Feed already exists in DB: ${url}`);
      await feedCollection.updateOne(
        { url },
        { $set: { data, updatedAt: new Date() } }
      );
    } else {
      fastify.log.info(`Creating new feed in DB: ${url}`);
      await feedCollection.insertOne({
        url,
        data,
        updatedAt: new Date(),
      });
    }
    fastify.log.info(`Saving feed to DB: ${url}`);

    fastify.log.info(`Feed saved to DB: ${url}`);
  } catch (error) {
    fastify.log.error(`Error saving feed to BD${error}`);
  }
}
