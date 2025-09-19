export const schema = {
  tags: ["feed"],
  summary: "Get feed data",
  descpription: "Fetches and returns feed data from a specified URL.",

  response: {
    200: {
      type: "object",
      properties: {
        hello: { type: "string" },
      },
    },
  },
} as const;
