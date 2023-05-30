import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import baseURL from '../api/baseURL';
import { useNavigation } from '@react-navigation/native';

const Carousel = ({ recipeIds }) => {
	const navigation = useNavigation();
	const [recipes, setRecipes] = useState([]);

	useEffect(() => {
		const fetchRecipes = async () => {
			const fetchedRecipes = await Promise.all(
				recipeIds.map(async (id) => {
					const res = await baseURL.get(`/api/recipes/byID/${id}`);
					return res.data;
				})
			);
			setRecipes(fetchedRecipes);
		};

		fetchRecipes();
	}, [recipeIds]);

	return (
		<View>
			<Text style={styles.title}>Recommended for you</Text>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.carousel}>
				{recipes.map((recipe) => (
					<TouchableOpacity
						key={recipe.id}
						onPress={() =>
							navigation.navigate('SearchRecipe', { recipe: recipe })
						}>
						<View style={styles.carouselItem}>
							<Image
								source={{ uri: recipe.thumbnail_url }}
								style={styles.carouselItemImage}
							/>
							<Text style={styles.carouselItemTitle}>{recipe.name}</Text>
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	title: { fontSize: 20, marginVertical: 10, fontWeight: 'bold' },
	carousel: {
		// marginTop: 10,
	},
	carouselItem: {
		marginRight: 10,
		width: 200,
		height: 200,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 10,
	},
	carouselItemImage: {
		width: '100%',
		height: '70%',
		borderRadius: 10,
		resizeMode: 'cover',
	},
	carouselItemTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		marginTop: 10,
	},
});

export default Carousel;
