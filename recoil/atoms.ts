import { atom } from "recoil";

export const userState = atom<{ email: string; password: string }>({
  key: "userState",
  default: {
    email: "",
    password: "",
  },
});
export const openLoginAfterSignUp = atom<boolean>({
  key: "openLoginAfterSignUp",
  default: false,
});
