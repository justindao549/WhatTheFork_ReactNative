export const userReducerLogin = (state = null, action) => {
	switch (action.type) {
		case 'SET_USER_PROFILE':
			return action.payload;
		default:
			return state;
	}
};
