import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { loginUser, registerUser } from "../services/auth.service";
import { loginSchema, registrSchema } from "../schemas/auth.schema";

export async function authRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.post<{ Body: { email: string; password: string; name: string } }>(
    "/register",
    { schema: registrSchema },
    async (request, reply) => {
      // const { email, password, name } = request.body;
      const user = await registerUser(fastify, request.body);
      reply.code(201);
      return reply.send(user);
    }
  );

  route.post<{ Body: { email: string; password: string } }>(
    "/login",
    { schema: loginSchema },
    async (request, reply) => {
      // const { email, password } = request.body;
      const result = await loginUser(fastify, request.body);
      fastify.log.info(`Login response: ${JSON.stringify(result)}`);
      return reply.send(result);
    }
  );
}
