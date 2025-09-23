import type { FastifyInstance } from "fastify";
import { loginUser, registerUser } from "../services/auth.service";
import { loginSchema, registrSchema } from "../schemas/auth.schema";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/register",
    { schema: registrSchema },
    async (request, reply) => {
      const { email, password, name } = request.body as {
        email: string;
        password: string;
        name: string;
      };
      const user = await registerUser(fastify, email, password, name);
      return reply.send(user);
    }
  );

  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };
    const result = await loginUser(fastify, email, password);
    fastify.log.info(`Login response: ${JSON.stringify(result)}`);
    return reply.send(result);
  });
}
