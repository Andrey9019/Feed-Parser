import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface User {
  id: string;
  email: string;
  name: string;
}

export async function registerUser(
  fastify: FastifyInstance,
  email: string,
  password: string,
  name: string
): Promise<User> {
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
  email: string,
  password: string
): Promise<{ token: string }> {
  fastify.log.info(`Logging in user: ${email}`);
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await fastify.bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    const token = fastify.jwt.sign(
      { id: user.id, email: user.email },
      { expiresIn: "1h" }
    );
    fastify.log.info(`User logged in: ${email}`);
    fastify.log.info(`token type: ${typeof token}, value: ${token}`);
    return { token: token as string };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    fastify.log.error(`Error logging in user: ${message}`);
    throw new Error(`Login failed: ${message}`);
  }
}
