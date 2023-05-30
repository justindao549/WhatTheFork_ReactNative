const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		thumbnail_url: { type: String, required: true },
		original_video_url: { type: String, required: false },
		id: { type: Number, required: true },
		total_time_minutes: { type: Number, required: false },
		prep_time_minutes: { type: Number, required: true },
		cook_time_minutes: { type: Number, required: true },
		num_servings: { type: Number, required: true },
		instructions: [
			{
				position: { type: Number, required: true },
				display_text: { type: String, required: true },
			},
		],
		sections: [
			{
				components: [
					{
						position: { type: Number, required: true },
						raw_text: { type: String, required: true },
					},
				],
			},
		],
		topics: [
			{
				name: { type: String, required: true },
			},
		],
		ratings: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData' },
				rating: { type: Number, min: 1, max: 5 },
			},
		],
		reviews: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData' },
				content: { type: String, required: true },
				date: { type: Date, default: Date.now },
				// Include other fields as needed
			},
		],
		averageRating: { type: Number, default: 0 },
		numRatings: { type: Number, default: 0 },
		score: { type: Number, default: 0 },
		default: [],
	},
	{
		collection: 'WTF_RecipesList',
	}
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
// sections: { type: [String], required: true },
// topics: { type: [String], required: true },
// created_at: { type: Date, default: Date.now },
