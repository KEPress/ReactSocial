import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, REGISTER, PAUSE, PERSIST, PURGE } from 'redux-persist'
import { api } from '@store/api/api'
import storage from 'redux-persist/lib/storage'

const configure = ({ key: 'root', version: 1, storage }) 

const root = combineReducers({})

const persistence = persistReducer(configure, root)

export const store = configureStore({
    reducer: ({ persistence, [api.reducerPath]: api.reducer }),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: ({
            ignoredActions: [FLUSH, REHYDRATE, REGISTER, PAUSE, PERSIST, PURGE]
        })
    }).concat(api.middleware)
})

export let persistor = persistStore(store)