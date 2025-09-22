import { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import Fastify, { type FastifyServerOptions } from "fastify";
import configPlugin from "./config";
import jwt from "@fastify/jwt";
import fastifyBcrypt from "fastify-bcrypt";

import { getFeedDataRoutes } from "./modules/feedParser/routes/feedParser.route";
import { authRoutes } from "./modules/auth/routes/auth.route";

export type AppOptions = Partial<FastifyServerOptions>;

async function buildApp(options: AppOptions = {}) {
  const fastify = Fastify({
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
    },
  });
  await fastify.register(configPlugin);

  try {
    fastify.decorate("pluginLoaded", (pluginName: string) => {
      fastify.log.info(`✅ Plugin loaded: ${pluginName}`);
    });

    fastify.log.info("Starting to load plugins");
    await fastify.register(AutoLoad, {
      dir: join(__dirname, "plugins"),
      options: options,
      ignorePattern: /^((?!plugin).)*$/,
    });

    fastify.log.info("✅ Plugins loaded successfully");
  } catch (error) {
    fastify.log.error("Error in autoload:", error);
    throw error;
  }

  fastify.get("/", async (_request, _reply) => {
    return { hello: "world" };
  });

  fastify.register(getFeedDataRoutes);

  await fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET || "supersecretkey",
  });
  await fastify.register(fastifyBcrypt, {
    saltWorkFactor: 12,
  });

  await fastify.register(authRoutes);

  return fastify;
}

export default buildApp;
