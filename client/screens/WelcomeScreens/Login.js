import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
} from 'react-native';
import Background from '../../components/Background';
import Btn from '../../components/Btn';
import Field from '../../components/Field';
import baseURL from '../../api/baseURL';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserProfile } from '../../redux/actions/userActionLogin'; //redux
import { useDispatch } from 'react-redux';

const Login = (props) => {
	const dispatch = useDispatch(); // redux
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigation = useNavigation();

	//Clear Email Password
	useFocusEffect(
		React.useCallback(() => {
			// Reset state
			setEmail('');
			setPassword('');
		}, [])
	);
	const handleSubmit = async () => {
		try {
			const res = await baseURL.post('/api/login', { email, password });
			console.log(res.data);
			if (res.data.status === 'ok') {
				// Store the token
				await AsyncStorage.setItem('token', res.data.token);
				dispatch(fetchUserProfile()); //redux
				alert('Login successful');
				navigation.navigate('Tabs'); // Navigate to the Home screen after logging in
			} else {
				alert(res.data.error);
			}
		} catch (error) {
			alert('An error occurred during login.');
			// alert(res.data.error);
			console.log(error.message);
		}
	};

	return (
		<Background>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
				<View style={styles.container}>
					<Text style={styles.title}>Login</Text>
					<View style={styles.formContainer}>
						<Text style={styles.subtitle}>Welcome Back</Text>
						<Text style={styles.description}>Login to your account</Text>
						<Field
							placeholder="Email"
							value={email}
							onChangeText={setEmail}
							keyboardType={'email-address'}
						/>
						<Field
							placeholder="Password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry={true}
						/>
						{/* <View style={styles.forgotPassword}>
							<Text style={styles.forgotPasswordText}>Forgot Password?</Text>
						</View> */}
						<Btn
							textColor="white"
							bgColor={'#f68c05'}
							btnLabel="Login"
							Press={handleSubmit}
						/>
						<View style={styles.signupContainer}>
							<Text style={styles.signupText}>Don't have an account? </Text>
							<TouchableOpacity
								onPress={() => props.navigation.navigate('Signup')}>
								<Text style={styles.signupLink}>Signup</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Background>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		width: '118%',
	},
	title: {
		color: 'white',
		fontSize: 64,
		fontWeight: 'bold',
		marginTop: 60,
		marginBottom: 50,
		textShadowColor: '#f68c05', // Set the shadow color
		textShadowOffset: { width: -4, height: 4 }, // Specify the shadow offset
		textShadowRadius: 4, // Blur the shadow a bit
	},
	formContainer: {
		backgroundColor: 'white',
		height: 650,
		width: '100%',
		borderTopLeftRadius: 130,
		paddingTop: 50,
		alignItems: 'center',
	},
	subtitle: {
		color: '#f68c05',
		fontSize: 40,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	description: {
		color: 'grey',
		fontSize: 19,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	forgotPassword: {
		alignItems: 'flex-end',
		width: '78%',
		paddingRight: 16,
		marginBottom: 20,
	},
	forgotPasswordText: {
		color: '#f68c05',
		fontWeight: 'bold',
		fontSize: 16,
	},
	signupContainer: {
		flexDirection: 'row',
		marginTop: 40,
	},
	signupText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	signupLink: {
		color: '#f68c05',
		fontWeight: 'bold',
		fontSize: 16,
	},
});

export default Login;
