import {configureStore} from '@reduxjs/toolkit';
import appReducer from '../slices/appSlice';

const Store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
