const mongoose = require('mongoose');

const User = new mongoose.Schema(
	{
		fname: { type: String, required: true },
		lname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		bookmarkedRecipes: [
			{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
		],
		ratedRecipes: [
			{
				recipeId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Rating',
				},
				rating: { type: Number },
			},
		],
	},
	{ collection: 'WTF_user-data' }
);

const model = mongoose.model('UserData', User);

module.exports = model;
