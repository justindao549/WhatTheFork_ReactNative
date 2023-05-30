import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	FlatList,
	Image,
	StyleSheet,
	TouchableOpacity,
	StatusBar,
	ImageBackground,
	Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../api/baseURL';
import FavoritesImage from '../../assets/images/recipes/Favorites3.jpg';
import { AntDesign } from '@expo/vector-icons';

const Favorites = (props) => {
	const { navigation, bookmarkedRecipes, setBookmarkedRecipes } = props;

	useEffect(() => {
		const fetchBookmarkedRecipes = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				const response = await baseURL.get('/api/bookmarkedRecipes', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				// Dispatch action to set bookmarked recipes
				setBookmarkedRecipes(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchBookmarkedRecipes();
	}, [setBookmarkedRecipes]);

	return (
		<View style={styles.masterContainer}>
			<ImageBackground
				source={FavoritesImage}
				style={styles.headerImage}
				resizeMode="cover">
				<View style={styles.overlay} />
				<Text style={styles.header}>Favorites</Text>
			</ImageBackground>
			<View style={styles.contentContainer}>
				<FlatList
					data={bookmarkedRecipes}
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
										{typeof item.averageRating === 'number'
											? item.averageRating.toFixed(1)
											: 'N/A'}
									</Text>{' '}
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
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		borderRadius: 20, // keep the border radius the same as the image background
	},
	header: {
		fontSize: 50,
		fontWeight: 'bold',
		color: 'white',
		paddingRight: 150,
		paddingBottom: 20,
		textShadowColor: '#f68c05', // Set the shadow color
		textShadowOffset: { width: -2, height: 2 }, // Specify the shadow offset
		textShadowRadius: 4, // Blur the shadow a bit
	},
	contentContainer: {
		backgroundColor: 'white',
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 300,
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

const mapStateToProps = (state) => ({
	bookmarkedRecipes: state.bookmark.bookmarkedRecipes,
});

const mapDispatchToProps = (dispatch) => ({
	setBookmarkedRecipes: (recipes) =>
		dispatch({ type: 'SET_BOOKMARKED_RECIPES', payload: recipes }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
