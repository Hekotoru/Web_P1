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
	var arrHeaders;
	arrHeaders = [];
	var HeaderJson = JSON.parse(JSON.stringify(req.headers));
	for( var value in HeaderJson)
	{
		arrHeaders.push(HeaderJson[value]);
	}
	/*console.log("Headers:"+ HeaderJson);*/
	var HtJson = {
		"method" : req.method,
		"path" : req.path,
		"host" : ports[0],
		"port" : ports[1],
		"header": arrHeaders
	}
	res.send(HtJson);
});

app.listen(port, function(){

})
