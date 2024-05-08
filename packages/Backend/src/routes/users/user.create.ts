import { FastifyPluginAsync } from "fastify";
import { UserType, PracticeType, TestType, SizeEnum } from "./schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

const userRoutes: FastifyPluginAsync = async (fastify, opts) => {
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
        const userWithoutPassword = (({ password, ...rest }) => rest)(user);
        const accessToken = generateAccessToken(userWithoutPassword);
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
        };
        await jwt.verify(
          accessToken!,
          process.env.ACCESS_TOKEN_SECRET!,
          (error, user) => {
            if (error) throw new Error("Token invalid!");
          }
        );
        const prePractice = await fastify.prisma.practice.findUnique({
          where: {
            userLessonId: info.userLessonId,
          },
        });
        if (prePractice && prePractice.avgSpeed > avgSpeed)
          info.avgSpeed = prePractice.avgSpeed;
        const infoTrueIsComplete = { ...info };
        infoTrueIsComplete.isComplete = true;
        const updatePractice = await fastify.prisma.practice.upsert({
          where: {
            userLessonId: info.userLessonId,
          },
          update: !prePractice?.isComplete ? info : infoTrueIsComplete,
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

  //get paragraph API
  fastify.post<{
    Body: { size: string };
    Reply: { text: string; id: Number };
  }>("/getParagraph", async (request, reply) => {
    try {
      const { size } = request.body;
      let paragraphSize = "MEDIUM";
      if (size == "SMALL") paragraphSize = "SMALL";
      if (size == "LARGE") paragraphSize = "LARGE";

      const paragraphCount = await fastify.prisma.paragraph.count({
        where: {
          size: paragraphSize as SizeEnum,
        },
      });
      const skip = Math.floor(Math.random() * paragraphCount);
      const randomParagraph = await fastify.prisma.paragraph.findMany({
        where: {
          size: paragraphSize as SizeEnum,
        },
        take: 1,
        skip: skip,
        orderBy: {
          id: "desc",
        },
      });

      const info = {
        id: randomParagraph[0].id || -1,
        text: randomParagraph[0].text || "",
      };

      reply.send(info);
    } catch (error) {
      console.log(error);
      reply.status(500);
    }
  });

  //test API
  fastify.post<{
    Body: TestType;
    Reply: {
      userId: string;
      speed: number;
    };
  }>("/speedTest", async (request, reply) => {
    try {
      const { userId, paragraphId, size, speed, accessToken } = request.body;

      await jwt.verify(
        accessToken!,
        process.env.ACCESS_TOKEN_SECRET!,
        (error, user) => {
          if (error) throw new Error("Token invalid!");
        }
      );

      const info = {
        userParagraphId: userId + paragraphId.toString(),
        speed: speed,
        size: size,
        userId: userId,
        paragraphId: paragraphId,
      };

      const test = await fastify.prisma.test.findUnique({
        where: {
          userParagraphId: info.userParagraphId,
        },
      });

      if (test && test.speed > speed) info.speed = test.speed;

      const updateTest = await fastify.prisma.test.upsert({
        where: {
          userParagraphId: info.userParagraphId,
        },
        update: {
          speed: info.speed,
        },
        create: {
          userParagraphId: info.userParagraphId,
          speed: info.speed,
          userId: info.userId,
          paragraphId: info.paragraphId || -1,
        },
      });

      console.log(updateTest);
      reply.send({ userId, speed });
    } catch (error) {
      console.error(error);
      reply.status(500);
    }
  });

  const generateAccessToken = (user: {
    userName: string;
    email: string;
    name: string;
    avgSpeed: number;
  }) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!);
    // ,}
    // expiresIn: "120s",
    // });
  };
};

export default userRoutes;
