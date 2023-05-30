import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	Image,
	ImageBackground,
	TouchableOpacity,
	StyleSheet,
	StatusBar,
	Dimensions,
} from 'react-native';
import baseURL from '../../api/baseURL';
import { AntDesign } from '@expo/vector-icons';
import American from '../../assets/images/cuisine/American.jpg';
import Asian from '../../assets/images/cuisine/Asian.jpg';
import French from '../../assets/images/cuisine/French.jpg';
import Indian from '../../assets/images/cuisine/Indian.jpg';
import Italian from '../../assets/images/cuisine/Italian.jpg';
import Japanese from '../../assets/images/cuisine/Japanese.jpg';
import Mediterranean from '../../assets/images/cuisine/Mediterranean.jpg';
import Mexican from '../../assets/images/cuisine/Mexican.jpg';
import Seafood from '../../assets/images/cuisine/Seafood.jpg';
import Latin from '../../assets/images/cuisine/Spanish.jpg';

const cuisineImages = {
	American,
	Japanese,
	Italian,
	Mexican,
	Indian,
	French,
	Asian,
	Latin,
	Mediterranean,
	Seafood,
};

const SearchCategory = ({ route, navigation }) => {
	const [recipes, setRecipes] = useState([]);
	const { category } = route.params;

	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				const response = await baseURL.get('/api/recipes', {
					params: { searchText: category },
				});
				setRecipes(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchRecipes();
	}, [category]);
	const categoryImage = cuisineImages[category];
	return (
		<View style={styles.masterContainer}>
			<ImageBackground
				source={categoryImage}
				style={styles.headerImage}
				resizeMode="cover">
				<View style={styles.overlay} />
				<Text style={styles.header}>{category} Recipes</Text>
			</ImageBackground>
			<View style={styles.contentContainer}>
				<FlatList
					data={recipes}
					keyExtractor={(item) => item._id}
					renderItem={({ item, index }) => (
						<TouchableOpacity
							style={styles.touchable}
							onPress={() =>
								navigation.navigate('SearchRecipe', { recipe: item })
							}>
							<Image
								style={styles.recipeImage}
								source={{ uri: item.thumbnail_url }}
							/>
							<View style={styles.recipeContainer}>
								<Text style={styles.recipeIndex}>
									{index + 1}. {item.name}
								</Text>
								<Text>
									<AntDesign name="star" size={14} color="#fdc50e" />{' '}
									<Text style={styles.recipeRating}>
										{item.averageRating.toFixed(1)}{' '}
									</Text>
									<Text style={styles.numRatings}>
										({item.numRatings} ratings)
									</Text>
								</Text>
								<Text
									style={styles.numRatings}
									numberOfLines={3}
									ellipsizeMode="tail">
									{' '}
									{item.description}
								</Text>
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	masterContainer: {
		backgroundColor: 'white',
		flex: 1,
	},
	headerImage: {
		width: '100%',
		height: Dimensions.get('window').height * 0.3,
		justifyContent: 'center',
		alignItems: 'center',
	},
	overlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.35)',
		borderRadius: 20, // keep the border radius the same as the image background
	},
	header: {
		fontSize: 30,
		fontWeight: 'bold',
		color: 'white',
		// paddingRight: 250, // add left padding to move text to the right
		// paddingBottom: 100,
	},
	contentContainer: {
		backgroundColor: 'white',
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 240,
		borderTopLeftRadius: 30, // Add top left radius
		borderTopRightRadius: 30, // Add top right radius
		marginTop: -30, // Pull the container up to cut into the image
		overflow: 'hidden',
	},

	touchable: {
		backgroundColor: '#white',
		borderBottomColor: '#d3d2da',
		borderBottomWidth: 1,
		paddingVertical: 15,
		flexDirection: 'row',
		alignItems: 'stretch',
	},
	recipeImage: {
		width: 120,
		resizeMode: 'stretch',
		borderRadius: 10, // For round edges
	},
	recipeContainer: {
		flex: 1,
		flexDirection: 'column', // changed from 'row' to 'column'
		padding: 10, // Padding inside the recipe container
		height: 100,
	},
	recipeIndex: {
		fontWeight: 'bold',
		marginRight: 5,
	},
	recipeRating: {
		fontSize: 14,
		color: 'black',
		fontWeight: 'bold',
	},
	numRatings: {
		fontSize: 12,
		color: 'grey',
	},
});

export default SearchCategory;
