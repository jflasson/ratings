var express = require('express');
var server = express();
var dust = require('dustjs-linkedin');
var consolidate = require('consolidate');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ratings')

server.engine('dust', consolidate.dust);
server.set('view engine', 'dust');
server.set('views', __dirname + '/templates')


server.use(express.static(path.join(process.env.PWD, 'public')));
server.use( bodyParser.json() );
server.use(bodyParser.urlencoded({extended: true}));

var ratingSchema = mongoose.Schema({
	title: String,
	stars: String
});

var Rating = mongoose.model('Rating', ratingSchema);


server.get('/', function(request, response){
  response.render('index');
});


server.get('/index', function(request, response){
  response.render('index');
});

server.post('/submit', function(request, response){
	var title = request.body.title;
	var stars = request.body.stars;
	var tempRating = new Rating({title: title, stars: stars});

	console.log(tempRating);
	tempRating.save(function(error, doc){
		console.log(error);
	});
	
	response.json({status: 0});
	response.end();
});

server.listen(3000, function(){
  console.log('Listening on port 3000'); 
});
