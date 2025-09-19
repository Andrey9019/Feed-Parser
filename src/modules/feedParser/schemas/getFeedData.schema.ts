export const schema = {
  tags: ["feed"],
  summary: "Get feed data",
  descpription: "Fetches and returns feed data from a specified URL.",

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
              description: { type: "string" },
              content: { type: "string" },
              contentSnippet: { type: "string" },
              guid: { type: "string" },
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
