import { UserCoreType } from "./user";

export type MessagesState = {
  loading: boolean;
  errorMessage: string,
  messagesBox: MessagesBoxType[] | null,
  messageBox: MessagesBoxType | null,
};

export type File = {
  url: string;
  type: string;
};

export enum TypeChatRoom {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP'
}

export type MessageType = {
  _id: string;
  chatRoomId?: string;
  senderId?: UserCoreType;
  message?: string;
  file?: File;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MessagesBoxType = {
  _id: string;
  name: string;
  members: string[];
  messages?: MessageType[];
  type: TypeChatRoom;
  createdBy: string;
};

export type CreateChatRoomType = {
  _id?: string;
  name: string;
  membersId: string[];
  type: TypeChatRoom;
}