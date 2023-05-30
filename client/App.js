import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux'; // import Provider
import store from './redux/store'; // import the store you created
import Onboarding from './screens/WelcomeScreens/Onboarding';
import Login from './screens/WelcomeScreens/Login';
import SignUp from './screens/WelcomeScreens/SignUp';
import SearchRecipe from './screens/UserScreens/SearchRecipe';
import SearchCategory from './screens/UserScreens/SearchCategory';
import Tabs from './navigation/Tabs';
import { useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, StatusBar, View } from 'react-native';
import baseURL from './api/baseURL';
const Stack = createStackNavigator();

const App = () => {
	const fetchApi = async () => {
		try {
			// const res = await axios.get('http://192.168.50.203:1337/');
			const res = await axios.get('baseURL');
			console.log('Axios connected to Server IP');
		} catch (error) {
			console.log(error.message);
		}
	};
	useEffect(() => {
		fetchApi();
	}, []);

	return (
		<Provider store={store}>
			<View style={styles.container}>
				<StatusBar translucent backgroundColor="transparent" />
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{ headerShown: false }}
						initialRouteName={'Onboarding'}>
						{/* initialRouteName={'Tabs'}> */}
						<Stack.Screen name="Onboarding" component={Onboarding} />
						<Stack.Screen name="Login" component={Login} />
						<Stack.Screen name="Signup" component={SignUp} />
						<Stack.Screen name="Tabs" component={Tabs} />
						<Stack.Screen name="SearchRecipe" component={SearchRecipe} />
						<Stack.Screen name="SearchCategory" component={SearchCategory} />
					</Stack.Navigator>
				</NavigationContainer>
			</View>
		</Provider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'yourBackgroundColor', // Replace with your app's background color
	},
});

export default App;
