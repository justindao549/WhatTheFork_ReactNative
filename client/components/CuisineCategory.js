import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CuisineCategory = ({ name, onPress }) => (
	<TouchableOpacity style={styles.category} onPress={() => onPress(name)}>
		<Text style={styles.categoryText}>{name}</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	category: {
		margin: 10,
		padding: 10,
		borderRadius: 5,
		backgroundColor: '#f0f0f0',
	},
	categoryText: {
		textAlign: 'center',
	},
});

export default CuisineCategory;
