export const schema = {
  tags: ["Article"],
  summary: "Parse article data",
  description: "Fetches and parses article data from a specified URL.",
  querystring: {
    type: "object",
    properties: {
      url: { type: "string", format: "uri", description: "The URL of the article to be parsed." },
    },
    required: ["url"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        title: { type: "string", description: "The title of the article." },
        image: { type: "string", description: "The image URL of the article." },
        content: { type: "string", description: "The full content of the article."   },
      },
      required: ["title", "content", "image"],
    },
    400: {
      description: "Bad request",
      type: "object",
      properties: {
        error: { type: "string", description: "Error message" },
      },
    },
    500: {
      description: "Internal server error", 
      type: "object",
      properties: {
        error: { type: "string", description: "Error message" },
      },
    },
  },
} as const;
