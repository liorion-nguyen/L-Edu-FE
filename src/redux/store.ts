import { configureStore } from '@reduxjs/toolkit';
import {
  // eslint-disable-next-line import/named
  TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from 'react-redux';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
});

const { dispatch } = store;
export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

const useDispatch = () => useAppDispatch<AppDispatch>();

const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export { store, dispatch, useSelector, useDispatch };