import { FastifyPluginAsync } from "fastify";
import { UserType } from "./schema.js";
import bcrypt from "bcrypt";

const userRoutes: FastifyPluginAsync = async (fastify, opts) => {
  //signup API
  fastify.post<{ Body: UserType; Reply: UserType }>(
    "/signup",
    async (request, reply) => {
      try {
        const { userName, email, name, pass } = request.body;

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

        const hashedPassword = await bcrypt.hash(pass, 10);
        const password = hashedPassword;

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

  //login API
  fastify.post<{ Body: UserType; Reply: UserType }>(
    "/login",
    async (request, reply) => {
      try {
        const { email, pass } = request.body;
        const user = await fastify.prisma.user.findFirst({
          where: {
            OR: [{ email: email }, { userName: email }],
          },
        });
        if (!user) {
          throw new Error("Invalid email or username");
        }

        bcrypt.compare(pass, user.password, function (err, result) {
          if (!result) {
            throw new Error("Incorrect password");
          }
        });

        reply.send(user);
      } catch (error) {
        console.error(error);
        reply.status(500);
      }
    }
  );

  //edit profile API
  fastify.post<{ Body: UserType; Reply: UserType }>(
    "/edit",
    async (request, reply) => {
      try {
        const { prevUserName, userName, email, name, pass } = request.body;

        const info = {
          name: name,
          email: email,
          userName: userName,
        };

        if (pass != "") {
          console.log("lets hash");
          const hashedPassword = await bcrypt.hash(pass, 10);
          info.password = hashedPassword;
        }

        const updateUser = await fastify.prisma.user.update({
          where: {
            userName: prevUserName,
          },
          data: info,
        });

        reply.send(updateUser);
      } catch (error) {
        console.error(error);
        reply.status(500);
      }
    }
  );

  //delete account API
  fastify.post<{ Body: UserType; Reply: UserType }>(
    "/delete",
    async (request, reply) => {
      try {
        const userName = request.body.userName;

        const deleteUser = await fastify.prisma.user.delete({
          where: {
            userName: userName,
          },
        });

        reply.send(deleteUser);
      } catch (error) {
        console.error(error);
        reply.status(500);
      }
    }
  );
};

export default userRoutes;
