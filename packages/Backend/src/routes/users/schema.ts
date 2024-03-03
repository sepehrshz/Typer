import { Static, Type } from '@sinclair/typebox'

export const User = Type.Object({
  userName: Type.String(),
  name: Type.String(),
  password: Type.String(),
  email: Type.String(),
});


export type UserType = Static<typeof User>
