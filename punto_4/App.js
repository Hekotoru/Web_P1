/*Repo: https://github.com/Hekotoru/Web_P1*/

var express = require('express');
var app = express();
var port = 8081;


app.get('*', function(req, res) {
	var ports = req.get('host').split(":");
	/*
	console.log("Method:" + req.method);
	console.log("Path:" + req.path);
	console.log("Port:" + ports[1]);
	*/
	var HeaderJson = JSON.stringify(req.headers);
	/*console.log("Headers:"+ HeaderJson);*/
	var HtJson = {
		"method" : req.method,
		"path" : req.path,
		"host" : req.get('host'),
		"port" : ports[1],
		"header": HeaderJson
	}
	res.send(HtJson);
});

app.listen(port, function(){

})
