import {combineReducers} from 'redux'
import { ReduxAuth } from './slice-auth'

const rootReducer = combineReducers({
  auth: ReduxAuth.reducer,
})

export default rootReducer
