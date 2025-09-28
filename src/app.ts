import Fastify, { type FastifyServerOptions } from "fastify";
import fastifyBcrypt from "fastify-bcrypt";
import AutoLoad from "@fastify/autoload";
import configPlugin from "./config";
import cors from "@fastify/cors";
import { join } from "node:path";
import jwt from "@fastify/jwt";

import { articleParserRoutes } from "./modules/articleParser/routes/articleParser.route";
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


  fastify.register(getFeedDataRoutes);

  await fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET || "supersecretkey",
  });
  await fastify.register(fastifyBcrypt, {
    saltWorkFactor: 12,
  });

  await fastify.register(authRoutes);

  await fastify.register(articleParserRoutes);

  // fastify.register(cors, { origin: "http://localhost:5173" });
  fastify.register(cors, {
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
  });

  return fastify;
}

export default buildApp;
