import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer } from 'redux-persist';
import userReducer from './slices/user/userSlice';
import persistStore from "redux-persist/es/persistStore";
import {userAPI} from "@/store/slices/user/userAPI";
import {imageAPI} from "@/store/slices/image/imageAPI";
// @ts-ignore
import {postAPI} from "@/store/slices/post/postAPI";
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key:"root",
  storage: AsyncStorage,
  whitelist: ["user"]
}

const rootReducer = combineReducers({
  user: userReducer,
  [userAPI.reducerPath]: userAPI.reducer,
  [imageAPI.reducerPath]: imageAPI.reducer,
  [postAPI.reducerPath]: postAPI.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat(userAPI.middleware, imageAPI.middleware, postAPI.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
