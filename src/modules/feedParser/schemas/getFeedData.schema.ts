export const schema = {
  tags: ["feed"],
  summary: "Get feed data",
  description: "Fetches and returns feed data from a specified URL.",
  querystring: {
    type: "object",
    properties: {
      url: { type: "string", format: "uri" },
      force: { type: "number", enum: [0, 1] },
    },
    required: [],
  },
  response: {
    200: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              link: { type: "string" },
              pubDate: { type: "string" },
              contentSnippet: { type: "string" },
              description: { type: "string" },
              content: { type: "string" },
              isoDate: { type: "string" },
            },
            required: [],
          },
        },
      },
      required: ["items"],
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
