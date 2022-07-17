export interface User {
  email: string;
  password: string;
}

export type IAuthStrategy = () => User;

export const authStrategy = () => ({
  email: "test@mail.tld",
  password: "example123",
});
