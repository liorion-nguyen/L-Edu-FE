import { combineReducers } from 'redux';
import authReducer from './slices/auth';
import coursesReducer from './slices/courses';
import messagesReducer from './slices/messages';
import { examsReducer } from './slices/exams';
// slices
const rootReducer = combineReducers({
    auth: authReducer,
    courses: coursesReducer,
    messages: messagesReducer,
    exams: examsReducer,
});

export default rootReducer;
 