require('dotenv').config();
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
const MONGDODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGDODB_URI);
// run command in terminal where folder is 'node rapidapiToMongo.js'
//mongodbcompass (filter contains chx)->{name:/Chicken/}

// define an async function to execute your code
async function main() {
	const options = {
		method: 'GET',
		url: 'https://tasty.p.rapidapi.com/recipes/list',
		params: {
			from: '0',
			size: '50',
			tags: 'under_30_minutes',
			q: 'spanish',
		},
		headers: {
			'X-RapidAPI-Key': '4ddf7cb479mshc34ed35cc4cfba0p15963ejsnbdba782ba2ab',
			'X-RapidAPI-Host': 'tasty.p.rapidapi.com',
		},
	};

	try {
		const response = await axios.request(options);
		const recipes = response.data.results; // assuming the data is in an array called 'results'

		await client.connect();
		const db = client.db('test'); // replace with your database name
		const collection = db.collection('WTF_RecipesList'); // replace with your collection name

		// insert each recipe into the database
		for (const recipe of recipes) {
			// await collection.insertOne(recipe);
			await collection.updateOne(
				{ id: recipe.id }, // find a document with the same 'id'
				{ $set: recipe }, // update the document or insert 'recipe' if it doesn't exist
				{ upsert: true } // create a new document if no documents match the filter
			);
		}

		console.log('Data inserted into database');
	} catch (error) {
		console.error(error);
	} finally {
		await client.close();
	}
}
// call the async function
main();
