import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import campaignDetailsReducer from "./Actions_Reducers/campaignDetails";
import { pokemonApi } from "./Actions_Reducers/pokemonApi";
import { assignClientListApi } from "./Actions_Reducers/assignedClientList";
import logger from 'redux-logger'
import { combineReducers } from "@reduxjs/toolkit";

//combineReducers({ todos: myTodosReducer, counter: myCounterReducer })

const reducers = combineReducers({
  campaignDetails:campaignDetailsReducer,
  [pokemonApi.reducerPath]: pokemonApi.reducer,
  [assignClientListApi.reducerPath]: assignClientListApi.reducer,
 });

export const store = () =>
  configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
  });

export const wrapper = createWrapper(store, {debug: true});
