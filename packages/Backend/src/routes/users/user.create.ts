import { FastifyPluginAsync } from "fastify";
import { UserType, PracticeType, TestType, SizeEnum } from "./schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodeoutlook from "nodejs-nodemailer-outlook";
import { hotp, authenticator } from "otplib";

const counter = 15 * 60;

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
        const avatars = [
          15, 46, 41, 4, 43, 38, 8, 37, 13, 19, 45, 51, 88, 55, 57, 62, 95, 85,
          64, 90,
        ];
        const avatarIndex = Math.floor(Math.random() * avatars.length);

        const newUser = await fastify.prisma.user.create({
          data: {
            email,
            name,
            userName,
            password,
            avatarIndex,
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
        const {
          prevUserName,
          userName,
          email,
          name,
          password,
          accessToken,
          avatarIndex,
        } = request.body;

        const user = await fastify.prisma.user.findUnique({
          where: { userName: prevUserName },
        });

        const info = {
          name: name,
          email: email,
          userName: userName,
          password: user?.password,
          avatarIndex: avatarIndex,
        };

        if (password != "") {
          info.password = await bcrypt.hash(password, 10);
        }

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
        const { userId, lessonId, avgSpeed, accuracy, date, accessToken } =
          request.body;
        let isComplete = request.body.isComplete;
        await jwt.verify(
          accessToken!,
          process.env.ACCESS_TOKEN_SECRET!,
          (error, user) => {
            if (error) throw new Error("Token invalid!");
          }
        );
        const prePractice = await fastify.prisma.practice.findMany({
          where: {
            userId,
            lessonId,
          },
          orderBy: {
            id: "desc",
          },
          select: { isComplete: true },
          take: 1,
        });
        if (prePractice[0] && prePractice[0].isComplete) isComplete = true;
        // if (prePractice[0] && prePractice[0].avgSpeed > avgSpeed)
        //   info.avgSpeed = prePractice[0].avgSpeed;
        // const infoTrueIsComplete = { ...info };
        // infoTrueIsComplete.isComplete = true;
        const newPractice = await fastify.prisma.practice.create({
          // where: {
          //   userId_lessonId_id: {
          //     userId: prePractice[0].userId,
          //     lessonId: prePractice[0].lessonId,
          //     id: prePractice[0].id,
          //   },
          // },
          data: {
            id: await fastify.prisma.practice.count({
              where: { userId },
            }),
            avgSpeed,
            accuracy,
            date,
            isComplete,
            lessonId,
            userId,
          },
          // update: !prePractice[0].isComplete ? info : infoTrueIsComplete,
          // create: info,
        });

        console.log(newPractice);
        reply.send(newPractice);
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
      practice?: {
        isComplete: boolean;
      }[];
      id: number;
      name: string;
    }[];
  }>("/lessons", async (request, reply) => {
    try {
      const { userName, accessToken } = request.body;
      if (userName) {
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
      } else {
        const lessons = await fastify.prisma.lesson.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        console.log(lessons);
        reply.send(lessons);
      }
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
  }>("/", async (request, reply) => {
    try {
      const { userId, paragraphId, speed, accuracy, date, accessToken } =
        request.body;

      await jwt.verify(
        accessToken!,
        process.env.ACCESS_TOKEN_SECRET!,
        (error, user) => {
          if (error) throw new Error("Token invalid!");
        }
      );
      const newTest = await fastify.prisma.test.create({
        data: {
          id: await fastify.prisma.test.count({
            where: { userId },
          }),
          speed: speed,
          userId: userId,
          paragraphId: paragraphId,
          accuracy,
          date,
        },
      });
      console.log(newTest);
      reply.send({ userId, speed });
    } catch (error) {
      console.error(error);
      reply.status(500);
    }
  });

  //send email API
  fastify.post<{ Body: { email: string }; Reply: string }>(
    "/sendEmail",
    async (request, reply) => {
      try {
        const { email } = request.body;
        const user = await fastify.prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          console.log("User not found!");
          return reply.status(404);
        }
        const secret = authenticator.generate(process.env.ACCESS_TOKEN_SECRET!);
        const token = hotp.generate(secret, counter);
        fastify.prisma.user
          .update({
            where: { email },
            data: { passwordToken: secret },
          })
          .catch();
        nodeoutlook.sendEmail({
          auth: {
            user: "sepehrtyper@outlook.com",
            pass: "sepehr1382",
          },
          from: "sepehrtyper@outlook.com",
          to: email,
          subject: "Reset your password",
          text: `Enter this code in website the field: ${token}`,
        });
        reply.send(`Reset email code: ${token}`);
        reply.status(200);
      } catch (error) {
        console.error(error);
        reply.status(500);
      }
    }
  );

  //reset password token validation API
  fastify.post<{ Body: { token: string; email: string }; Reply: string }>(
    "/sendToken",
    async (request, reply) => {
      try {
        const { token, email } = request.body;
        const user = await fastify.prisma.user.findUnique({
          where: { email: email },
        });
        const secret = user?.passwordToken!;
        const isValid = hotp.verify({ token, secret, counter });

        if (!isValid) throw Error("Invalid Token!");
        reply.send("Nice");
      } catch (error) {
        console.error(error);
        reply.send("Invalid code");
        reply.status(500);
      }
    }
  );

  //reset password API
  fastify.post<{
    Body: { email: string; password: string; token: string };
    Reply: { email: string; password: string };
  }>("/resetPassword", async (request, reply) => {
    try {
      const { email, token } = request.body;
      let password = request.body.password;

      const user = await fastify.prisma.user.findUnique({
        where: { email: email },
      });
      const secret = user?.passwordToken!;
      const isValid = hotp.verify({ token, secret, counter });
      if (!isValid) throw Error("Invalid Token!");

      password = await bcrypt.hash(password, 10);

      const updateUser = await fastify.prisma.user.update({
        where: {
          email: email,
        },
        data: { password },
        select: {
          email: true,
        },
      });

      reply.send(updateUser);
    } catch (error) {
      console.error(error);
      reply.status(500);
    }
  });

  //get test history
  fastify.post<{
    Body: { userName: string; accessToken: string };
    Reply: { speed: number[]; accuracy: number[]; date: string[] };
  }>("/getTest", async (request, reply) => {
    try {
      const { userName, accessToken } = request.body;
      await jwt.verify(
        accessToken!,
        process.env.ACCESS_TOKEN_SECRET!,
        (error, user) => {
          if (error) throw new Error("Token invalid!");
        }
      );
      const userTestData = await fastify.prisma.test.findMany({
        where: { userId: userName },
        select: { speed: true, accuracy: true, date: true },
      });
      const testDate: { speed: number[]; accuracy: number[]; date: string[] } =
        {
          speed: userTestData.map((test) => test.speed),
          accuracy: userTestData.map((test) => test.accuracy),
          date: userTestData.map((test) => test.date),
        };
      reply.send(testDate);
    } catch (error) {
      console.log(error);
      reply.status(500);
    }
  });

  //get lesson history
  fastify.post<{
    Body: { userName: string; lessonId: number; accessToken: string };
    Reply: { speed: number[]; accuracy: number[]; date: string[] };
  }>("/getPractice", async (request, reply) => {
    try {
      const { userName, lessonId, accessToken } = request.body;
      await jwt.verify(
        accessToken!,
        process.env.ACCESS_TOKEN_SECRET!,
        (error, user) => {
          if (error) throw new Error("Token invalid!");
        }
      );
      const userPracticeData = await fastify.prisma.practice.findMany({
        where: { userId: userName, lessonId },
        select: { avgSpeed: true, accuracy: true, date: true },
      });
      console.log(userPracticeData);
      const testDate: { speed: number[]; accuracy: number[]; date: string[] } =
        {
          speed: userPracticeData.map((test) => test.avgSpeed),
          accuracy: userPracticeData.map((test) => test.accuracy),
          date: userPracticeData.map((test) => test.date),
        };
      reply.send(testDate);
    } catch (error) {
      console.log(error);
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
