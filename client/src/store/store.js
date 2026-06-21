import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, REGISTER, PAUSE, PERSIST, PURGE } from 'redux-persist'
import { api } from '@store/api/api'
import { authorize } from '@store/slices/authorize'
import { userInterface } from '@store/slices/interface'
import { messaging } from '@store/slices/message'
import storage from 'redux-persist/es/storage'

const configure = ({ key: 'root', version: 1, storage, whitelist: ['authorize', 'userInterface'], blacklist: ['messaging'] }) 

const root = combineReducers({ [api.reducerPath]: api.reducer, authorize: authorize.reducer, userInterface: userInterface.reducer, messaging: messaging.reducer})

const persistence = persistReducer(configure, root)

export const store = configureStore({
    reducer: persistence,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: ({
            ignoredActions: [FLUSH, REHYDRATE, REGISTER, PAUSE, PERSIST, PURGE]
        })
    }).concat(api.middleware)
})

export let persistor = persistStore(store)