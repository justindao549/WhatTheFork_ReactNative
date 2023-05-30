// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { userReducerBookmark } from './reducers/userReducerBookmark';
import { userReducerLogin } from './reducers/userReducerLogin';
import { userReducerSignup } from './reducers/userReducerSignup';
import userSliceRating from './slices/userSliceRating';
// Combine reducers
const rootReducer = combineReducers({
	bookmark: userReducerBookmark,
	login: userReducerLogin,
	signup: userReducerSignup,
	ratings: userSliceRating,
});

const store = configureStore({ reducer: rootReducer });

export default store;
