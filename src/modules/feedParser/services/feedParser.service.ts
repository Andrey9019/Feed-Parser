import Parser from "rss-parser";

const parser = new Parser();

export interface ItemFeed {
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

export async function parseFeed(url: string): Promise<Feed> {
  try {
    const feed = await parser.parseURL(url);
    return feed;
  } catch (error) {
    console.error("Error parsing feed:", error);
    throw error;
  }
}
