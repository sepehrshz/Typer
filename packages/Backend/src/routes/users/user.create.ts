import { FastifyPluginAsync } from "fastify";
import { UserType, PracticeType } from "./schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { request } from "http";

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
        const { userName, accessToken } = request.body;

        await jwt.verify(
          accessToken!,
          process.env.ACCESS_TOKEN_SECRET!,
          (error, user) => {
            if (error) throw new Error("Token invalid!");
          }
        );

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

  //practice API
  fastify.post<{ Body: PracticeType; Reply: PracticeType }>(
    "/lessons/:id",
    async (request, reply) => {
      try {
        const { userId, lessonId, avgSpeed, isComplete, accessToken } =
          request.body;

        const info = {
          userId: userId,
          lessonId: lessonId,
          userLessonId: userId + lessonId.toString(),
          avgSpeed: avgSpeed,
          isComplete: isComplete,
          isEnable: true,
        };

        await jwt.verify(
          accessToken!,
          process.env.ACCESS_TOKEN_SECRET!,
          (error, user) => {
            if (error) throw new Error("Token invalid!");
          }
        );

        const updatePractice = await fastify.prisma.practice.upsert({
          where: {
            userLessonId: info.userLessonId,
          },
          update: info,
          create: info,
        });
        console.log(updatePractice);
        reply.send(updatePractice);
      } catch (error) {
        console.error(error);
        reply.status(500);
      }
    }
  );

  //lessons API
  fastify.post<{
    Body: { userName: string; accessToken: string };
    Reply: {
      practice: {
        isComplete: boolean;
      }[];
      id: number;
      name: string;
    }[];
  }>("/lessons", async (request, reply) => {
    try {
      const { userName, accessToken } = request.body;

      await jwt.verify(
        accessToken!,
        process.env.ACCESS_TOKEN_SECRET!,
        (error, user) => {
          if (error) throw new Error("Token invalid!");
        }
      );

      const lessons = await fastify.prisma.lesson.findMany({
        select: {
          id: true,
          name: true,
          practice: {
            select: {
              isComplete: true,
            },
            where: {
              userId: userName,
            },
          },
        },
      });

      console.log(lessons);
      reply.send(lessons);
    } catch (error) {
      console.error(error);
      reply.status(500);
    }
  });
  const generateAccessToken = (user: {
    id: string;
    userName: string;
    email: string;
    name: string;
    password: string;
    avgSpeed: number;
  }) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!);
    // ,}
    // expiresIn: "120s",
    // });
  };
};

export default userRoutes;
