import React, { useState, useRef, useEffect } from 'react';
import {
	View,
	TextInput,
	FlatList,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
	ImageBackground,
	Dimensions,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import baseURL from '../../api/baseURL';
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
import SearchImage from '../../assets/images/recipes/Search.jpg';

const Search = ({ navigation }) => {
	const [searchText, setSearchText] = useState('');
	const [recipes, setRecipes] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const searchInputRef = useRef();

	const searchRecipes = async () => {
		try {
			const response = await baseURL.get('/api/recipes', {
				params: { searchText },
			});
			const recipesWithRatings = await Promise.all(
				response.data.map(async (recipe) => {
					const ratingsResponse = await baseURL.get(
						`/api/recipes/${recipe._id}/rating`
					);
					return { ...recipe, ...ratingsResponse.data };
				})
			);
			setRecipes(recipesWithRatings);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (isSearching) {
			searchInputRef.current.focus();
		} else {
			searchInputRef.current.blur();
		}
	}, [isSearching]);

	const categories = [
		'American',
		'Japanese',
		'Italian',
		'Mexican',
		'Indian',
		'French',
		'Asian',
		'Latin',
		'Mediterranean',
		'Seafood',
	];

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

	const CategoryButton = ({ name, onPress }) => (
		<TouchableOpacity
			style={styles.category}
			onPress={() => {
				setIsSearching(false);
				onPress(name);
			}}>
			<View style={styles.cuisineImageWrapper}>
				<ImageBackground
					source={cuisineImages[name]}
					style={styles.cuisineImage}>
					<View style={styles.headerOverlay} />
					<Text style={styles.categoryText}>{name}</Text>
				</ImageBackground>
			</View>
		</TouchableOpacity>
	);

	const handleCategoryPress = (category) => {
		navigation.navigate('SearchCategory', {
			category: category,
			categoryImage: cuisineImages[category],
		});
	};

	return (
		<View style={styles.masterContainer}>
			<ImageBackground
				source={SearchImage}
				style={styles.headerImage}
				resizeMode="cover">
				<View style={styles.headerOverlay} />
				<View style={styles.headerWrapper}>
					<Text style={styles.header}>Search</Text>
				</View>
				<View style={styles.searchBar}>
					{isSearching && (
						<TouchableOpacity onPress={() => setIsSearching(false)}>
							<Ionicons name="arrow-back" size={24} color="black" />
						</TouchableOpacity>
					)}
					<TextInput
						ref={searchInputRef}
						style={{ flex: 1 }}
						placeholder="Search"
						value={searchText}
						onChangeText={(text) => setSearchText(text)}
						onSubmitEditing={searchRecipes}
						onFocus={() => setIsSearching(true)}
					/>
					<TouchableOpacity onPress={searchRecipes}>
						<Ionicons name="search" size={24} color="black" />
					</TouchableOpacity>
				</View>
			</ImageBackground>
			<View style={styles.contentContainer}>
				{isSearching && (
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
									<Text style={styles.recipeName}>
										{index + 1}. {item.name}
									</Text>
									<Text>
										<AntDesign name="star" size={14} color="#fdc50e" />{' '}
										<Text style={styles.recipeRating}>
											{item.averageRating}
										</Text>{' '}
										<Text style={styles.numRatings}>
											({item.numRatings} ratings)
										</Text>
									</Text>
								</View>
							</TouchableOpacity>
						)}
					/>
				)}
				{!isSearching && (
					<FlatList
						style={{ flex: 1 }}
						contentContainerStyle={{ paddingBottom: 10 }}
						data={categories}
						numColumns={2}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<CategoryButton name={item} onPress={handleCategoryPress} />
						)}
					/>
				)}
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
	headerWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between', // Add this line
		marginHorizontal: 20, // Update this line
		marginTop: 70,
	},

	headerOverlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.05)', // Add a slight tint to the image background
		borderRadius: 20,
	},
	header: {
		fontSize: 50,
		fontWeight: 'bold',
		color: 'white',
		paddingRight: 200,
		// paddingBottom: 50,
		textShadowColor: '#f68c05',
		textShadowOffset: { width: -2, height: 2 },
		textShadowRadius: 4,
	},
	searchBar: {
		flexDirection: 'row',
		backgroundColor: '#f6f6f6',
		borderColor: '#b8b8b8',
		borderWidth: 1,
		borderRadius: 20,
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 5,
		marginBottom: 80,
		marginLeft: 20,
		marginRight: 20,
	},
	contentContainer: {
		flex: 1,
		backgroundColor: 'white',
		paddingTop: 20,
		paddingBottom: 65,
		paddingHorizontal: 20,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		marginTop: -30,
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
	recipeContainer: {
		flex: 1,
		flexDirection: 'column',
		padding: 10,
		height: 100,
	},
	recipeImage: {
		width: 120,
		resizeMode: 'stretch',
		borderRadius: 10,
	},
	recipeName: {
		fontWeight: 'bold',
		marginBottom: 5,
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
	category: {
		flex: 1,
		aspectRatio: 1,
		margin: 5,
		backgroundColor: '#white',
	},
	categoryText: {
		flex: 1,
		textAlign: 'center',
		textAlignVertical: 'center',
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	cuisineImageWrapper: {
		width: '100%',
		height: '100%',
		borderRadius: 20,
		overflow: 'hidden',
	},
	cuisineImage: {
		width: '100%',
		height: '100%',
	},
	overlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		borderRadius: 20,
	},
});

export default Search;
