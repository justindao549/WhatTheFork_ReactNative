import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	StatusBar,
	ScrollView,
	TouchableOpacity,
	ImageBackground,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import baseURL from '../../api/baseURL';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookmarkFilled from '../../assets/icons/bookmark-filled.png';
import BookmarkUnfilled from '../../assets/icons/bookmark.png';
import { setBookmarkedRecipes } from '../../redux/actions/userActionBookmark';
import { AntDesign } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import { updateRatings } from '../../redux/slices/userSliceRating';

const SearchRecipe = ({ route, bookmarkedRecipes, setBookmarkedRecipes }) => {
	const { recipe } = route.params;
	const dispatch = useDispatch();

	// States
	const [starCount, setStarCount] = useState(0);
	const [averageRating, setAverageRating] = useState(0);
	const [numRatings, setNumRatings] = useState(0);
	const [bookmarkFilled, setBookmarkFilled] = useState(false);

	const getUserId = async () => {
		const token = await AsyncStorage.getItem('token');
		const decoded = jwt_decode(token);
		return decoded.id;
	};
	// Star rating press event
	const onStarRatingPress = async (rating) => {
		setStarCount(rating);
		try {
			const userId = await getUserId();
			await baseURL.post('/api/rateRecipe', {
				userId,
				recipeId: recipe._id,
				rating,
			}); // Fetch the updated ratings after rating submission
			fetchRating();
		} catch (error) {
			console.log(error);
		}
	};

	// Fetch rating
	const fetchRating = async () => {
		try {
			const res = await baseURL.get(`/api/recipes/${recipe._id}/rating`);
			setAverageRating(res.data.averageRating);
			setNumRatings(res.data.numRatings); // Dispatch the action to update the ratings state
			// Dispatch the action to update the ratings state
			dispatch(
				updateRatings({
					averageRating: res.data.averageRating,
					numRatings: res.data.numRatings,
				})
			);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchRating();
	}, []);

	// Bookmark toggle event
	const toggleBookmark = async () => {
		setBookmarkFilled(!bookmarkFilled);
		if (!bookmarkFilled) {
			try {
				const userId = await getUserId();
				await baseURL.post('/api/addBookmark', {
					userId,
					recipeId: recipe._id,
				});
				setBookmarkedRecipes([...bookmarkedRecipes, recipe]);
			} catch (error) {
				console.log(error);
			}
		}
	};

	// Custom vertical separator
	const VerticalSeparator = () => <View style={styles.verticalSeparator} />;
	//collapsible states
	const [instructionsCollapsed, setInstructionsCollapsed] = useState(true);
	const [ingredientsCollapsed, setIngredientsCollapsed] = useState(true);

	return (
		<ScrollView style={styles.scrollView}>
			<View style={styles.container}>
				<StatusBar translucent backgroundColor="transparent" />
				<ImageBackground
					style={styles.image}
					source={{ uri: recipe.thumbnail_url }}>
					<View style={styles.overlay} />
					<View style={styles.headerRatingsContainer}>
						<Text style={styles.header}>{recipe.name}</Text>
						<View style={styles.ratingsContainer}>
							<View style={styles.ratingColumn}>
								<Text style={styles.text14}>
									<AntDesign name="star" size={14} color="#fdc50e" />{' '}
									{averageRating}
								</Text>
								<Text style={styles.text14}>({numRatings} ratings)</Text>
							</View>
							<VerticalSeparator />
							<Text style={styles.text14}>Servings: {recipe.num_servings}</Text>
							<VerticalSeparator />
							<Text style={styles.text14}>id: {recipe.id}</Text>
						</View>
					</View>
				</ImageBackground>
				<TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkIcon}>
					<Image
						style={styles.bookmarkIconImage}
						source={bookmarkFilled ? BookmarkFilled : BookmarkUnfilled}
					/>
				</TouchableOpacity>
				<View style={styles.descriptionContainer}>
					<Text style={styles.descriptionLabel}>Description:</Text>
					<Text style={styles.descriptionText}>{recipe.description}</Text>
				</View>
				<View style={styles.topicsContainer}>
					{recipe.topics.map((topic, index) => (
						<View key={index} style={styles.topic}>
							<Text style={styles.topicText}>{topic.name}</Text>
						</View>
					))}
				</View>
				<View style={styles.infoContainer}>
					<View style={styles.infoItem}>
						<Text style={styles.infoLabel}>Total Min:</Text>
						<Text style={styles.infoValue}>{recipe.total_time_minutes}</Text>
					</View>
					<View style={styles.infoItem}>
						<Text style={styles.infoLabel}>Prep Min:</Text>
						<Text style={styles.infoValue}>{recipe.prep_time_minutes}</Text>
					</View>
					<View style={styles.infoItem}>
						<Text style={styles.infoLabel}>Cook Min:</Text>
						<Text style={styles.infoValue}>{recipe.cook_time_minutes}</Text>
					</View>
				</View>
				<TouchableOpacity
					style={styles.sectionButton}
					onPress={() => setIngredientsCollapsed(!ingredientsCollapsed)}>
					<View style={styles.sectionButtonContent}>
						<Text style={styles.sectionButtonTitle}>Ingredients</Text>
						{ingredientsCollapsed ? (
							<AntDesign {...styles.plusIcon} />
						) : (
							<AntDesign {...styles.minusIcon} />
						)}
					</View>
				</TouchableOpacity>
				<Collapsible collapsed={ingredientsCollapsed}>
					{recipe.sections.map((section, index) => (
						<View key={index}>
							{section.components.map((component, i) => (
								<Text key={i} style={styles.sectionButtonSteps}>
									<Text style={styles.sectionButtonStepsHeader}>
										{component.position}. {'  '}
									</Text>
									<Text style={styles.orangeText}>{component.raw_text}</Text>
								</Text>
							))}
						</View>
					))}
				</Collapsible>
				<TouchableOpacity
					style={styles.sectionButton}
					onPress={() => setInstructionsCollapsed(!instructionsCollapsed)}>
					<View style={styles.sectionButtonContent}>
						<Text style={styles.sectionButtonTitle}>Instructions</Text>
						{instructionsCollapsed ? (
							<AntDesign {...styles.plusIcon} />
						) : (
							<AntDesign {...styles.minusIcon} />
						)}
					</View>
				</TouchableOpacity>
				<Collapsible collapsed={instructionsCollapsed}>
					{recipe.instructions.map((instruction, index) => (
						<Text key={index} style={styles.sectionButtonSteps}>
							<Text style={styles.sectionButtonStepsHeader}>
								Step: {instruction.position}
							</Text>
							{'  '}
							{instruction.display_text}
						</Text>
					))}
				</Collapsible>
				<Text style={styles.starRatingText}>Rate this Recipe!</Text>
				<StarRating
					disabled={false}
					maxStars={5}
					rating={starCount}
					selectedStar={(rating) => onStarRatingPress(rating)}
					starSize={30} // Adjust the star size as per your requirement
					containerStyle={styles.starRatingContainer} // Add a custom container style
					starStyle={styles.star} // Add a custom star style
				/>
			</View>
		</ScrollView>
	);
};

// Styles
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		width: '100%',
		height: screenHeight * 0.38,
		resizeMode: 'cover',
		justifyContent: 'flex-end', // Align child elements to the bottom
	},
	overlay: {
		...StyleSheet.absoluteFillObject, // This covers the entire area of the parent
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
	},
	bookmarkIconImage: {
		width: 20,
		height: 30,
		resizeMode: 'contain',
		marginTop: StatusBar.currentHeight,
		tintColor: 'white',
	},
	bookmarkIcon: {
		position: 'absolute',
		top: 10,
		right: 10,
		zIndex: 2,
	},
	headerRatingsContainer: {
		paddingBottom: 10, // Padding at the bottom of the container
	},
	header: {
		fontSize: 30,
		fontWeight: 'bold',
		color: 'white',
		paddingVertical: 15, // Give padding on both top and bottom
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(237, 238, 240, 0.5)',
		paddingHorizontal: 5,
	},
	ratingsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	ratingColumn: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text14: {
		fontSize: 14,
		fontWeight: 'bold',
		color: 'rgba(255, 255, 255, 0.8)',
	},
	verticalSeparator: {
		borderLeftWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.5)',
		height: '100%',
		marginHorizontal: 5,
	},

	descriptionContainer: { padding: 10, backgroundColor: '#f5d8b2' },
	descriptionLabel: { color: '#f68c05', fontWeight: 'bold', fontSize: 18 },
	descriptionText: {},
	text: {
		marginTop: 10,
		textAlign: 'center',
		zIndex: 1,
	},
	topicsContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		flexWrap: 'wrap',
		marginTop: 10,
	},
	topic: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		backgroundColor: '#f68c05',
		borderRadius: 20,
		marginVertical: 5,
		marginRight: 5,
	},
	topicText: {
		color: 'white',
		textAlign: 'center',
	},
	infoContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 0,
		// borderBottomColor: '#b8b8b8',
		// borderBottomWidth: 1,
	},
	infoItem: {
		alignItems: 'center',
	},
	infoLabel: {
		fontSize: 14,
		fontWeight: 'bold',
		color: 'black',
	},
	infoValue: {
		marginTop: 5,
		fontSize: 14,
		color: '#454653',
	},
	sectionButtonTitle: { fontWeight: 'bold', fontSize: 14 },
	sectionButton: {
		padding: 20,
		borderColor: '#b8b8b8',
		borderWidth: 1,
		borderRadius: 20,
		marginTop: 20,
		marginHorizontal: 10,
	},
	sectionButtonContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	sectionButtonStepsHeader: { color: '#f68c05', fontWeight: 'bold' },
	sectionButtonSteps: {
		paddingHorizontal: 50,
		marginTop: 10,
		textAlign: 'left',
		zIndex: 1,
	},

	text: {
		marginTop: 10,
		textAlign: 'left',
		zIndex: 1,
	},
	plusIcon: {
		name: 'plus',
		size: 20,
		color: '#f68c05',
		fontWeight: 'bold',
	},
	minusIcon: {
		name: 'minus',
		size: 20,
		color: '#f68c05',
		fontWeight: 'bold',
	},
	starRatingContainer: {
		paddingTop: 10,
		paddingHorizontal: 35,
		paddingBottom: 30,
		backgroundColor: 'white', // Change this to the color of your choice
		borderRadius: 20, // Adjust this to suit your needs
		shadowColor: 'white',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 10,
	},

	starRatingText: {
		paddingTop: 10,
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 20,
		color: '#f68c05',
	},
	star: {
		marginHorizontal: 20, // Add horizontal margin between stars
	},
	scrollView: {
		width: '100%',
		paddingHorizontal: 0,
		backgroundColor: 'white',
	},
});

// Redux
const mapStateToProps = (state) => ({
	bookmarkedRecipes: state.bookmark.bookmarkedRecipes,
});

const mapDispatchToProps = (dispatch) => ({
	setBookmarkedRecipes: (recipes) => dispatch(setBookmarkedRecipes(recipes)),
	updateRatings: (ratings) => dispatch(updateRatings(ratings)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchRecipe);
