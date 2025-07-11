import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { showNotification } from '../../components/common/Toaster';
import { envConfig } from '../../config';
import { ToasterType } from '../../enum/toaster';
import { CreateChatRoomType, CreateMessageType, MessagesBoxType, MessagesState, MessageType } from '../../types/message';

const initialState: MessagesState = {
    loading: false,
    errorMessage: '',
    messagesBox: null,
    messageBox: null,
};

// Async thunks
export const getMessagesBox = createAsyncThunk(
    'messages/getMessagesBox',
    async ({ page = 0, limit = 20, name = "", userIdJoin = "" }: { page?: number; limit?: number; name?: string; userIdJoin?: string }) => {
        try {
            const result = await axios.get(
                `${envConfig.serverURL}/chat-room/search?page=${page}&limit=${limit}&name=${name}&UserIdJoin=${userIdJoin}`
            );
            const messagesBox: MessagesBoxType[] = Array.isArray(result.data.data.data) ? result.data.data.data : [];
            return messagesBox;
        } catch (error: Error | any) {
            const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
            toast.error(errorMessage);
            throw error;
        }
    }
);

export const getMessageBoxById = createAsyncThunk(
    'messages/getMessageBoxById',
    async ({ id, page = 0, limit = 20 }: { id: string; page?: number; limit?: number }) => {
        try {
            const result = await axios.get(`${envConfig.serverURL}/chat-room/${id}?page=${page}&limit=${limit}`);
            const messageBox: MessagesBoxType = result.data.data;
            return { messageBox, page };
        } catch (error: any) {
            const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Failed to fetch Message', errorMessage);
            throw error;
        }
    }
);

export const updateMessage = createAsyncThunk(
    'messages/updateMessage',
    async ({ id, message }: { id: string; message: MessageType }) => {
        try {
            await axios.put(`${envConfig.serverURL}/Messages/${id}`, message);
            showNotification(ToasterType.success, 'Message updated successfully');
            return message;
        } catch (error: Error | any) {
            const errorMessage: string = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Update failed', errorMessage);
            throw error;
        }
    }
);

export const createMessage = createAsyncThunk(
    'messages/createMessage',
    async ({ message, file }: { message: CreateMessageType; file: File | null }) => {
        try {
            // Tạo `FormData` để gửi file và message.
            const formData = new FormData();
            if (file) {
                formData.append('file', file);
            }
            formData.append('chatRoomId', message.chatRoomId);
            if (message.message?.trim()) {
                formData.append('message', message.message.trim());
            }

            // Gửi message đến server.
            const response = await axios.post(`${envConfig.serverURL}/message`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Gửi sự kiện qua Pusher.
            await axios.post(`${envConfig.serverURL}/pusher`, {
                channel: `chat-room-${message.chatRoomId}`,
                event: 'new-message',
                data: {
                    message: response.data.data,
                },
            });

            return response.data.data;
        } catch (error: Error | any) {
            const errorMessage: string = error.response?.data?.message || 'Something went wrong';
            showNotification(ToasterType.error, 'Create failed', errorMessage);
            throw error;
        }
    }
);

export const createChatRoom = createAsyncThunk(
    'messages/createChatRoom',
    async (data: CreateChatRoomType) => {
        try {
            const resData = await axios.post(`${envConfig.serverURL}/chat-room`, data);
            showNotification(ToasterType.success, 'Chat room created successfully');
            return resData.data.data;
        } catch (error: Error | any) {
            const errorMessage: string = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Create failed', errorMessage);
            throw error;
        }
    }
);

export const updateChatRoom = createAsyncThunk(
    'messages/updateChatRoom',
    async ({ id, data }: { id: string; data: CreateChatRoomType }) => {
        try {
            await axios.put(`${envConfig.serverURL}/chat-room/${id}`, data);
            showNotification(ToasterType.success, 'Chat room updated successfully');
            return data;
        } catch (error: Error | any) {
            const errorMessage: string = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Update failed', errorMessage);
            throw error;
        }
    }
);

export const getInformationChatRoom = createAsyncThunk(
    'messages/getInformationChatRoom',
    async (id: string) => {
        try {
            const resData = await axios.get(`${envConfig.serverURL}/chat-room/information/${id}`);
            return resData.data.data;
        } catch (error: Error | any) {
            const errorMessage: string = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Fetch failed', errorMessage);
            throw error;
        }
    }
);

export const deleteChatRoom = createAsyncThunk(
    'messages/deleteChatRoom',
    async (id: string) => {
        try {
            await axios.delete(`${envConfig.serverURL}/chat-room/${id}`);
            showNotification(ToasterType.success, 'Chat room deleted successfully');
            return id;
        } catch (error: Error | any) {
            const errorMessage: string = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Delete failed', errorMessage);
            throw error;
        }
    }
);

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state: MessagesState, action: PayloadAction<MessageType[] | MessageType>) => {
            if (state.messageBox) {
                state.messageBox.messages = state.messageBox.messages ?? [];
                state.messageBox.messages = Array.isArray(action.payload)
                    ? [...action.payload, ...state.messageBox.messages]
                    : [...state.messageBox.messages, action.payload];
            }
        },
        addChatRoom: (state: MessagesState, action: PayloadAction<MessagesBoxType>) => {
            state.messagesBox = state.messagesBox ? [action.payload, ...state.messagesBox] : [action.payload];
        }
    },
    extraReducers: (builder) => {
        builder
            // getMessagesBox
            .addCase(getMessagesBox.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(getMessagesBox.fulfilled, (state, action) => {
                state.loading = false;
                state.messagesBox = action.payload;
            })
            .addCase(getMessagesBox.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // getMessageBoxById
            .addCase(getMessageBoxById.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(getMessageBoxById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.page === 0) {
                    state.messageBox = action.payload.messageBox;
                } else if (action.payload.messageBox.messages && action.payload.messageBox.messages.length > 0) {
                    if (state.messageBox) {
                        state.messageBox.messages = state.messageBox.messages ?? [];
                        state.messageBox.messages = [...action.payload.messageBox.messages, ...state.messageBox.messages];
                    }
                }
            })
            .addCase(getMessageBoxById.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // updateMessage
            .addCase(updateMessage.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(updateMessage.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateMessage.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // createMessage
            .addCase(createMessage.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(createMessage.fulfilled, (state, action) => {
                state.loading = false;
                // Add message to messageBox
                if (state.messageBox) {
                    state.messageBox.messages = state.messageBox.messages ?? [];
                    state.messageBox.messages = [...state.messageBox.messages, action.payload];
                }
            })
            .addCase(createMessage.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // createChatRoom
            .addCase(createChatRoom.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(createChatRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.messagesBox = state.messagesBox ? [action.payload, ...state.messagesBox] : [action.payload];
            })
            .addCase(createChatRoom.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // updateChatRoom
            .addCase(updateChatRoom.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(updateChatRoom.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateChatRoom.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // getInformationChatRoom
            .addCase(getInformationChatRoom.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(getInformationChatRoom.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(getInformationChatRoom.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // deleteChatRoom
            .addCase(deleteChatRoom.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(deleteChatRoom.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteChatRoom.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            });
    }
});

export const addMessageRealTime = (message: MessageType) => {
    return messagesSlice.actions.addMessage(message);
};

export default messagesSlice.reducer;
