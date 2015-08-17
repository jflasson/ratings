var express = require('express');
var server = express();
var dust = require('dustjs-linkedin');
var consolidate = require('consolidate');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
mongoose.connect('mongodb://localhost/ratings')

dust.config.whitespace = true;

server.engine('dust', consolidate.dust);
server.set('view engine', 'dust');
server.set('views', __dirname + '/templates')


server.use(express.static(path.join(process.env.PWD, 'public')));
server.use( bodyParser.json() );
server.use(bodyParser.urlencoded({extended: true}));

var ratingSchema = mongoose.Schema({
	title: String,
	stars: Number
});

var Rating = mongoose.model('Rating', ratingSchema);
var tags = [];


server.get('/', function(request, response){
  response.render('index');
});



server.get('/index', function(request, response){
  response.render('index');
});


server.post('/submit', function(request, response){
	console.log(request.body.star);
	var title = request.body.title,
		stars = request.body.star,
		tempRating = new Rating({title: title, stars: stars});
	tempRating.save(function(error, doc){
	});
	response.json({status: 0});
	response.end();
});


server.post('/submit/show', function(req, res){
	var title = req.body.title,
		requestString = 'http://services.tvrage.com/feeds/search.php?show=' + title;
	console.log("Query= " + requestString);
	request(requestString, function(error, response, body){
		tags = getTagContentsFromXML(body, "<name>");
		console.log(tags);
		res.send(tags);
	});
});


server.listen(3000, function(){
  console.log('Listening on port 3000'); 
});


var getTagContentsFromXML = function(xml, tag){
	var contents = [],
		tagLength = tag.length;
	for(var i = 0; i < xml.length; i++){
		if(xml.substring(i, i + tagLength) == tag){
			for(var j = i +tagLength + 1; j < xml.length; j++){
				if(xml.substring(j, j + tagLength + 1) == "</" + tag.substring(1, tagLength)){
					var tagFound = xml.substring(i+ tagLength, j) 
					//console.log("Tag: " + tagFound);
					contents.push(tagFound);
					break;
				}
			}
		}
	}
	return contents;
}

/* This is silly
var buildSelect = function(items){
	var select = "<select>\n";
	for(var item in items){
		select.concat("<option value = " + item +">" + item +"</option>");
		select.concat("\n");
	}
	select.concat("</select>");
	return select;
}
*/

/* Deprecated specific version
var getShowNames = function(xml){
	var showNames = [];
	var stop = 0;
	for(var i = 0; i < xml.length; i++){
		if(xml.substring(i, i+6) == "<name>"){
			for(var j = i +7; j < i+100; j++){
				if(xml[j] == "<"){
					stop = j;
					var nameFound = xml.substring(i+6, stop) 
					//console.log("Name found: " + nameFound);
					showNames.push(nameFound);
					break;
				}
			}
		}
	}
	return showNames;
}
*/