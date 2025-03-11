import { Role, Status } from "../enum/user.enum";
import { UserType } from "./user";

export type AuthenticationState = {
  loading: boolean;
  isAuthenticated: boolean;
  errorMessage: string | null;
  forgotEmailSent: boolean;
  open: string | null;
  user: UserType | null;
};

export interface Address {
  province: string;
  district: string;
  ward: string;
}

export interface Phone {
  country: string;
  number: string;
}

export type RegisterRequestType = {
  email: string;
  fullName: string;
  password: string;
  birthday?: Date | null;  // Đổi từ Dayjs sang Date
  address?: Address | null; // Có thể null như trong schema
  phone?: Phone | null;  // Có thể null như trong schema
  avatar?: string | null;
  gender?: string | null;
  role?: Role;  
  status?: Status;
} & Partial<{
  confirmPassword: string;
  policy: boolean;
}>;

export type LoginRequestType = {
  email: string;
  password: string;
};

export type LoginResponseType = {
  access_token: string;
  refresh_token?: string;
  authenticated?: string;
};