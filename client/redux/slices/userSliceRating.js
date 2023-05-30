import { createSlice } from '@reduxjs/toolkit';

const recipeRatingsSlice = createSlice({
	name: 'recipeRatings',
	initialState: {
		averageRating: 0,
		numRatings: 0,
	},
	reducers: {
		updateRatings: (state, action) => {
			state.averageRating = action.payload.averageRating;
			state.numRatings = action.payload.numRatings;
		},
	},
});

export const { updateRatings } = recipeRatingsSlice.actions;
export default recipeRatingsSlice.reducer;
