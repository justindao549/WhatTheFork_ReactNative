import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../../redux/actions/userActionLogin';
import {
	Text,
	View,
	TouchableOpacity,
	Image,
	FlatList,
	StyleSheet,
	ImageBackground,
	Dimensions,
} from 'react-native';
import { COLORS } from '../../constants';
import baseURL from '../../api/baseURL';
import Carousel from '../../components/Carousel';
import { AntDesign } from '@expo/vector-icons';
import HomeBackground from '../../assets/images/recipes/Home.jpg';
import { useNavigation } from '@react-navigation/native';
import { selectUserRating } from '../../redux/slices/userSliceRating';

const Home = () => {
	const navigation = useNavigation();
	const dispatch = useDispatch(); // Get the dispatch function
	const [topRecipes, setTopRecipes] = useState([]);
	// Access the user state from your Redux store
	// Make sure 'user' matches the key set for userReducerLogin in your root reducer
	const user = useSelector((state) => state.login);
	const fetchTopRecipes = async () => {
		try {
			const res = await baseURL.get('/api/topRecipes');
			setTopRecipes(res.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchTopRecipes();
		dispatch(fetchUserProfile()); // Dispatch the action to fetch user profile
	}, []);

	return (
		<View style={styles.masterContainer}>
			<ImageBackground
				source={HomeBackground}
				style={styles.headerImage}
				resizeMode="cover">
				<View style={styles.overlay} />
				<Text style={styles.header}>
					Welcome {user ? user.fname : 'Loading...'}!
				</Text>
			</ImageBackground>
			<View style={styles.contentContainer}>
				<Text style={styles.subheader}>Popular this Week</Text>
				<FlatList
					data={topRecipes}
					style={styles.popularHeader}
					keyExtractor={(item) => item._id}
					renderItem={({ item }) => (
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
								<Text style={styles.recipeName}>{item.name}</Text>
								<Text>
									<AntDesign name="star" size={14} color="#fdc50e" />{' '}
									<Text style={styles.recipeRating}>
										{item.averageRating.toFixed(1)}
									</Text>
									<Text style={styles.numRatings}>
										{' '}
										({item.numRatings || 0} ratings)
									</Text>
								</Text>
								<Text
									style={styles.recipeDescription}
									numberOfLines={4}
									ellipsizeMode="tail">
									{' '}
									{item.description}
								</Text>
								<Text style={styles.numRatings}>
									{/* Score: {item.score || 0} */}
									{/* ID: {item._id} */}
								</Text>
							</View>
						</TouchableOpacity>
					)}
				/>

				<Carousel recipeIds={[7195, 7758, 8147]} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	masterContainer: {
		backgroundColor: COLORS.white,
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
		color: COLORS.white,
		paddingRight: 150, // add left padding to move text to the right
		paddingBottom: 20,
		textShadowColor: '#f68c05', // Set the shadow color
		textShadowOffset: { width: -2, height: 2 }, // Specify the shadow offset
		textShadowRadius: 4, // Blur the shadow a bit
	},
	contentContainer: {
		backgroundColor: COLORS.white,
		paddingHorizontal: 20,
		borderTopLeftRadius: 30, // Add top left radius
		borderTopRightRadius: 30, // Add top right radius
		marginTop: -30, // Pull the container up to cut into the image
		overflow: 'hidden',
	},

	popularHeader: { height: '32%' },
	subheader: { fontSize: 20, marginVertical: 10, fontWeight: 'bold' },
	touchable: {
		backgroundColor: '#white',
		borderRadius: 0, // For round edges
		borderBottomColor: '#d3d2da',
		paddingBottom: 10,
		borderBottomWidth: 1,
		marginVertical: 5, // For space between items
		flexDirection: 'row',
		alignItems: 'stretch',
	},
	recipeContainer: {
		flex: 1,
		flexDirection: 'column', // changed from 'row' to 'column'
		padding: 10, // Padding inside the recipe container
		height: 100, // Increase height by 5px
	},
	recipeImage: {
		width: 120,
		height: 120,
		resizeMode: 'cover',
		borderRadius: 10, // For round edges
		// marginTop: StatusBar.currentHeight,
	},
	recipeName: {
		fontWeight: 'bold',
		marginBottom: 5, // added margin to separate the name from the rating
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
	recipeDescription: {
		fontSize: 12,
		color: 'grey',
	},
});

export default Home;
