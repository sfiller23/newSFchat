import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import chatSlice from "./chat/chatSlice";

export const store = configureStore({
  reducer: {
    chatReducer: chatSlice,
    authReducer: authSlice,
  },
  //To avoid serialization error
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
