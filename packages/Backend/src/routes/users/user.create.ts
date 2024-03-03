import { FastifyPluginAsync } from "fastify";
import { UserType } from "./schema.js";

const userRoutes: FastifyPluginAsync = async (fastify, opts) => {
  fastify.post<{ Body: UserType; Reply: UserType }>(
    "/signup",
    async (request, reply) => {
      try {
        const { userName, email, name, password } = request.body;

        const user = await fastify.prisma.user.findFirst({
          where: {
            OR: [{ email: email }, { userName: userName }],
          },
        });

        if (user?.email === email) {
          throw new Error("Email has already taken");
        }

        if (user?.userName === userName) {
          throw new Error("Username has already taken");
        }

        const newUser = await fastify.prisma.user.create({
          data: {
            email,
            name,
            userName,
            password,
          },
        });

        reply.send(newUser);
      } catch (error) {
        console.error(error);
        reply.status(500);
      }
    }
  );

  fastify.post<{ Body: UserType; Reply: UserType }>(
    "/login",
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        const user = await fastify.prisma.user.findFirst({
          where: {
            OR: [{ email: email }, { userName: email }],
          },
        });
        if (!user) {
          throw new Error("Invalid email or username");
        }

        if (user.password !== password) {
          throw new Error("Incorrect password");
        }

        reply.send(user);
      } catch (error) {
        console.error(error);
        reply.status(500);
      }
    }
  );
};

export default userRoutes;
