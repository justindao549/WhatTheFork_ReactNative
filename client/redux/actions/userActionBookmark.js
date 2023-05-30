export const setBookmarkedRecipes = (recipes) => {
	return {
		type: 'SET_BOOKMARKED_RECIPES',
		payload: recipes,
	};
};
