export const schema = {
  tags: ['Feed'],
  summary: "Get feed data",
  description: "Fetches and returns feed data from a specified URL.",
  querystring: {
    type: "object",
    properties: {
      url: { type: "string", format: "uri",description: 'RSS feed URL to fetch data from', },
      force: { type: "number", enum: [0, 1],description: 'Force refresh of the feed (1 to refresh, 0 to use cached data)', },
    },
    required: [],
  },
  response: {
    200: {
      description: 'Successful response with feed data',
      type: "object",
      properties: {
        title: { type: "string", description: 'Title of the feed' },
        description: { type: "string", description: 'Description of the feed' },
        items: {
          type: "array",
          items: {
            type: "object",
            description: 'List of news items in the feed',
            properties: {
              title: { type: "string", description: 'Title of the news item' },
              image: { type: "string", description: 'Image URL associated with the news item' },
              link: { type: "string", description: 'Link to the full news item' },
              pubDate: { type: "string", description: 'Publication date of the news item' },
              contentSnippet: { type: "string", description: 'Brief snippet of the news item content' },
              content: { type: "string", description: 'Full content of the news item' },
              isoDate: { type: "string", description: 'ISO date of the news item' },
            },
            required: [],
          },
        },
      },
      required: ["items"],
    },
    400: {
      description: 'Bad request (e.g., invalid URL)',
      type: "object",
      properties: {
        error: { type: "string", description: 'Error message' , example: 'Invalid URL'},
      },
    },
    500: {
      description: 'Internal server error',
      type: "object",
      properties: {
        error: { type: "string", description: 'Error message' , example: 'Failed to fetch feed data'},
      },
    },
  },
} as const;
