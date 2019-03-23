const {  GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const _=require('lodash');
const collectionMovie=require('./movies.json');
const CONNECTION_URL = "mongodb+srv://thomas-chheang:azerty@thomas-cluster-uu9od.mongodb.net/test?retryWrites=true";
const client = new MongoClient(CONNECTION_URL, { useNewUrlParser: true });

const {movieType} = require('./types.js');
let {movies} = require('./sandbox.js');

var collection;
client.connect(err => {    
    collection = client.db("ListOfMovies").collection("Movie");
    
})

movieType = new GraphQLObjectType({
    name: 'Movie',
    fields: {
        link: { type: GraphQLString },
        metascore: { type: GraphQLInt },
        year: { type: GraphQLInt },
        synopsis: { type: GraphQLString },
        title: {type: GraphQLString},
        review: {type: GraphQLString},
        date: {type: GraphQLString}
    }
});


const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {

        MovieID: {
            type: movieType,
            
            args: {
                id: { type: GraphQLString }
            },
            resolve: function (source, args) {
               console.log(args.id);
                return _.find(collectionMovie,{id:args.id});
            }
        },
        MovieName: {
            type: movieType,
            args:{
                id:{type: GraphQLString}
            },
            resolve: function(source, args){
                return collection.findOne({"title":args.id});
            }
        },
        Search:{
            type:new GraphQLList(movieType),
            args:{
                limit:{type:GraphQLInt},
                metascore:{type:GraphQLInt}
            },
            resolve: function(source,args){
                return _.filter(collectionMovie,{metascore:args.metascore})
            }
        },
        Random:{
        type: movieType,
        resolve:  async function(request, response) {
            N = await collection.countDocuments({ "metascore": {$gte:70}});
            R = await Math.floor(Math.random() * N);
            const random = await collection.find({ "metascore": {$gte:70}}).limit(1).skip(R).toArray();
            return random[0];
        }
       }
    }
});

exports.queryType = queryType;