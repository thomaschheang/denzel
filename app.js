const Express = require("express");
//const {queryType} = require('./query.js');
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
var cors = require('cors');
const imdb = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';

const CONNECTION_URL = "mongodb+srv://thomas-chheang:azerty@thomas-cluster-uu9od.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "denzel";
const client = new MongoClient(CONNECTION_URL, { useNewUrlParser: true });

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

async function sandbox (denzel_imdb_id)
{
	app.listen(3000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("people");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
	});

	app.get("/movies/search", (request, response) => {
    req=request.query;
    var metascore=parseInt(req.metascore)
    var limit=parseInt(req.limit)
    console.log(req.limit);
    collection.find({"metascore":{$gte:metascore}}).limit(limit).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
    });

    app.get("/movies/populate", async function (request, response) {
    const movies = await imdb(actor);
    client.connect(err => {    
    collection = client.db("ListOfMovies").collection("Movie");
    collection.insert(movies, null, function (error, results) {
    if (error) throw error;
        exports.collection = collection;
    });
    });
        response.send(movies);
    });

	app.get("/movies", (request, response) => {
    collection.find({"metascore":{$gte:70}}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
    });

	app.get("/movie/:id", (request, response) => {
    collection.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
	});
}

sandbox(DENZEL_IMDB_ID);