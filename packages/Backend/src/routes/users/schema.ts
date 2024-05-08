import { Static, Type } from "@sinclair/typebox";

export const User = Type.Object({
  userName: Type.String(),
  name: Type.String(),
  password: Type.String(),
  email: Type.String(),
  prevUserName: Type.Optional(Type.String()),
  accessToken: Type.Optional(Type.String()),
});

export const Practice = Type.Object({
  userId: Type.String(),
  lessonId: Type.Integer(),
  avgSpeed: Type.Integer(),
  isComplete: Type.Boolean(),
  accessToken: Type.Optional(Type.String()),
});

const SizeEnum = Type.Enum(
  { SMALL: "SMALL", MEDIUM: "MEDIUM", LARGE: "LARGE" },
  { name: "SizeEnum" }
);

export const Test = Type.Object({
  userId: Type.String(),
  size: SizeEnum,
  paragraphId: Type.Number(),
  speed: Type.Number(),
  accessToken: Type.Optional(Type.String()),
});

export type SizeEnum = Static<typeof SizeEnum>;
export type UserType = Static<typeof User>;
export type PracticeType = Static<typeof Practice>;
export type TestType = Static<typeof Test>;
