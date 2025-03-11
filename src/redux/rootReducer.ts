import { combineReducers } from 'redux';
import authReducer from './slices/auth';
import coursesReducer from './slices/courses';
// slices
const rootReducer = combineReducers({
    auth: authReducer,
    courses: coursesReducer,
});

export default rootReducer;
