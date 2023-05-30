import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Background from '../../components/Background';
import Btn from '../../components/Btn';
const Onboarding = (props) => {
	return (
		<Background>
			<View style={styles.container}>
				<Text style={styles.title}>
					What {'\n'}
					The {'\n'}
					Fork
				</Text>
				<Text style={styles.subtitle}>
					Discover and share{'\n'}
					your favorite recipes
				</Text>
				<View style={styles.buttonsContainer}>
					<Btn
						bgColor={'#f68c05'}
						textColor="white"
						btnLabel="Login"
						Press={() => props.navigation.navigate('Login')}
					/>
					<Btn
						bgColor="white"
						textColor={'#f68c05'}
						btnLabel="Signup"
						Press={() => props.navigation.navigate('Signup')}
					/>
				</View>
			</View>
		</Background>
	);
};

export default Onboarding;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 32,
		marginVertical: 100,
	},
	title: {
		color: 'white',
		fontSize: 100,
		fontWeight: 'bold',
		marginTop: 10,
		marginLeft: -50,
		textShadowColor: '#f68c05', // Set the shadow color
		textShadowOffset: { width: -4, height: 4 }, // Specify the shadow offset
		textShadowRadius: 4, // Blur the shadow a bit
	},
	subtitle: {
		color: 'white',
		fontSize: 20,
		marginTop: 50,
		textAlign: 'right',
		marginLeft: 100,
	},
	buttonsContainer: {
		marginTop: 100,
		marginBottom: -50,
	},
});
