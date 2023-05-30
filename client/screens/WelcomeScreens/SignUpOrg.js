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
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { createUserProfile } from '../../redux/actions/userActionSignup'; //redux

const SignUp = (props) => {
	const [fname, setFname] = useState('');
	const [lname, setLname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigation = useNavigation();
	const dispatch = useDispatch();

	const handleSubmit = async () => {
		try {
			const values = {
				fname: fname,
				lname: lname,
				email: email,
				password: password,
			};
			const res = await baseURL.post('/api/register', { ...values });
			console.log(res.data);
			if (res.data.status === 'ok') {
				alert('Registration successful');
				navigation.navigate('Tabs');
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Background>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
				<View style={styles.container}>
					<Text style={styles.title}>Register</Text>
					<Text style={styles.subTitle}>Create a new account</Text>
					<View style={styles.formContainer}>
						<Field
							placeholder="First Name"
							value={fname}
							onChangeText={setFname}
						/>
						<Field
							placeholder="Last Name"
							value={lname}
							onChangeText={setLname}
						/>
						<Field
							placeholder="Email"
							keyboardType="email-address"
							value={email}
							onChangeText={setEmail}
						/>
						<Field
							placeholder="Password"
							secureTextEntry={true}
							value={password}
							onChangeText={setPassword}
						/>
						{/* <Field
						placeholder="Confirm Password"
						secureTextEntry={true}
						value={confirmPassword}
						onChangeText={setConfirmPassword}
					/> */}

						<Btn
							textColor="white"
							bgColor={'#f68c05'}
							btnLabel="Sign-Up"
							Press={handleSubmit}
						/>
						<View style={styles.policyContainer}>
							<Text style={styles.policyText}>
								By signing in, you agree to our{' '}
							</Text>
							<Text style={styles.policyLink}>Terms & Conditions</Text>
							<Text style={styles.policyText}>and </Text>
							<Text style={styles.policyLink}>Privacy Policy</Text>
						</View>
						<View style={styles.loginContainer}>
							<Text style={styles.loginText}>Already have an account? </Text>
							<TouchableOpacity
								onPress={() => props.navigation.navigate('Login')}>
								<Text style={styles.loginLink}>Login</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Background>
	);
};

export default SignUp;

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		width: '113%',
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
	subTitle: {
		color: 'white',
		fontSize: 19,
		fontWeight: 'bold',
		marginTop: -45,
		marginBottom: 10,
	},
	formContainer: {
		backgroundColor: 'white',
		height: 650,
		width: '100%',
		borderTopLeftRadius: 130,
		paddingTop: 70,
		alignItems: 'center',
	},
	policyContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '80%',
		marginTop: 20,
		marginBottom: 30,
		flexWrap: 'wrap',
	},
	policyText: {
		color: 'grey',
		fontSize: 16,
	},
	policyLink: {
		color: '#f68c05',
		fontWeight: 'bold',
		fontSize: 16,
	},
	loginContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	loginText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	loginLink: {
		color: '#f68c05',
		fontWeight: 'bold',
		fontSize: 16,
	},
});
