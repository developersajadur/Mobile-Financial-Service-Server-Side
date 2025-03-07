import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './features/Auth/authSlice'
import deviceFingerprintReducer from './features/Auth/deviceFingerprintSlice'
import { baseApi } from './api/baseApi'


 
const persistConfig = {
    key: 'root',
    storage,
  }

  const persistedReducer = persistReducer(persistConfig, authReducer)


export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedReducer,
    deviceFingerprint: deviceFingerprintReducer,

  },
  middleware: (getDefaultMiddlewares) => 
    getDefaultMiddlewares({
        serializableCheck: false,
    }).concat(baseApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)