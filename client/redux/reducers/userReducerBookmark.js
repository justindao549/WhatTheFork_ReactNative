const initialState = {
	bookmarkedRecipes: [],
};

export const userReducerBookmark = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_BOOKMARKED_RECIPES':
			return { ...state, bookmarkedRecipes: action.payload };
		default:
			return state;
	}
};
