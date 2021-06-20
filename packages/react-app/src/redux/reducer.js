import {combineReducers} from 'redux'
import { ReduxMain } from './slice-main'

const rootReducer = combineReducers({
  main: ReduxMain.reducer,
})

export default rootReducer
