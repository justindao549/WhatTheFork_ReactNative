import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../api/baseURL';

export const createUserProfile = (values) => {
	return async (dispatch) => {
		try {
			const res = await baseURL.post('/api/register', values);
			// console.log('Response:', res);
			if (res.data.status === 'ok') {
				await AsyncStorage.setItem('token', res.data.token);
				dispatch({ type: 'SET_USER_PROFILE', payload: res.data });
				return { status: 'ok' };
			}
		} catch (error) {
			console.error('Create User Profile Error:', error);
			return { status: 'error', message: error.message };
		}
	};
};
