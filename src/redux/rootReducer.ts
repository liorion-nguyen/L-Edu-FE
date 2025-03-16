import { combineReducers } from 'redux';
import authReducer from './slices/auth';
import coursesReducer from './slices/courses';
import messagesReducer from './slices/messages';
// slices
const rootReducer = combineReducers({
    auth: authReducer,
    courses: coursesReducer,
    messages: messagesReducer,
});

export default rootReducer;
 