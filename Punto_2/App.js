var express = require('express');
var app = express();
var port = 8081;

app.use(function(req, res, next) {
	req.rawBody = '';
	req.setEncoding('utf8');

	req.on('data', function(chunk) {
		req.rawBody +=chunk;
	});
	
	req.on('end', function() {
		next();
	}); 
});

app.post('/home', function(req, res) {
	console.log("Headers:"+req.rawHeaders);
	console.log("Body:"+req.rawBody);
});

app.listen(port, function(){

})
