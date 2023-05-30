import * as React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/UserScreens/Home.js';
import Search from '../screens/UserScreens/Search.js';
import Favorites from '../screens/UserScreens/Favorites.js';
import Account from '../screens/UserScreens/Account.js';

const Tab = createBottomTabNavigator();

const Tabs = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					position: 'absolute',
					backgroundColor: '#f8f8f8',
					borderTopColor: '#b8b8b8',
					borderTopWidth: 1,
					padding: 5,
					height: 60,
				},
			}}>
			<Tab.Screen
				name="Home"
				component={Home}
				options={{
					tabBarIcon: ({ focused }) => (
						<View>
							<Image
								source={require('../assets/icons/home.png')}
								resizeMode="contain"
								style={styles.icon(focused)}
							/>
						</View>
					),
					tabBarLabel: ({ focused }) => (
						<Text style={styles.label(focused)}>Home</Text>
					),
				}}
			/>
			<Tab.Screen
				name="Search"
				component={Search}
				options={{
					tabBarIcon: ({ focused }) => (
						<View>
							<Image
								source={require('../assets/icons/search.png')}
								resizeMode="contain"
								style={styles.icon(focused)}
							/>
						</View>
					),
					tabBarLabel: ({ focused }) => (
						<Text style={styles.label(focused)}>Search</Text>
					),
				}}
			/>
			<Tab.Screen
				name="Favorites"
				component={Favorites}
				options={{
					tabBarIcon: ({ focused }) => (
						<View>
							<Image
								source={require('../assets/icons/bookmark.png')}
								resizeMode="contain"
								style={styles.icon(focused)}
							/>
						</View>
					),
					tabBarLabel: ({ focused }) => (
						<Text style={styles.label(focused)}>Favorites</Text>
					),
				}}
			/>
			<Tab.Screen
				name="Account"
				component={Account}
				options={{
					tabBarIcon: ({ focused }) => (
						<View>
							<Image
								source={require('../assets/icons/settings.png')}
								resizeMode="contain"
								style={styles.icon(focused)}
							/>
						</View>
					),
					tabBarLabel: ({ focused }) => (
						<Text style={styles.label(focused)}>Account</Text>
					),
				}}
			/>
		</Tab.Navigator>
	);
};

const styles = StyleSheet.create({
	iconSpacing: {
		alignItems: 'center',
		justifyContent: 'center',
		top: '10',
	},
	icon: (focused) => ({
		width: 25,
		height: 25,
		tintColor: focused ? '#f0780c' : '#b8b8b8',
		paddingVertical: 10,
	}),
	label: (focused) => ({
		fontSize: 12,
		color: focused ? '#f0780c' : '#b8b8b8',
	}),
});
export default Tabs;
