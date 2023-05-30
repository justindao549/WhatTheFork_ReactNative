import {
	View,
	Text,
	Button,
	StyleSheet,
	StatusBar,
	Dimensions,
} from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Btn from '../../components/Btn';
import { fetchUserProfile } from '../../redux/actions/userActionLogin';
import { useDispatch, useSelector } from 'react-redux';

const Account = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.login);
	const navigation = useNavigation();

	useEffect(() => {
		dispatch(fetchUserProfile());
	}, [dispatch]);

	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem('token');
			navigation.navigate('Login');
		} catch (error) {
			console.log(error);
		}
	};

	if (!user) {
		return <Text>User Not Found</Text>;
	}

	return (
		<View style={styles.container}>
			<StatusBar translucent={true} barStyle="dark-content" />
			<View style={styles.header}>
				<Text style={styles.headerText}>
					{user.fname} {user.lname}
				</Text>
				<Text>{user.email}</Text>
			</View>
			<Btn
				textColor="white"
				bgColor={'#f68c05'}
				btnLabel="Logout"
				Press={handleLogout}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start', // Align items from the top
		alignItems: 'center',
		backgroundColor: 'white',
	},
	header: {
		height: Dimensions.get('window').height * 0.33,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		backgroundColor: '#f7f8fa',
		borderBottomColor: '#d3d2da',
		borderBottomWidth: 1,
	},
	headerText: {
		fontSize: 20,
		fontWeight: 'bold',
		backgroundColor: '#f7f8fa',
	},
});

export default Account;
