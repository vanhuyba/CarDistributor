import {applyMiddleware, createStore} from "redux";
import {rootReducer} from "./AppReducers";
import createSagaMiddleware from 'redux-saga'
import rootSaga from "./AppSagas";
// Logger with default options
import logger from 'redux-logger'

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
// export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger));

sagaMiddleware.run(rootSaga);
