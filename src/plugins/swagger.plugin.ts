import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const pluginName = "swagger-plugin";

export default fp(
	async (fastify: FastifyInstance) => {
		fastify.register(swagger, {
			openapi: {
				info: {
					title: "Server API",
					description: "API documentation for the Feed Parser server https://feed-parser-uqoi.onrender.com/",
					contact: {
						name: "Andrii Zirchenko",
						url: "https://github.com/Andrey9019",
					},
					version: "1.0.0",
				},
			},
		});

		fastify.register(swaggerUi, {
			routePrefix: "/docs",
			uiConfig: {
				docExpansion: "list",
				deepLinking: false,
			},
		});

		fastify.ready(() => {
			fastify.log.info("Swagger documentation successfully generated.");
		});

		fastify.pluginLoaded(pluginName);
	},
	{
		name: pluginName,
	},
);