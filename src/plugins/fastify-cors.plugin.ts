import fastifyCors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const pluginName = "fastify-cors-plugin";

export default fp(async (fastify: FastifyInstance) => {
	fastify.register(fastifyCors, {
		origin: [
			"http://localhost:5173",
			"https://news-feed-app-weld-zeta.vercel.app",
		],
		credentials: true,
	});

	fastify.pluginLoaded(pluginName);
});