var express = require('express');
var app = express();
var port = 8081;

app.get('/home', function(req, res) {
	console.log("Hostname:" + req.hostname);
	console.log("Protocol:" + req.protocol);
	console.log("Original URL:" + req.originalUrl);
	console.log("Path:" + req.path);
	var ports= req.get('host').split(":");
	console.log("Port:" + ports[1]);
})

app.listen(port, function(){

})
