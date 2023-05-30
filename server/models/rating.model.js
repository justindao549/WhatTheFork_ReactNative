// models/rating.model.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
		rating: Number,
	},
	{ collection: 'WTF_ratings-data' }
);

module.exports = mongoose.model('Rating', ratingSchema);
