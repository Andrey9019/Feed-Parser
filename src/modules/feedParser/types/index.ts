export interface NewsItem {
  title: string;
  link: string;
  image: string;
  pubDate: string;
  contentSnippet: string;
  content: string;
  isoDate: string;
  [key: string]: unknown;
}

export interface Feed {
  title: string;
  items: NewsItem[];
  [key: string]: unknown;
}
