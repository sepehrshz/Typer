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
  isEnable: Type.Optional(Type.Boolean()),
  accessToken: Type.Optional(Type.String()),
});

export type UserType = Static<typeof User>;
export type PracticeType = Static<typeof Practice>;
