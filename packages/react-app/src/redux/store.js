import rootReducer from './reducer'
import {configureStore} from '@reduxjs/toolkit'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export default store
