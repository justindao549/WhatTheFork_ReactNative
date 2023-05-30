import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';

const Background = ({ children }) => {
	return (
		<View style={styles.Background}>
			<View style={styles.tint}>
				<ImageBackground
					source={require('../assets/images/system/login-background2.jpg')}
					style={styles.ImageBackground}>
					<LinearGradient
						colors={[COLORS.transparent, 'white']}
						start={{ x: 0, y: 0.9 }}
						end={{ x: 0, y: 1 }}
						style={styles.Gradient}
					/>
				</ImageBackground>
			</View>
			<View style={{ position: 'absolute', bottom: 0 }}>{children}</View>
		</View>
	);
};

export default Background;

const styles = StyleSheet.create({
	Background: {
		flex: 1,
		backgroundColor: 'white',
	},
	tint: {
		opacity: 0.95, // Adjust to your preference
		backgroundColor: 'black', // Adjust to your preference
	},
	ImageBackground: {
		height: '100%',
		position: 'relative',
	},
	Gradient: {
		position: 'absolute',
		bottom: 0,
		height: '95%',
		width: '100%',
	},
});
