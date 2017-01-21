var express = require('express');
var app = express();
var port = 8081;


app.get('/home', function(req, res) {
	var ports = req.get('host').split(":");
	/*
	console.log("Method:" + req.method);
	console.log("Path:" + req.path);
	console.log("Port:" + ports[1]);
	*/
	var HeaderJson = JSON.stringify(req.headers);
	/*console.log("Headers:"+ HeaderJson);*/
	var HtJson = {
		"Method" : req.method,
		"Path" : req.path,
		"Port" : ports[1],
		"Headers": HeaderJson
	}
	res.send(HtJson);
});

app.listen(port, function(){

})
