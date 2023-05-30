import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../api/baseURL';

export const fetchUserProfile = () => {
	return async (dispatch) => {
		try {
			const token = await AsyncStorage.getItem('token');
			const res = await baseURL.get('/api/profile', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			dispatch({ type: 'SET_USER_PROFILE', payload: res.data });
		} catch (error) {
			console.error('Get User Profile Error:', error);
		}
	};
};
