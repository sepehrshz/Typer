import autoLoad from "@fastify/autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fastify, { FastifyInstance } from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyPrismaClient from "fastify-prisma-client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: FastifyInstance = fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

//@ts-ignore
await app.register(fastifyPrismaClient);

app.register(autoLoad, {
  dir: join(__dirname, "plugins"),
});

app.register(autoLoad, {
  dir: join(__dirname, "routes"),
});

app.listen({ port: 3000 });
