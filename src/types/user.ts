import { Role, Status } from "../enum/user.enum";

export interface Address {
    province: string;
    district: string;
    ward: string;
  }
  
  export interface Phone {
    country: string;
    number: string;
  }

export type UserType = {
  _id: string;
  email: string;
  password?: string;
  fullName: string;
  avatar?: string | null;
  gender?: string | null;
  birthday?: Date | null;
  address?: Address | null;
  phone?: Phone | null;
  role?: Role;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IntructorType = {
  _id: string;
  fullName: string;
  avatar?: string
};

export type UserCoreType = {
  _id: string;
  fullName: string;
  avatar?: string;
  email?: string;
}