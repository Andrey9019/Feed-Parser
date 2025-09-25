import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import type { User } from "../types";

const prisma = new PrismaClient();

export async function registerUser(
  fastify: FastifyInstance,
  body: { email: string; password: string; name: string }
): Promise<User> {
  const { email, password, name } = body;
  fastify.log.info(`Registering user: ${email}`);
  try {
    const hashedPassword = await fastify.bcrypt.hash(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    fastify.log.info(`User registered: ${email}`);
    return { id: user.id, email: user.email, name: user.name };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    fastify.log.error(`Error registering user: ${message}`);
    throw new Error(`Registration failed: ${message}`);
  }
}

export async function loginUser(
  fastify: FastifyInstance,
  body: { email: string; password: string }
): Promise<{
  token: string;
  user: { id: string; email: string; name: string };
}> {
  const { email, password } = body;
  fastify.log.info(`[Auth] Logging in user: ${email}`);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    fastify.log.warn(`[Auth] Invalid credentials for ${email}: User not found`);
    throw new Error("Invalid credentials");
  }

  const isValid = await fastify.bcrypt.compare(password, user.password);
  if (!isValid) {
    fastify.log.warn(`[Auth] Invalid credentials for ${email}: Wrong password`);
    throw new Error("Invalid credentials");
  }

  const token = fastify.jwt.sign({ userId: user.id, email: user.email });
  const response = {
    token,
    user: { id: user.id, email: user.email, name: user.name },
  };
  fastify.log.info(`[Auth] User logged in: ${email}`);
  return response;
}
