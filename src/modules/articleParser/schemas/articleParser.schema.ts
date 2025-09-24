export const schema = {
  tags: ["article"],
  summary: "Parse article data",
  description: "Fetches and parses article data from a specified URL.",
  querystring: {
    type: "object",
    properties: {
      url: { type: "string", format: "uri" },
    },
    required: ["url"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        title: { type: "string" },
        image: { type: "string" },
        content: { type: "string" },
      },
      required: ["title", "content", "image"],
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
} as const;
