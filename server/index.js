require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Recipe = require('./models/recipe.model');
const Rating = require('./models/rating.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

app.use(cors());
app.use(express.json());

const MONGDODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGDODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

//confirm mongoose connection
mongoose.connection.on('connected', () => {
	console.log('Mongoose is connected!!!!!!!');
});

//register/signup
app.post('/api/register', async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		//This code hashes the password using bcrypt.hash() before storing it in the database.
		const user = await User.create({
			fname: req.body.fname,
			lname: req.body.lname,
			email: req.body.email,
			password: hashedPassword,
		});
		// if the user is successfully created, generate a JSON Web Token with the user's name and email, sign it with a secret string
		const token = jwt.sign(
			{ id: user._id, fname: user.fname, lname: user.lname, email: user.email },
			'secret123'
		);
		// return a JSON response with status 'ok' and the generated token
		res.json({ status: 'ok', token });
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' });
	}
});

app.post('/api/login', async (req, res) => {
	// find the user with the provided email using the User model, await for the operation to complete
	const user = await User.findOne({ email: req.body.email });

	// if the user doesn't exist, return a JSON response with status 'error' and an error message
	if (!user) {
		return res.json({ status: 'error', error: 'User Does not Exist' });
	}

	// compare the provided password with the user's hashed password, await for the operation to complete
	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	);

	// if the password is invalid, return a JSON response with status 'error' and an error message
	if (!isPasswordValid) {
		return res.json({ status: 'error', error: 'Invalid login' });
	}

	// if the user exists and the password is valid, generate a JSON Web Token with the user's name and email, sign it with a secret string
	const token = jwt.sign(
		{ id: user._id, fname: user.fname, lname: user.lname, email: user.email },
		'secret123'
	);

	// return a JSON response with status 'ok' and the generated token
	res.json({ status: 'ok', token });
});

app.get('/api/profile', async (req, res) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token) {
			console.log('Missing token');
			return res.sendStatus(401);
		}

		jwt.verify(token, 'secret123', (err, user) => {
			if (err) {
				console.log('Failed to verify token:', err);
				return res.sendStatus(403);
			}

			// Fetch user data from the database
			User.findById(user.id)
				.then((user) => {
					if (!user) return res.status(404).json({ error: 'User not found' });

					// return the user data
					res.json({
						fname: user.fname,
						lname: user.lname,
						email: user.email,
						// Include other user details as needed
					});
				})
				.catch((error) => {
					console.log("Error in '/api/profile':", err);
					res.status(500).send('Internal server error');
				});
		});
	} catch (err) {
		console.log(err);
		res.status(500).send('Internal server error');
	}
});

app.get('/api/recipes/:id/rating', async (req, res) => {
	try {
		const recipeId = req.params.id;
		const ratings = await Rating.find({ recipeId });
		const averageRating =
			ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
		const numRatings = ratings.length; // This will give you the number of ratings
		res.json({
			averageRating: averageRating.toFixed(1),
			numRatings: numRatings, // send the number of ratings
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.post('/api/rateRecipe', async (req, res) => {
	try {
		const { userId, recipeId, rating } = req.body;

		// Check if a rating already exists for this user and recipe
		let ratingDoc = await Rating.findOne({ userId, recipeId });

		if (ratingDoc) {
			// Update the existing rating
			ratingDoc.rating = rating;
		} else {
			// Create a new rating
			ratingDoc = new Rating({ userId, recipeId, rating });
		}

		await ratingDoc.save();

		// Calculate the new average rating and number of ratings
		const ratings = await Rating.find({ recipeId });
		const averageRating =
			ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
		const numRatings = ratings.length;

		// Update the user with the new rating
		const user = await User.findById(userId);
		const ratedRecipe = user.ratedRecipes.find(
			(rec) => rec.recipeId.toString() === recipeId
		);
		if (ratedRecipe) {
			ratedRecipe.rating = rating;
		} else {
			user.ratedRecipes.push({ recipeId, rating });
		}
		await user.save();

		// Update the recipe with the new average rating, number of ratings, and score
		const recipe = await Recipe.findById(recipeId);
		recipe.averageRating = averageRating;
		recipe.numRatings = numRatings;
		recipe.score = averageRating * numRatings;
		await recipe.save();

		res.json({ status: 'ok' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.get('/api/topRecipes', async (req, res) => {
	try {
		// Fetch the recipe details for each of the top rated recipes
		const topRecipes = await Recipe.find().sort({ score: -1 }).limit(3);

		res.json(topRecipes);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.post('/api/addBookmark', async (req, res) => {
	try {
		const { userId, recipeId } = req.body;

		// find the user with the provided id
		const user = await User.findById(userId);

		// if the user doesn't exist, return a JSON response with status 'error' and an error message
		if (!user) {
			return res.json({ status: 'error', error: 'User Does not Exist' });
		}

		// add the recipeId to the user's bookmarkedRecipes
		user.bookmarkedRecipes.push(recipeId);

		// save the user document
		await user.save();

		res.json({ status: 'ok' });
	} catch (error) {
		console.error(error); // Log the error
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.get('/api/bookmarkedRecipes', async (req, res) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token) return res.sendStatus(401);

		jwt.verify(token, 'secret123', async (err, user) => {
			if (err) return res.sendStatus(403);

			// Fetch user data from the database
			const userData = await User.findById(user.id);
			if (!userData) return res.status(404).json({ error: 'User not found' });

			// Fetch each bookmarked recipe
			const bookmarkedRecipes = await Recipe.find({
				_id: { $in: userData.bookmarkedRecipes },
			});

			// return the bookmarked recipes
			res.json(bookmarkedRecipes);
		});
	} catch (err) {
		console.log(err);
		res.status(500).send('Internal server error');
	}
});

app.get('/', async (req, res) => {
	try {
		const val = await User.find();
		res.json(val);
	} catch (err) {
		console.log(err);
	}
});

app.get('/api/recipes', async (req, res) => {
	try {
		const searchText = req.query.searchText;
		const searchRegex = new RegExp(searchText, 'i');
		const filteredRecipes = await Recipe.find(
			{
				$or: [
					{ name: searchRegex },
					{ 'topics.name': searchRegex },
					{ tags: { $elemMatch: { name: searchRegex } } },
				],
			},
			{
				name: 1,
				description: 1,
				thumbnail_url: 1,
				id: 1,
				original_video_url: 1,
				total_time_minutes: 1,
				prep_time_minutes: 1,
				cook_time_minutes: 1,
				num_servings: 1,
				instructions: 1,
				sections: 1,
				topics: 1,
				tags: 1,
				averageRating: 1,
				numRatings: 1,
			}
		);
		res.json(filteredRecipes);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal server error');
	}
});

//search by object id field
app.get('/api/recipes/:id', async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.id);
		if (!recipe) {
			return res.status(404).json({ error: 'Recipe not found' });
		}
		res.json(recipe);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal server error');
	}
});

//search by id field
app.get('/api/recipes/byId/:id', async (req, res) => {
	try {
		const recipe = await Recipe.findOne({ id: req.params.id });
		if (!recipe) {
			return res.status(404).json({ error: 'Recipe not found' });
		}
		res.json(recipe);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal server error');
	}
});

app.listen(1337, () => {
	console.log('Server Is Connected!');
});
