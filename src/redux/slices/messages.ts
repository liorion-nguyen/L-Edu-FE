import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { dispatch, RootState } from '../store';
import { envConfig } from '../../config';
import { showNotification } from '../../components/common/Toaster';
import { ToasterType } from '../../enum/toaster';
import { MessagesBoxType, MessagesState, MessageType } from '../../types/message';
import { get } from 'http';
import { useSelector } from 'react-redux';

type GetMessagesSuccessAction = PayloadAction<{ messagesBox: MessagesBoxType[] | null }>;
type GetMessagesuccessAction = PayloadAction<{ messageBox: MessagesBoxType | null }>;
type GetFailureAction = PayloadAction<string>;

const initialState: MessagesState = {
    loading: false,
    errorMessage: '',
    messagesBox: null,
    messageBox: null,
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        getRequest: (state: MessagesState) => {
            state.loading = true;
        },
        getSuccess: (state: MessagesState) => {
            state.loading = false;
        },
        getMessagesSuccess: (state: MessagesState, action: GetMessagesSuccessAction) => {
            state.loading = false;
            state.messagesBox = action.payload.messagesBox;
        },
        getFailure: (state: MessagesState, action: GetFailureAction) => {
            state.loading = false;
            state.errorMessage = action.payload;
        },
        getMessagesuccess: (state: MessagesState, action: GetMessagesuccessAction) => {
            state.loading = false;
            state.messageBox = action.payload.messageBox;
        },
        createReviewSuccess: (state: MessagesState) => {
            state.loading = false;
        },
        addMessage: (state: MessagesState, action: PayloadAction<MessageType>) => {
            if (state.messageBox) {
                state.messageBox.messages?.push(action.payload);
            }
        }
    },
});

export const getMessagesBox = (page = 0, limit = 20, name = "", userIdJoin = "") => {
    return async () => {
        try {
            dispatch(messagesSlice.actions.getRequest());
            const result = await axios.get(
                `${envConfig.serverURL}/chat-room/search?page=${page}&limit=${limit}&name=${name}&UserIdJoin=${userIdJoin}`
            );
            const messagesBox: MessagesBoxType[] = Array.isArray(result.data.data.data) ? result.data.data.data : [];
            dispatch(messagesSlice.actions.getMessagesSuccess({ messagesBox }));
        } catch (error: Error | any) {
            const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
            toast.error(errorMessage);
            dispatch(messagesSlice.actions.getFailure(errorMessage));
        }
    };
};

export const getMessageBoxById = (id: string) => {
    return async () => {
        try {
            dispatch(messagesSlice.actions.getRequest());
            const result = await axios.get(`${envConfig.serverURL}/chat-room/${id}`);
            const messageBox: MessagesBoxType = result.data.data;
            dispatch(messagesSlice.actions.getMessagesuccess({ messageBox }));
            return true;
        } catch (error: Error | any) {
            const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Failed to fetch Message', errorMessage);
            dispatch(messagesSlice.actions.getFailure(errorMessage));
            return false;
        }
    };
};

export const updateMessage = (id: string, Message: MessageType) => {
    return async () => {
        try {
            dispatch(messagesSlice.actions.getRequest());
            await axios.put(`${envConfig.serverURL}/Messages/${id}`, Message);
            showNotification(ToasterType.success, 'Message updated successfully');
        }
        catch (error: Error | any) {
            const errorMessage: string = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Update failed', errorMessage);
            dispatch(messagesSlice.actions.getFailure(errorMessage));
        }
    }
};

export const createMessage = (message: Partial<MessageType>) => {
    return async () => {
        try {
            dispatch(messagesSlice.actions.getRequest());
            const resMessage = await axios.post(`${envConfig.serverURL}/message`, message);
            showNotification(ToasterType.success, 'Message created successfully');
            dispatch(messagesSlice.actions.addMessage(resMessage.data.data));
        }
        catch (error: Error | any) {
            const errorMessage: string = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Create failed', errorMessage);
            dispatch(messagesSlice.actions.getFailure(errorMessage));
        }
    };
};

export default messagesSlice.reducer;
