export const registrSchema = {
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
      name: { type: "string" },
    },
    required: ["email", "password", "name"],
    additionalProperties: false,
  },
  response: {
    201: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
      },
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const loginSchema = {
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
    required: ["email", "password"],
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        token: { type: "string" },
      },
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};
