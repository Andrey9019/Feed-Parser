import type { FromSchema } from "json-schema-to-ts";

export const EnvSchema = {
  type: "object",
  properties: {
    PORT: { type: "number" },
    HOST: { type: "string" },
    DEFAULT_RSS_URL: { type: "string", format: "uri" },
    JWT_SECRET: { type: "string" },
  },
  required: ["PORT", "HOST", "DEFAULT_RSS_URL"],
  additionalProperties: false,
} as const;

export type Config = FromSchema<typeof EnvSchema>;
