export const registrSchema = {
  description: 'Register a new user in the system',
  tags: ['Auth'],
  summary: 'Creates a new user account with email, password, and name',
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" ,description: 'User email address'},
      password: { type: "string", minLength: 6,description: 'User password (minimum 6 characters)' },
      name: { type: "string" ,description: 'User display name'},
    },
    required: ["email", "password", "name"],
    additionalProperties: false,
  },
  response: {
    201: {
      description: 'Successful registration',
      type: "object",
      properties: {
        id: { type: "string" ,description: 'Successful registration',},
        email: { type: "string",description: 'User email address', example: 'user@test.com',},
        name: { type: "string",description: 'User display name',
          example: 'User Test', },
      },
    },
    400: {
      description: 'Bad request (e.g., email already exists or invalid input)',
      type: "object",
      properties: {
        error: { type: "string" ,description: 'Error message',
          example: 'Registration failed: Email already exists',},
      },
    },
  },

};

export const loginSchema = {
description: 'Login a user and return a JWT token with user details',
  tags: ['Auth'],
  summary: 'Authenticates a user and returns a JWT token and user information',
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email",description: 'User email address', },
      password: { type: "string", minLength: 6,description: 'User password (minimum 6 characters)', },
    },
    required: ["email", "password"],
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        token: { type: "string" ,description: 'JWT token for authentication',},
      },
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" ,description: 'Error message', example: 'Invalid email or password',},
      },
    },
  },
};
