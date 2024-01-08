import { FastifyPluginAsync } from "fastify";
import { UserType } from "./schema.js";


const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.post<{ Body: UserType; Reply: UserType }>(
    "/",
    async function (request, reply) {
      console.log()
      reply.send({ name: "arthur" });
    },
  );

};

export default users;
