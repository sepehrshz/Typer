import { FastifyPluginAsync } from "fastify";
import { UserType } from "./schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRoutes: FastifyPluginAsync = async (fastify, opts) => {
  // const authenticateToken = (req, res, next) => {
  //   const authHeader: string = req.body.accessToken;
  //   const token = authHeader;
  //   if (token == null) return res.sendStatus(401);

  //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || " ", (error, user) => {
  //     if (error) return res.sendStatus(403);
  //     req.user = user;
  //     next();
  //   });
  // };

  const refreshTokens = [];

  //signup API
  fastify.post<{ Body: UserType; Reply: UserType }>(
    "/signup",
    async (request, reply) => {
      try {
        const { userName, email, name } = request.body;
        let password = request.body.password;
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

        password = await bcrypt.hash(password, 10);

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
  fastify.post<{ Body: UserType; Reply: [UserType, string, string] }>(
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

        const result = await bcrypt.compare(password, user.password);

        if (!result) {
          throw new Error("Incorrect password");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!);
        refreshTokens.push(refreshToken);
        reply.send([user, accessToken, refreshToken]);
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
        const { prevUserName, userName, email, name, password, accessToken } =
          request.body;

        const info = {
          name: name,
          email: email,
          userName: userName,
        };

        // if (password != "") {
        //   info.password = await bcrypt.hash(password, 10);
        // }

        await jwt.verify(
          accessToken!,
          process.env.ACCESS_TOKEN_SECRET!,
          (error, user) => {
            if (error) throw new Error("Token invalid!");
          }
        );

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

  const generateAccessToken = (user: {
    id: string;
    userName: string;
    email: string;
    name: string;
    password: string;
    avgSpeed: number;
  }) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "120s",
    });
  };
};

export default userRoutes;
