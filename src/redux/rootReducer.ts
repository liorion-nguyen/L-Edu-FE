import { combineReducers } from 'redux';
import authReducer from './slices/auth';
import coursesReducer from './slices/courses';
import messagesReducer from './slices/messages';
import { examsReducer } from './slices/exams';
import categoriesReducer from './slices/categories';

const rootReducer = combineReducers({
  auth: authReducer,
  courses: coursesReducer,
  messages: messagesReducer,
  exams: examsReducer,
  categories: categoriesReducer,
});

export default rootReducer;
 